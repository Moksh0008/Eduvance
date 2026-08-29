import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Preparation } from '../models/Preparation.js'
import { callGrokJSON, generateAndValidateQuestions } from '../services/grokService.js'
import * as ragService from '../services/ragService.js'
import * as agent from '../services/agentOrchestrator.js'
import * as decisionEngine from '../services/decisionEngine.js'
import { getQuestionsFromBank, saveQuestionsToBank } from '../services/questionBankService.js'
import { checkAiLimit, incrementAiUsage } from '../services/aiUsageService.js'

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
      `You are an academic syllabus analyzer. Extract structured topics from this document. All output MUST be in English.
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
    `You are a timetable parser. Extract exam/subject information from this timetable document. All output MUST be in English.
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
        `Extract topics from this syllabus text. All output MUST be in English.\nReturn JSON:\n{"subjects":[{"name":"...","units":[{"name":"...","topics":[{"name":"...","difficulty":"easy|medium|hard","importance":"high|medium|low"}]}]}]}\nReturn ONLY valid JSON.`,
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

  // Enforce plan-based question limit
  const { getPlanFeatures } = await import('../services/featureGateService.js')
  const planFeatures = await getPlanFeatures(req.user.userId)
  const maxQuestions = planFeatures.features.maxQuizQuestions || 15

  const result = await agent.generateQuiz({
    userId: req.user.userId,
    subject,
    topic,
    difficulty,
    count: Math.min(count, maxQuestions),
    preparation,
  })

  // Include AI usage status in response
  const { getUsageStatus } = await import('../services/aiUsageService.js')
  const usage = await getUsageStatus(req.user.userId)

  return res.json({ success: true, data: { ...result, aiUsage: usage }) })
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

// ═══ BATCH GENERATE QUIZ — cache-first, save-per-batch ═══
aiRoutes.post('/generate-quiz-batch', asyncHandler(async (req, res) => {
  const { subject, topic, difficulty, totalQuestions = 10, batchSize = 10 } = req.body
  if (!subject || !topic) {
    return res.status(400).json({ success: false, message: 'subject and topic are required' })
  }

  const finalDiff = (difficulty || 'medium').toLowerCase().trim()
  const requested = Math.min(Math.max(totalQuestions, 1), 100) // clamp 1–100
  const aiBatchSize = Math.min(Math.max(batchSize, 5), 20) // clamp 5–20

  console.log(`[BatchGen] subject=${subject}, topic=${topic}, difficulty=${finalDiff}, requested=${requested}, aiBatchSize=${aiBatchSize}`)

  // ─── 1. CACHE CHECK: how many do we already have? ───
  const bankResult = await getQuestionsFromBank(subject, topic, finalDiff, requested)
  const allQuestions = [...bankResult.cached]
  const needGenerate = bankResult.needGenerate

  if (needGenerate === 0) {
    console.log(`[BatchGen] Full cache hit — ${allQuestions.length} questions from bank, no AI needed`)
    return res.json({
      success: true,
      data: {
        totalGenerated: allQuestions.length,
        totalRequested: requested,
        questions: allQuestions,
        fromCache: true,
        quiz: { id: `batch_${Date.now()}`, subject, topic, difficulty: finalDiff, totalQuestions: allQuestions.length },
      },
    })
  }

  // ─── 2. CHECK AI USAGE LIMIT ───
  const aiLimit = await checkAiLimit(req.user.userId)
  console.log(`[BatchGen] AI limit: ${aiLimit.used}/${aiLimit.limit} used, ${aiLimit.remaining} remaining`)

  if (!aiLimit.allowed) {
    // At daily limit — cannot call AI, return what cache has
    if (allQuestions.length > 0) {
      console.log(`[BatchGen] At daily AI limit — returning ${allQuestions.length} cached questions`)
      return res.json({
        success: true,
        data: {
          totalGenerated: allQuestions.length,
          totalRequested: requested,
          questions: allQuestions,
          fromCache: true,
          aiLimitReached: true,
          aiLimitMessage: `You have reached today's AI generation limit (${aiLimit.limit}/${aiLimit.limit}). You can still practice topics with available questions. Your limit will reset tomorrow.`,
          quiz: allQuestions.length > 0 ? { id: `batch_${Date.now()}`, subject, topic, difficulty: finalDiff, totalQuestions: allQuestions.length } : null,
        },
      })
    }
    return res.status(429).json({
      success: false,
      message: `You have reached today's AI generation limit (${aiLimit.limit}/${aiLimit.limit}). You can still practice topics with available questions. Your limit will reset tomorrow.`,
      aiLimitReached: true,
      remaining: 0,
      limit: aiLimit.limit,
    })
  }

  // ─── 3. GENERATE MISSING in batches of aiBatchSize ───
  const batchesNeeded = Math.ceil(needGenerate / aiBatchSize)
  const seenPrompts = new Set(allQuestions.map(q => q.prompt.toLowerCase().slice(0, 50)))
  const errors = []
  let consecutiveFailures = 0
  let aiRequestsMade = 0

  for (let batch = 0; batch < batchesNeeded; batch++) {
    const remaining = requested - allQuestions.length
    if (remaining <= 0) break
    const thisBatchSize = Math.min(aiBatchSize, remaining)

    // Check remaining AI limit before each batch
    const currentLimit = await checkAiLimit(req.user.userId)
    if (!currentLimit.allowed) {
      console.log(`[BatchGen] AI limit reached mid-generation — stopping after ${allQuestions.length}/${requested} questions`)
      break
    }

    const systemPrompt = `Generate exactly ${thisBatchSize} MCQ questions about ${topic} (${subject}). Difficulty: ${finalDiff}.

CRITICAL: All questions, options, and explanations MUST be in English.

Return ONLY a JSON array of exactly ${thisBatchSize} objects. No text before or after.
Each object: {"prompt":"question?","options":["A","B","C","D"],"correctAnswer":0,"explanation":"why"}`

    const prevPrompts = allQuestions.slice(-5).map(q => q.prompt.slice(0, 40)).join('; ')
    const userPrompt = `Generate exactly ${thisBatchSize} ${finalDiff} MCQ questions about "${topic}" in ${subject}.${prevPrompts ? ` Avoid: ${prevPrompts}` : ''}`

    try {
      const batch = await generateAndValidateQuestions(systemPrompt, userPrompt, {
        temperature: 0.4,
        maxTokens: 4096,
      })

      // Deduplicate within batch and against existing
      const newBatch = []
      for (const q of batch) {
        const key = q.prompt.toLowerCase().slice(0, 50)
        if (!seenPrompts.has(key)) {
          seenPrompts.add(key)
          newBatch.push({ ...q, difficulty: finalDiff })
          allQuestions.push({ ...q, difficulty: finalDiff, fromCache: false })
        }
      }

      // ─── 4. SAVE this batch immediately + increment usage ───
      if (newBatch.length > 0) {
        await saveQuestionsToBank(subject, topic, finalDiff, newBatch, 'ai-generated')
        // Only increment AFTER successful generation and save
        await incrementAiUsage(req.user.userId)
        aiRequestsMade++
        console.log(`[BatchGen] Batch ${batch + 1}/${batchesNeeded}: generated ${newBatch.length}, saved to bank, total ${allQuestions.length}/${requested}`)
      }

      consecutiveFailures = 0
    } catch (err) {
      consecutiveFailures++
      console.error(`[BatchGen] Batch ${batch + 1}/${batchesNeeded} failed (${consecutiveFailures} consecutive):`, err.message)
      errors.push({ batch: batch + 1, error: err.message })
      // Do NOT increment usage for failed requests
      if (consecutiveFailures >= 3) {
        console.warn(`[BatchGen] 3 consecutive failures — stopping generation`)
        break
      }
    }

    // Delay between batches for rate limiting
    if (batch < batchesNeeded - 1 && allQuestions.length < requested) {
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  // ─── 4. RETURN whatever we have ───
  if (allQuestions.length === 0) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate any questions. AI may be unavailable.',
      errors,
    })
  }

  console.log(`[BatchGen] Complete — ${allQuestions.length}/${requested} questions (${allQuestions.filter(q => q.fromCache).length} from cache, ${allQuestions.filter(q => !q.fromCache).length} from AI)`)

  return res.json({
    success: true,
    data: {
      totalGenerated: allQuestions.length,
      totalRequested: requested,
      questions: allQuestions,
      fromCache: bankResult.cachedCount > 0 && allQuestions.every(q => q.fromCache),
      errors: errors.length ? errors : undefined,
      quiz: allQuestions.length > 0 ? {
        id: `batch_${Date.now()}`,
        subject,
        topic,
        difficulty: finalDiff,
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
      `You are a CS exam topic generator. Generate a list of standard academic topics for the subject: ${subject}. All output MUST be in English.\n\nReturn JSON:\n{\n  "topics": [\n    { "name": "Topic Name", "difficulty": "easy|medium|hard", "importance": "high|medium|low" }\n  ]\n}\n\nGenerate 8-15 topics that a typical university course on ${subject} would cover. Return ONLY valid JSON.`,
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

// ═══ GET AI USAGE STATUS ═══
aiRoutes.get('/usage', asyncHandler(async (req, res) => {
  const { getUsageStatus } = await import('../services/aiUsageService.js')
  const status = await getUsageStatus(req.user.userId)
  return res.json({ success: true, data: status })
}))

// ═══ GET SUBSCRIPTION / PLAN STATUS ═══
aiRoutes.get('/subscription', asyncHandler(async (req, res) => {
  const { getPlanFeatures, getPlanConfig } = await import('../services/featureGateService.js')
  const features = await getPlanFeatures(req.user.userId)
  const plans = getPlanConfig()
  return res.json({ success: true, data: { ...features, plans } })
}))

// ═══ GET ADAPTIVE RECOMMENDATIONS ═══
aiRoutes.get('/recommendations', asyncHandler(async (req, res) => {
  const { getRecommendations, getTopicSummary } = await import('../services/adaptiveLearningService.js')
  const limit = Math.min(parseInt(req.query.limit, 10) || 5, 10)

  const [recommendations, summary] = await Promise.all([
    getRecommendations(req.user.userId, limit),
    getTopicSummary(req.user.userId),
  ])

  return res.json({
    success: true,
    data: {
      recommendations,
      summary,
      config: {
        weakThreshold: parseInt(process.env.ADAPTIVE_WEAK_THRESHOLD, 10) || 50,
        strongThreshold: parseInt(process.env.ADAPTIVE_STRONG_THRESHOLD, 10) || 75,
      },
    },
  })
}))
