/* ═══════════════════════════════════════════════════
   QUESTION BANK SERVICE — Shared question caching
   Checks MongoDB cache before calling AI
   ═══════════════════════════════════════════════════ */

import { QuestionBank } from '../models/QuestionBank.js'

/**
 * Find cached questions matching subject/topic/difficulty.
 * Prioritizes pre-generated questions over ai-generated.
 * Returns an array of randomly-selected questions (up to `count`).
 */
export async function findCachedQuestions(subject, topic, difficulty, count) {
  const normSubject = QuestionBank.normalize(subject)
  const normTopic = QuestionBank.normalize(topic)
  const normDiff = (difficulty || 'medium').toLowerCase().trim()

  // First try to get pre-generated questions
  const preGenerated = await QuestionBank.aggregate([
    {
      $match: {
        subject: normSubject,
        topic: normTopic,
        difficulty: normDiff,
        source: 'pre-generated',
      },
    },
    { $sample: { size: count } },
  ])

  if (preGenerated.length >= count) return preGenerated

  // If not enough pre-generated, fill with ai-generated
  const remaining = count - preGenerated.length
  const aiGenerated = await QuestionBank.aggregate([
    {
      $match: {
        subject: normSubject,
        topic: normTopic,
        difficulty: normDiff,
        source: 'ai-generated',
      },
    },
    { $sample: { size: remaining } },
  ])

  // Shuffle the combined result so pre-generated aren't always first
  const combined = [...preGenerated, ...aiGenerated]
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[combined[i], combined[j]] = [combined[j], combined[i]]
  }

  return combined
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
 * @param {string} source - 'pre-generated' or 'ai-generated'
 * Returns the count of newly saved questions.
 */
export async function saveQuestionsToBank(subject, topic, difficulty, questions, source = 'ai-generated') {
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
            source,
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

  console.log(`[QuestionBank] Saved ${savedCount} ${source} questions for ${normSubject} → ${normTopic} (${normDiff})`)
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
        source: q.source || 'ai-generated',
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

  const preGenCount = cached.filter(q => q.source === 'pre-generated').length
  const aiGenCount = cached.filter(q => q.source === 'ai-generated').length
  if (cached.length > 0) {
    console.log(`[QuestionBank] Partial cache hit — ${cached.length} cached (${preGenCount} pre-gen, ${aiGenCount} ai-gen), need ${needGenerate} more from AI`)
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
      source: q.source || 'ai-generated',
      fromCache: true,
    })),
    cachedCount: cached.length,
    totalCount: totalCached,
    needGenerate,
  }
}
