/* ═══════════════════════════════════════════════════
   QUESTION BANK SERVICE — Shared question caching
   Checks MongoDB cache before calling AI
   ═══════════════════════════════════════════════════ */

import { QuestionBank } from '../models/QuestionBank.js'

/**
 * Find cached questions matching subject/topic/difficulty.
 * Returns an array of randomly-selected questions (up to `count`).
 */
export async function findCachedQuestions(subject, topic, difficulty, count) {
  const normSubject = QuestionBank.normalize(subject)
  const normTopic = QuestionBank.normalize(topic)
  const normDiff = (difficulty || 'medium').toLowerCase().trim()

  const questions = await QuestionBank.aggregate([
    {
      $match: {
        subject: normSubject,
        topic: normTopic,
        difficulty: normDiff,
      },
    },
    { $sample: { size: count } }, // random selection
  ])

  return questions
}

/**
 * Count how many cached questions exist for a given subject/topic/difficulty.
 */
export async function countCachedQuestions(subject, topic, difficulty) {
  const normSubject = QuestionBank.normalize(subject)
  const normTopic = QuestionBank.normalize(topic)
  const normDiff = (difficulty || 'medium').toLowerCase().trim()

  const result = await QuestionBank.aggregate([
    {
      $match: {
        subject: normSubject,
        topic: normTopic,
        difficulty: normDiff,
      },
    },
    { $count: 'total' },
  ])

  return result[0]?.total || 0
}

/**
 * Save new questions to the bank, skipping duplicates.
 * Returns the count of newly saved questions.
 */
export async function saveQuestionsToBank(subject, topic, difficulty, questions) {
  const normSubject = QuestionBank.normalize(subject)
  const normTopic = QuestionBank.normalize(topic)
  const normDiff = (difficulty || 'medium').toLowerCase().trim()

  let savedCount = 0

  for (const q of questions) {
    try {
      await QuestionBank.findOneAndUpdate(
        {
          subject: normSubject,
          topic: normTopic,
          difficulty: normDiff,
          prompt: q.prompt.trim(),
        },
        {
          $setOnInsert: {
            subject: normSubject,
            topic: normTopic,
            difficulty: normDiff,
            prompt: q.prompt.trim(),
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            createdAt: new Date(),
          },
        },
        { upsert: true, new: true }
      )
      savedCount++
    } catch (err) {
      // Duplicate key error = question already exists, skip silently
      if (err.code === 11000) {
        console.log(`[QuestionBank] Duplicate skipped: "${q.prompt.slice(0, 50)}..."`)
      } else {
        console.error(`[QuestionBank] Save error:`, err.message)
      }
    }
  }

  console.log(`[QuestionBank] Saved ${savedCount} questions for ${normSubject} → ${normTopic} (${normDiff})`)
  return savedCount
}

/**
 * Mark questions as used (increment hitCount, update lastUsedAt).
 */
export async function markQuestionsUsed(questionIds) {
  if (!questionIds.length) return

  await QuestionBank.updateMany(
    { _id: { $in: questionIds } },
    {
      $inc: { hitCount: 1 },
      $set: { lastUsedAt: new Date() },
    }
  )
}

/**
 * Full cache-first question retrieval:
 * 1. Count cached questions
 * 2. If enough → return random cached questions
 * 3. If not enough → return what exists + how many to generate
 */
export async function getQuestionsFromBank(subject, topic, difficulty, count) {
  const normSubject = QuestionBank.normalize(subject)
  const normTopic = QuestionBank.normalize(topic)
  const normDiff = (difficulty || 'medium').toLowerCase().trim()

  // Count available
  const totalCached = await countCachedQuestions(subject, topic, difficulty)
  console.log(`[QuestionBank] Cache check: ${totalCached} questions for "${normSubject}" → "${normTopic}" (${normDiff})`)

  if (totalCached >= count) {
    // Cache HIT — enough questions exist
    const cached = await findCachedQuestions(subject, topic, difficulty, count)
    console.log(`[QuestionBank] Cache hit — returning ${cached.length} questions from bank`)

    // Mark as used
    await markQuestionsUsed(cached.map(q => q._id))

    return {
      cached: cached.map(q => ({
        id: q._id,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        fromCache: true,
      })),
      cachedCount: cached.length,
      totalCount: totalCached,
      needGenerate: 0,
    }
  }

  // Cache MISS — return what exists, report how many to generate
  const cached = totalCached > 0
    ? await findCachedQuestions(subject, topic, difficulty, totalCached)
    : []

  const needGenerate = count - cached.length

  if (cached.length > 0) {
    console.log(`[QuestionBank] Partial cache hit — ${cached.length} cached, need ${needGenerate} more from AI`)
  } else {
    console.log(`[QuestionBank] Cache miss — generating all ${needGenerate} questions from AI`)
  }

  return {
    cached: cached.map(q => ({
      id: q._id,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      fromCache: true,
    })),
    cachedCount: cached.length,
    totalCount: totalCached,
    needGenerate,
  }
}
