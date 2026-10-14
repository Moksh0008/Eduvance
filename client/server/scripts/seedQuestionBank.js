/* ═══════════════════════════════════════════════════
   SEED QUESTION BANK — Run server-side only
   Populates pre-generated questions into MongoDB.
   
   Usage:
     node client/server/scripts/seedQuestionBank.js
   
   Requires MONGODB_URI environment variable.
   ═══════════════════════════════════════════════════ */

import mongoose from 'mongoose'
import { QuestionBank } from '../models/QuestionBank.js'
import { preGeneratedQuestions, getPreGeneratedTopics } from '../data/preGeneratedQuestions.js'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('[Seed] MONGODB_URI environment variable is required')
  process.exit(1)
}

function normalize(str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

async function seed() {
  console.log('[Seed] Connecting to MongoDB...')
  await mongoose.connect(MONGODB_URI)
  console.log('[Seed] Connected to MongoDB')

  const topics = getPreGeneratedTopics()
  console.log(`[Seed] Found ${topics.length} pre-generated topic combinations`)
  console.log('[Seed] Topics:', topics.map(t => `${t.subject} → ${t.topic} (${t.questionCounts.easy + t.questionCounts.medium + t.questionCounts.hard} questions)`))

  let totalSaved = 0
  let totalSkipped = 0

  for (const { subject, topic, difficulties } of topics) {
    for (const difficulty of difficulties) {
      const questions = preGeneratedQuestions[`${subject}|${topic}`][difficulty]
      if (!questions?.length) continue

      for (const q of questions) {
        try {
          const result = await QuestionBank.findOneAndUpdate(
            {
              subject: normalize(subject),
              topic: normalize(topic),
              difficulty,
              prompt: q.prompt.trim(),
            },
            {
              $setOnInsert: {
                subject: normalize(subject),
                topic: normalize(topic),
                difficulty,
                prompt: q.prompt.trim(),
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || '',
                source: 'pre-generated',
                createdAt: new Date(),
              },
            },
            { upsert: true, new: true }
          )

          // Check if it was newly created or already existed
          const isNew = result.createdAt.getTime() === result.updatedAt.getTime()
          if (isNew) {
            totalSaved++
          } else {
            totalSkipped++
          }
        } catch (err) {
          if (err.code === 11000) {
            totalSkipped++
          } else {
            console.error(`[Seed] Error saving question:`, err.message)
          }
        }
      }

      console.log(`[Seed] ${subject} → ${topic} (${difficulty}): ${questions.length} questions processed`)
    }
  }

  console.log(`\n[Seed] Complete!`)
  console.log(`[Seed] Saved: ${totalSaved}, Skipped (duplicates): ${totalSkipped}`)

  // Print summary
  const counts = await QuestionBank.aggregate([
    { $group: { _id: { subject: '$subject', source: '$source' }, count: { $sum: 1 } } },
    { $sort: { '_id.subject': 1 } },
  ])

  console.log('\n[Seed] Question Bank Summary:')
  for (const c of counts) {
    console.log(`  ${c._id.subject} (${c._id.source}): ${c.count} questions`)
  }

  await mongoose.disconnect()
  console.log('[Seed] Done!')
}

seed().catch(err => {
  console.error('[Seed] Fatal error:', err)
  process.exit(1)
})
