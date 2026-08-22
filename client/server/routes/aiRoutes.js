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
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['text/plain', 'application/pdf', 'text/markdown', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (allowed.includes(file.mimetype) || file.mimetype.startsWith('text/')) {
      cb(null, true)
    } else {
      cb(new Error('Unsupported file type. Please upload text, PDF, or markdown files.'))
    }
  },
})

// ═══ ANALYZE FILE (server-side PDF parsing + Grok) ═══
aiRoutes.post('/analyze-file', upload.single('file'), asyncHandler(async (req, res) => {
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

  if (!text || text.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'File content is too short or empty.' })
  }

  const subject = req.body.subject || ''

  // Also store for RAG
  const materialId = `mat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  try {
    await agent.indexStudyMaterial(req.user.userId, materialId, file.originalname, file.mimetype, text, ragService)
  } catch { /* RAG storage is best-effort */ }

  // Analyze with Grok
  const result = await agent.analyzeSyllabus(req.user.userId, text, {
    analyzeSyllabus: async (t) => callGrokJSON(
      `You are an academic syllabus analyzer. Extract structured topics from this document.
Return JSON: { "subjects": [{ "name": "string", "examDate": "YYYY-MM-DD or empty", "units": [{ "name": "string", "topics": [{ "name": "string", "difficulty": "easy|medium|hard", "importance": "high|medium|low", "estimatedMinutes": 60 }] }] }] }
Extract ALL subjects, units, topics from the document. If exam dates are mentioned, include them. Return ONLY valid JSON.`,
      `Subject context: ${subject}\n\nDocument content:\n${t.slice(0, 8000)}`
    ),
  })

  return res.json({ success: true, data: { ...result, fileName: file.originalname, textLength: text.length } })
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
  if (!syllabusText) {
    return res.status(400).json({ success: false, message: 'syllabusText is required' })
  }

  const result = await agent.analyzeSyllabus(req.user.userId, syllabusText, {
    analyzeSyllabus: async (text) => callGrokJSON(
      `You are an academic syllabus analyzer. Extract structured topics.
Return JSON: { "subjects": [{ "name": "string", "units": [{ "name": "string", "topics": [{ "name": "string", "difficulty": "easy|medium|hard", "importance": "high|medium|low", "estimatedMinutes": 60 }] }] }] }
Extract ALL subjects, units, topics. Estimate difficulty and importance. Return ONLY valid JSON.`,
      `Syllabus:\n${syllabusText}`
    ),
  })

  // Store the analyzed syllabus in preparation
  const updateData = {}
  if (result.subjects) {
    updateData.subjects = result.subjects.map(s => ({
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
  }

  await Preparation.findOneAndUpdate(
    { userId: req.user.userId },
    { $set: updateData },
    { new: true }
  )

  return res.json({ success: true, data: result })
}))

// ═══ UPLOAD STUDY MATERIAL ═══
aiRoutes.post('/upload-material', upload.single('file'), asyncHandler(async (req, res) => {
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
      return res.status(400).json({ success: false, message: 'Failed to parse PDF. Try a text file instead.' })
    }
  } else {
    text = file.buffer.toString('utf-8')
  }

  if (!text || text.trim().length < 50) {
    return res.status(400).json({ success: false, message: 'File content is too short or empty.' })
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
    count: Math.min(count, 15),
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

  // Trigger replanning
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  const replan = await agent.replanAfterQuiz(req.user.userId, preparation, result)

  // Update preparation with new plan
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
