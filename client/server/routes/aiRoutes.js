import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Preparation } from '../models/Preparation.js'
import { callGrokJSON } from '../services/grokService.js'
import * as ragService from '../services/ragService.js'
import * as agent from '../services/agentOrchestrator.js'
import * as decisionEngine from '../services/decisionEngine.js'

export const aiRoutes = Router()
aiRoutes.use(authMiddleware)

// File upload config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB — students may upload large notes
  fileFilter: (_req, file, cb) => {
    // Accept PDF, text, markdown, docx, and anything that looks like a document
    const name = (file.originalname || '').toLowerCase()
    const allowed = ['text/plain', 'application/pdf', 'text/markdown', 'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    const allowedExt = ['.pdf', '.txt', '.md', '.docx', '.doc', '.rtf', '.csv']
    const ext = name.slice(name.lastIndexOf('.'))
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('text/') || allowedExt.includes(ext)) {
      cb(null, true)
    } else {
      // Accept anyway — extractTextFromFile will handle the rest
      cb(null, true)
    }
  },
})

// ═══ BULLETPROOF TEXT EXTRACTION ═══
// Tries multiple strategies to extract text from any file type.
// Returns extracted text or null if all strategies fail.
async function extractTextFromFile(file) {
  const name = (file.originalname || '').toLowerCase()
  const isPdf = file.mimetype === 'application/pdf' || name.endsWith('.pdf')
  const isDocx = file.mimetype?.includes('wordprocessingml') || name.endsWith('.docx')

  // Strategy 1: pdf-parse library
  if (isPdf) {
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(file.buffer)
      if (data.text && data.text.trim().length >= 20) {
        console.log(`[Extract] pdf-parse success: ${data.text.length} chars from ${file.originalname}`)
        return data.text
      }
    } catch (err) {
      console.error('[Extract] pdf-parse failed:', err.message)
    }
    // Strategy 1b: Try pdf-parse with pagerender option
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(file.buffer, {
        pagerender: async (pageData) => (await pageData.getTextContent()).items.map(i => i.str).join(' '),
      })
      if (data.text && data.text.trim().length >= 20) {
        console.log(`[Extract] pdf-parse+pagerender success: ${data.text.length} chars`)
        return data.text
      }
    } catch (err) {
      console.error('[Extract] pdf-parse+pagerender failed:', err.message)
    }
  }

  // Strategy 2: DOCX XML extraction
  if (isDocx) {
    try {
      const raw = file.buffer.toString('utf-8')
      const textMatches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
      if (textMatches && textMatches.length > 0) {
        const extracted = textMatches.map(m => m.replace(/<[^>]+>/g, '')).join(' ')
        if (extracted.trim().length >= 20) {
          console.log(`[Extract] DOCX XML success: ${extracted.length} chars from ${file.originalname}`)
          return extracted
        }
      }
    } catch (err) {
      console.error('[Extract] DOCX XML failed:', err.message)
    }
  }

  // Strategy 3: Raw UTF-8 with binary stripping (works for .txt, .md, and fallback)
  try {
    let raw = file.buffer.toString('utf-8')
    raw = raw.replace(/[\x00-\x08\x0E-\x1F]/g, ' ').replace(/\s+/g, ' ').trim()
    if (raw.length >= 20) {
      console.log(`[Extract] Raw UTF-8 fallback: ${raw.length} chars from ${file.originalname}`)
      return raw
    }
  } catch (err) {
    console.error('[Extract] Raw fallback failed:', err.message)
  }

  // All strategies failed
  console.error(`[Extract] All strategies failed for ${file.originalname} (${file.mimetype}, ${file.buffer?.length} bytes)`)
  return null
}

// ═══ ANALYZE FILE (server-side PDF parsing + Grok) ═══
aiRoutes.post('/analyze-file', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  const text = await extractTextFromFile(file)
  if (!text) {
    return res.status(400).json({ success: false, message: 'Could not read file content. It may be image-based or corrupted. Try the Paste syllabus text option instead.' })
  }

  const subject = req.body.subject || ''

  // Run RAG indexing and Grok analysis IN PARALLEL for speed
  const materialId = `mat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  const ragPromise = agent.indexStudyMaterial(req.user.userId, materialId, file.originalname, file.mimetype, text, ragService)
    .then(() => console.log(`[AnalyzeFile] RAG indexed: ${file.originalname} (${text.length} chars)`))
    .catch(err => console.error('[AnalyzeFile] RAG indexing failed:', err.message))

  const grokPromise = agent.analyzeSyllabus(req.user.userId, text, {
    analyzeSyllabus: async (t) => callGrokJSON(
      `You are an academic syllabus analyzer. Extract structured topics from this document.
Return JSON: { "subjects": [{ "name": "string", "examDate": "YYYY-MM-DD or empty", "units": [{ "name": "string", "topics": [{ "name": "string", "difficulty": "easy|medium|hard", "importance": "high|medium|low", "estimatedMinutes": 60 }] }] }] }
Extract ALL subjects, units, topics from the document. If exam dates are mentioned, include them. Return ONLY valid JSON.`,
      `Subject context: ${subject}\n\nDocument content:\n${t.slice(0, 8000)}`
    ),
  }).catch(err => {
    console.error('[AnalyzeFile] Grok analysis failed:', err.message)
    return { subjects: [] }
  })

  // Wait for BOTH to complete — whichever finishes last determines response time
  const [_, result] = await Promise.all([ragPromise, grokPromise])

  return res.json({ success: true, data: { ...(result || { subjects: [] }), fileName: file.originalname, textLength: text.length } })
}))

// ═══ ANALYZE TIMETABLE (server-side PDF parsing) ═══
aiRoutes.post('/analyze-timetable', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  let text = ''
  if (file.mimetype === 'application/pdf') {
    try {
      const pdfParse = (await import('pdf-parse')).default
      const data = await pdfParse(file.buffer)
      text = data.text
    } catch {
      return res.status(400).json({ success: false, message: 'Failed to parse PDF.' })
    }
  } else {
    text = file.buffer.toString('utf-8')
  }

  if (!text || text.trim().length < 10) {
    return res.status(400).json({ success: false, message: 'File content is too short or empty.' })
  }

  const result = await callGrokJSON(
    `You are a timetable parser. Extract exam/subject information from this timetable document.
Return JSON: { "exams": [{ "name": "subject name", "date": "YYYY-MM-DD", "time": "HH:MM", "marks": 100 }] }
Extract ALL exams with their dates, times, and marks. If a field is not found, use reasonable defaults. Return ONLY valid JSON.`,
    `Timetable content:\n${text.slice(0, 6000)}`
  )

  return res.json({ success: true, data: { ...result, fileName: file.originalname } })
}))

// ═══ SYLLABUS ANALYSIS ═══
aiRoutes.post('/analyze-syllabus', asyncHandler(async (req, res) => {
  const { syllabusText, subject } = req.body
  console.log(`[Syllabus] Analysis request received — subject: ${subject}, text length: ${syllabusText?.length || 0}`)
  if (!syllabusText) {
    return res.status(400).json({ success: false, message: 'syllabusText is required' })
  }

  // Trim syllabus text to 3000 chars max — shorter = faster Grok response
  const trimmedText = syllabusText.length > 3000 ? syllabusText.slice(0, 3000) : syllabusText
  console.log(`[Syllabus] Text length after trim: ${trimmedText.length}`)
  console.log(`[Syllabus] Starting Grok request...`)
  const t0 = Date.now()
  let result
  try {
    result = await agent.analyzeSyllabus(req.user.userId, trimmedText, {
      analyzeSyllabus: async (text) => callGrokJSON(
        `Extract topics from this syllabus text. Return JSON:\n{"subjects":[{"name":"...","units":[{"name":"...","topics":[{"name":"...","difficulty":"easy|medium|hard","importance":"high|medium|low"}]}]}]}\nReturn ONLY valid JSON.`,
        `Syllabus:\n${text}`,
        { temperature: 0.2, timeoutMs: 30000 }
      ),
    })
  } catch (grokErr) {
    console.error(`[Syllabus] Grok failed after ${Date.now() - t0}ms:`, grokErr.message)
    return res.status(500).json({ success: false, message: `AI analysis failed: ${grokErr.message}` })
  }
  console.log(`[Syllabus] Grok completed in ${Date.now() - t0}ms`)
  console.log(`[Syllabus] Topics extracted:`, JSON.stringify(result?.subjects?.map(s => ({ name: s.name, topicCount: s.units?.reduce((n, u) => n + (u.topics?.length || 0), 0) }))))

  // Store the analyzed syllabus — MERGE with existing subjects (don't replace)
  if (result.subjects?.length) {
    const prep = await Preparation.findOne({ userId: req.user.userId })
    const existingSubjects = prep?.subjects || []

    const newSubjects = result.subjects.map(s => ({
      id: `subj_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: s.name,
      units: (s.units || []).map(u => ({
        id: `unit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: u.name,
        topics: (u.topics || []).map(t => ({
          id: `topic_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          name: t.name,
          difficulty: t.difficulty || 'medium',
          importance: t.importance || 'medium',
          estimatedMinutes: t.estimatedMinutes || 60,
          prerequisites: t.prerequisites || [],
        })),
      })),
    }))

    // Merge: keep existing subjects not in new result, update/replace matching ones
    const mergedSubjects = [
      ...existingSubjects.filter(existing =>
        !newSubjects.some(ns => ns.name.toLowerCase() === existing.name.toLowerCase())
      ),
      ...newSubjects,
    ]

    await Preparation.findOneAndUpdate(
      { userId: req.user.userId },
      { $set: { subjects: mergedSubjects } },
      { new: true }
    )
  }

  return res.json({ success: true, data: result })
}))

// ═══ UPLOAD STUDY MATERIAL (RAG indexing for quiz questions) ═══
aiRoutes.post('/upload-material', upload.single('file'), asyncHandler(async (req, res) => {
  const file = req.file
  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' })
  }

  const text = await extractTextFromFile(file)
  if (!text || text.trim().length < 50) {
    return res.status(400).json({ success: false, message: 'File content is too short or empty. Try a different file.' })
  }

  const materialId = `mat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const subject = req.body.subject || ''

  const result = await agent.indexStudyMaterial(
    req.user.userId,
    materialId,
    file.originalname,
    file.mimetype,
    text,
    ragService
  )

  return res.json({ success: true, data: result })
}))

// ═══ GENERATE QUIZ ═══
aiRoutes.post('/generate-quiz', asyncHandler(async (req, res) => {
  const { subject, topic, difficulty, count = 5 } = req.body
  if (!subject || !topic) {
    return res.status(400).json({ success: false, message: 'subject and topic are required' })
  }

  const preparation = await Preparation.findOne({ userId: req.user.userId })

  const result = await agent.generateQuiz({
    userId: req.user.userId,
    subject,
    topic,
    difficulty,
    count: Math.min(count, 5),
    preparation,
  })

  return res.json({ success: true, data: result })
}))

// ═══ EVALUATE ANSWER ═══
aiRoutes.post('/evaluate-answer', asyncHandler(async (req, res) => {
  const { quizId, questionId, selectedAnswer, timeTaken } = req.body
  if (!quizId || !questionId || selectedAnswer === undefined) {
    return res.status(400).json({ success: false, message: 'quizId, questionId, and selectedAnswer are required' })
  }

  const result = await agent.evaluateAnswer({
    userId: req.user.userId,
    quizId,
    questionId,
    selectedAnswer,
    timeTaken,
  })

  return res.json({ success: true, data: result })
}))

// ═══ COMPLETE QUIZ ═══
aiRoutes.post('/complete-quiz', asyncHandler(async (req, res) => {
  const { quizId } = req.body
  if (!quizId) {
    return res.status(400).json({ success: false, message: 'quizId is required' })
  }

  const result = await agent.completeQuiz(req.user.userId, quizId)

  // Save quiz result + replan — wrap in try/catch so quiz result is never lost
  let replan = null
  try {
    const preparation = await Preparation.findOne({ userId: req.user.userId })
    replan = await agent.replanAfterQuiz(req.user.userId, preparation, result)
    await Preparation.findOneAndUpdate(
      { userId: req.user.userId },
      {
        $set: {
          studyPlan: replan.schedule,
          weakTopics: replan.weakTopics,
        },
        $push: {
          quizResults: {
            $each: [{
              subject: result.subject,
              topic: result.topic,
              score: result.score,
              total: result.totalQuestions,
              correct: result.correctCount,
              accuracy: result.score,
              date: new Date().toISOString(),
              at: new Date().toISOString(),
            }],
            $slice: -50,
          },
        },
      }
    )
  } catch (replanErr) {
    console.error('[CompleteQuiz] Replan/save failed (quiz result still saved):', replanErr.message)
  }

  return res.json({ success: true, data: { ...result, replan } })
}))

// ═══ GET INSIGHTS ═══
aiRoutes.get('/insights', asyncHandler(async (req, res) => {
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const insights = await agent.generateUserInsights(req.user.userId, preparation)
  return res.json({ success: true, data: insights })
}))

// ═══ GET STUDENT CONTEXT ═══
aiRoutes.get('/context', asyncHandler(async (req, res) => {
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const context = await agent.getStudentContext(req.user.userId, preparation)
  return res.json({ success: true, data: context })
}))

// ═══ GET RANKINGS ═══
aiRoutes.get('/rankings', asyncHandler(async (req, res) => {
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const rankings = await decisionEngine.rankTopicsForUser(req.user.userId, preparation.subjects || [])
  return res.json({ success: true, data: rankings })
}))

// ═══ GET READINESS ═══
aiRoutes.get('/readiness', asyncHandler(async (req, res) => {
  const readiness = await decisionEngine.calculateReadiness(req.user.userId)
  return res.json({ success: true, data: readiness })
}))

// ═══ GET WEAK TOPICS ═══
aiRoutes.get('/weak-topics', asyncHandler(async (req, res) => {
  const weakTopics = await decisionEngine.detectWeakTopics(req.user.userId)
  return res.json({ success: true, data: weakTopics })
}))

// ═══ GET TOPIC MASTERY ═══
aiRoutes.get('/mastery', asyncHandler(async (req, res) => {
  const { TopicMastery } = await import('../models/TopicMastery.js')
  const masteries = await TopicMastery.find({ userId: req.user.userId })
  return res.json({ success: true, data: masteries })
}))

// ═══ GET MATERIALS ═══
aiRoutes.get('/materials', asyncHandler(async (req, res) => {
  const materials = await ragService.getUserMaterials(req.user.userId)
  return res.json({ success: true, data: materials })
}))

// ═══ DELETE MATERIAL ═══
aiRoutes.delete('/materials/:materialId', asyncHandler(async (req, res) => {
  const result = await ragService.deleteMaterial(req.user.userId, req.params.materialId)
  return res.json({ success: true, data: result })
}))

// ═══ GENERATE OCTO MESSAGE ═══
aiRoutes.post('/octo-message', asyncHandler(async (req, res) => {
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const context = await agent.getStudentContext(req.user.userId, preparation)

  let message = ''
  if (context.daysUntilExam !== null && context.daysUntilExam <= 3) {
    message = `Your ${context.nearestExam} exam is very close — let's focus on the highest-priority topics.`
  } else if (context.weakTopics.length > 0) {
    message = `I see ${context.weakTopics[0].topic} needs work at ${context.weakTopics[0].accuracy}%. Let's tackle it!`
  } else if (context.averageAccuracy >= 80) {
    message = `Your average accuracy is ${context.averageAccuracy}% — great progress! Keep studying consistently.`
  } else {
    message = `You've taken ${context.totalQuizzes} quizzes with ${context.averageAccuracy}% average accuracy. Ready for the next challenge?`
  }

  return res.json({ success: true, data: { message } })
}))

// ═══ REPLAN ═══
aiRoutes.post('/replan', asyncHandler(async (req, res) => {
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const rankings = await decisionEngine.rankTopicsForUser(req.user.userId, preparation.subjects || [])
  const schedule = decisionEngine.generateSchedule(rankings, preparation.preferences)

  await Preparation.findOneAndUpdate(
    { userId: req.user.userId },
    { $set: { studyPlan: schedule } }
  )

  return res.json({ success: true, data: { schedule, rankings: rankings.slice(0, 10) } })
}))

// ═══ BATCH GENERATE QUIZ (100 questions in batches) ═══
aiRoutes.post('/generate-quiz-batch', asyncHandler(async (req, res) => {
  const { subject, topic, difficulty, totalQuestions = 100, batchSize = 10 } = req.body
  if (!subject || !topic) {
    return res.status(400).json({ success: false, message: 'subject and topic are required' })
  }

  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const batchesNeeded = Math.ceil(totalQuestions / batchSize)
  const allQuestions = []
  const errors = []

  for (let batch = 0; batch < batchesNeeded; batch++) {
    try {
      const result = await agent.generateQuiz({
        userId: req.user.userId,
        subject,
        topic,
        difficulty,
        count: batchSize,
        preparation,
      })
      if (result?.questions?.length) {
        allQuestions.push(...result.questions)
      }
    } catch (err) {
      errors.push({ batch: batch + 1, error: err.message })
      // Continue with next batch even if one fails
    }
    // Small delay between batches to avoid rate limits
    if (batch < batchesNeeded - 1) {
      await new Promise(r => setTimeout(r, 1000))
    }
  }

  return res.json({
    success: true,
    data: {
      totalGenerated: allQuestions.length,
      totalRequested: totalQuestions,
      questions: allQuestions,
      errors: errors.length ? errors : undefined,
      quiz: allQuestions.length > 0 ? {
        id: `batch_${Date.now()}`,
        subject,
        topic,
        difficulty,
        totalQuestions: allQuestions.length,
      } : null,
    },
  })
}))

// ═══ GET SYLLABUS TOPICS (for quiz page) ═══
aiRoutes.get('/syllabus-topics', asyncHandler(async (req, res) => {
  const prep = await Preparation.findOne({ userId: req.user.userId })
  if (!prep || !prep.subjects?.length) {
    return res.json({ success: true, data: { subjects: [], topics: [] } })
  }
  
  const subjects = []
  const topics = []
  for (const subj of (prep.subjects || [])) {
    if (!subj.name?.trim()) continue
    const subjectTopics = []
    for (const unit of (subj.units || [])) {
      for (const topic of (unit.topics || [])) {
        if (topic.name?.trim()) {
          const t = {
            id: topic.id || `t_${subj.id}_${unit.id || 'u'}_${topic.name.replace(/\s+/g, '_')}`,
            name: topic.name.trim(),
            subjectId: subj.id,
            subjectName: subj.name,
            unitId: unit.id || 'default',
            unitName: unit.name || 'General',
            difficulty: topic.difficulty || 'medium',
            importance: topic.importance || 'medium',
          }
          subjectTopics.push(t)
          topics.push(t)
        }
      }
    }
    subjects.push({ id: subj.id, name: subj.name.trim(), topicCount: subjectTopics.length })
  }
  console.log(`[QuizTopics] Returning ${subjects.length} subjects, ${topics.length} topics`) 
  return res.json({ success: true, data: { subjects, topics } })
}))

// ═══ AUTO-GENERATE TOPICS FOR A SUBJECT (no syllabus needed) ═══
aiRoutes.post('/generate-topics', asyncHandler(async (req, res) => {
  const { subject } = req.body
  if (!subject) {
    return res.status(400).json({ success: false, message: 'subject name is required' })
  }

  try {
    const result = await callGrokJSON(
      `You are a CS exam topic generator. Generate a list of standard academic topics for the subject: ${subject}.\n\nReturn JSON:\n{\n  "topics": [\n    { "name": "Topic Name", "difficulty": "easy|medium|hard", "importance": "high|medium|low" }\n  ]\n}\n\nGenerate 8-15 topics that a typical university course on ${subject} would cover. Return ONLY valid JSON.`,
      `Generate standard exam topics for ${subject}.`,
      { temperature: 0.4 }
    )
    const topicList = (result?.topics || []).map((t, i) => ({
      id: `ai_${Date.now()}_${i}`,
      name: t.name,
      subjectId: `s_${subject.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      subjectName: subject,
      unitId: 'auto',
      unitName: 'Auto-generated',
      difficulty: t.difficulty || 'medium',
      importance: t.importance || 'medium',
    }))
    return res.json({ success: true, data: { topics: topicList, subject } })
  } catch (err) {
    console.error('[GenerateTopics] AI error:', err.message)
    return res.status(500).json({ success: false, message: 'AI topic generation failed. The AI service may be starting up.' })
  }
}))
