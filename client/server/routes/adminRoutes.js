/* ═══════════════════════════════════════════════════
   ADMIN ROUTES — Protected question bank management
   Requires SEED_SECRET environment variable for access.
   ═══════════════════════════════════════════════════ */

import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { QuestionBank } from '../models/QuestionBank.js'
import { preGeneratedQuestions, getPreGeneratedTopics } from '../data/preGeneratedQuestions.js'

export const adminRoutes = Router()

// ═══ ADMIN AUTH MIDDLEWARE ═══
// Protected by SEED_SECRET — must be sent in x-seed-secret header
function adminAuth(req, res, next) {
  const secret = process.env.SEED_SECRET
  if (!secret) {
    return res.status(503).json({
      success: false,
      message: 'Admin routes are disabled. Set SEED_SECRET environment variable.',
    })
  }

  const provided = req.headers['x-seed-secret']
  if (!provided || provided !== secret) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Provide valid x-seed-secret header.',
    })
  }

  next()
}

adminRoutes.use(adminAuth)

// ═══ SEED PRE-GENERATED QUESTIONS ═══
adminRoutes.post('/seed-questions', asyncHandler(async (req, res) => {
  console.log('[Admin] Seeding pre-generated questions...')

  const topics = getPreGeneratedTopics()
  let totalSaved = 0
  let totalSkipped = 0
  const results = []

  for (const { subject, topic, difficulties, questionCounts } of topics) {
    for (const difficulty of difficulties) {
      const questions = preGeneratedQuestions[`${subject}|${topic}`][difficulty]
      if (!questions?.length) continue

      let saved = 0
      let skipped = 0

      for (const q of questions) {
        try {
          const normSubject = QuestionBank.normalize(subject)
          const normTopic = QuestionBank.normalize(topic)

          const existing = await QuestionBank.findOne({
            subject: normSubject,
            topic: normTopic,
            difficulty,
            prompt: q.prompt.trim(),
          })

          if (existing) {
            skipped++
            continue
          }

          await QuestionBank.create({
            subject: normSubject,
            topic: normTopic,
            difficulty,
            prompt: q.prompt.trim(),
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            source: 'pre-generated',
          })
          saved++
        } catch (err) {
          if (err.code === 11000) {
            skipped++
          } else {
            console.error(`[Admin] Save error:`, err.message)
          }
        }
      }

      totalSaved += saved
      totalSkipped += skipped
      results.push({ subject, topic, difficulty, saved, skipped })
    }
  }

  console.log(`[Admin] Seeding complete: ${totalSaved} saved, ${totalSkipped} skipped`)

  return res.json({
    success: true,
    data: {
      totalSaved,
      totalSkipped,
      topics: results,
      message: `Seeded ${totalSaved} pre-generated questions across ${topics.length} topics.`,
    },
  })
}))

// ═══ GET QUESTION BANK STATS ═══
adminRoutes.get('/question-bank-stats', asyncHandler(async (req, res) => {
  const stats = await QuestionBank.aggregate([
    {
      $group: {
        _id: { subject: '$subject', topic: '$topic', difficulty: '$difficulty', source: '$source' },
        count: { $sum: 1 },
        avgHitCount: { $avg: '$hitCount' },
      },
    },
    { $sort: { '_id.subject': 1, '_id.topic': 1, '_id.difficulty': 1 } },
  ])

  const totals = await QuestionBank.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
        topics: { $addToSet: { $concat: ['$subject', ' → ', '$topic'] } },
      },
    },
  ])

  const topicCount = await QuestionBank.aggregate([
    { $group: { _id: { subject: '$subject', topic: '$topic' } } },
    { $count: 'total' },
  ])

  return res.json({
    success: true,
    data: {
      totalQuestions: stats.reduce((sum, s) => sum + s.count, 0),
      totalTopics: topicCount[0]?.total || 0,
      bySource: totals,
      breakdown: stats,
    },
  })
}))

// ═══ DELETE ALL AI-GENERATED QUESTIONS ═══
adminRoutes.delete('/purge-ai-generated', asyncHandler(async (req, res) => {
  const result = await QuestionBank.deleteMany({ source: 'ai-generated' })
  console.log(`[Admin] Purged ${result.deletedCount} AI-generated questions`)

  return res.json({
    success: true,
    data: {
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} AI-generated questions.`,
    },
  })
}))
