/* ═══════════════════════════════════════════════════
   AGENT ORCHESTRATOR — Coordinates the adaptive loop
   ANALYZE → RETRIEVE → DECIDE → GENERATE → EVALUATE → REPLAN
   ═══════════════════════════════════════════════════ */

import { callGrokJSON, callGrok, generateAndValidateQuestions, generateQuizQuestions } from './grokService.js'
import { retrieveRelevantChunks, buildContextString } from './ragService.js'
import { TopicMastery, QuizAttempt, Question, Quiz, Insight } from '../models/index.js'
import {
  calculateTopicPriority,
  rankTopicsForUser,
  getAdaptiveDifficulty,
  calculateReadiness,
  detectWeakTopics,
  generateSchedule,
} from './decisionEngine.js'

/**
 * Analyze uploaded syllabus
 */
export async function analyzeSyllabus(userId, syllabusText, grokService) {
  const result = await grokService.analyzeSyllabus(syllabusText)
  return result
}

/**
 * Process uploaded study material → chunk → store
 */
export async function indexStudyMaterial(userId, materialId, fileName, fileType, text, ragService) {
  return ragService.processAndStoreMaterial(userId, materialId, fileName, fileType, text)
}

/**
 * Generate a quiz — the main orchestrator flow
 */
export async function generateQuiz({ userId, subject, topic, difficulty, count, preparation }) {
  // 1. Get adaptive difficulty
  const adaptiveDiff = await getAdaptiveDifficulty(userId, subject, topic)
  const finalDifficulty = difficulty || adaptiveDiff

  // 2. Retrieve relevant study material via RAG
  const chunks = await retrieveRelevantChunks(userId, subject, topic, 3)
  const context = buildContextString(chunks)

  // 3. Get previous questions to avoid repeats
  const previousQuestions = await Question.find({ userId, subject, topic })
    .sort({ createdAt: -1 })
    .limit(20)
    .select('prompt')

  // 4. Get mastery data
  const mastery = await TopicMastery.findOne({ userId, subject, topic })

  // 5. Generate questions via Grok
  console.log(`[QuizGen] subject=${subject}, topic=${topic}, difficulty=${finalDifficulty}, hasContext=${context.length > 0}, prevQuestions=${previousQuestions.length}`)
  
  let questions
  try {
    questions = await generateQuizQuestions({
      subject,
      topic,
      difficulty: finalDifficulty,
      count: Math.min(count, 8),
      context,
      previousQuestions: previousQuestions.map(q => q.prompt),
    })
    console.log(`[QuizGen] Generated ${questions.length} validated questions`)
  } catch (err) {
    console.error('[QuizGen] Question generation failed:', err.message)
    throw new Error(`AI question generation failed: ${err.message}`)
  }

  // 6. Store questions in DB
  const storedQuestions = []
  for (const q of questions) {
    const stored = await Question.create({
      userId,
      subject,
      topic,
      prompt: q.prompt,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty || finalDifficulty,
      sourceMaterialId: chunks[0]?.chunkId || null,
      sourceContext: q.sourceContext || '',
    })
    storedQuestions.push(stored)
  }

  // 7. Create quiz session
  const quiz = await Quiz.create({
    userId,
    subject,
    topic,
    difficulty: finalDifficulty,
    questions: storedQuestions.map(q => q._id),
    totalQuestions: storedQuestions.length,
  })

  return {
    quizId: quiz._id,
    subject,
    topic,
    difficulty: finalDifficulty,
    questions: storedQuestions.map(q => ({
      id: q._id,
      prompt: q.prompt,
      options: q.options,
      difficulty: q.difficulty,
    })),
    fromMaterial: chunks.length > 0,
  }
}

/**
 * Evaluate a quiz answer
 */
export async function evaluateAnswer({ userId, quizId, questionId, selectedAnswer, timeTaken }) {
  const question = await Question.findById(questionId)
  if (!question) throw new Error('Question not found')

  const isCorrect = question.correctAnswer === selectedAnswer

  // Store attempt
  const attempt = await QuizAttempt.create({
    userId,
    quizId,
    questionId,
    subject: question.subject,
    topic: question.topic,
    difficulty: question.difficulty,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    isCorrect,
    timeTaken: timeTaken || 0,
  })

  // Update topic mastery
  await updateTopicMastery(userId, question.subject, question.topic, isCorrect, question.difficulty)

  return {
    isCorrect,
    correctAnswer: question.correctAnswer,
    explanation: question.explanation,
    subject: question.subject,
    topic: question.topic,
  }
}

/**
 * Complete a quiz and get results
 */
export async function completeQuiz(userId, quizId) {
  const quiz = await Quiz.findById(quizId)
  if (!quiz) throw new Error('Quiz not found')

  const attempts = await QuizAttempt.find({ userId, quizId })
  const correctCount = attempts.filter(a => a.isCorrect).length
  const totalQuestions = attempts.length || quiz.totalQuestions
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  // Update quiz
  quiz.correctCount = correctCount
  quiz.score = score
  quiz.status = 'completed'
  quiz.completedAt = new Date()
  await quiz.save()

  // Update topic mastery
  const mastery = await TopicMastery.findOne({ userId, subject: quiz.subject, topic: quiz.topic })

  // Generate AI insight
  let insight = null
  if (score < 50) {
    insight = {
      type: 'weakness',
      text: `Your ${quiz.topic} (${quiz.subject}) score was ${score}%. This needs attention.`,
      emoji: '⚠️',
      priority: 'high',
      subject: quiz.subject,
      topic: quiz.topic,
    }
  } else if (score >= 85) {
    insight = {
      type: 'strength',
      text: `Great job on ${quiz.topic}! You scored ${score}%.`,
      emoji: '💪',
      priority: 'low',
      subject: quiz.subject,
      topic: quiz.topic,
    }
  }

  if (insight) {
    await Insight.create({ userId, ...insight })
  }

  // Get difficulty breakdown
  const difficultyBreakdown = {}
  attempts.forEach(a => {
    if (!difficultyBreakdown[a.difficulty]) {
      difficultyBreakdown[a.difficulty] = { total: 0, correct: 0 }
    }
    difficultyBreakdown[a.difficulty].total++
    if (a.isCorrect) difficultyBreakdown[a.difficulty].correct++
  })

  return {
    quizId: quiz._id,
    subject: quiz.subject,
    topic: quiz.topic,
    score,
    correctCount,
    totalQuestions,
    difficulty: quiz.difficulty,
    difficultyBreakdown: Object.entries(difficultyBreakdown).map(([diff, data]) => ({
      difficulty: diff,
      accuracy: Math.round((data.correct / data.total) * 100),
      total: data.total,
      correct: data.correct,
    })),
    mastery: mastery ? {
      accuracy: mastery.accuracy,
      totalAttempts: mastery.totalAttempts,
    } : null,
    insight,
  }
}

/**
 * Get student context for AI decisions
 */
export async function getStudentContext(userId, preparation) {
  const masteries = await TopicMastery.find({ userId })
  const recentAttempts = await QuizAttempt.find({ userId })
    .sort({ createdAt: -1 })
    .limit(20)

  const weakTopics = masteries
    .filter(m => m.totalAttempts > 0 && m.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)

  const readiness = await calculateReadiness(userId)

  // Calculate exam proximity
  const exams = preparation?.exams || []
  const nearestExam = exams
    .filter(e => e.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0]

  const daysUntilExam = nearestExam?.date
    ? Math.max(0, Math.ceil((new Date(nearestExam.date) - new Date()) / 86400000))
    : null

  return {
    userId,
    exams,
    daysUntilExam,
    nearestExam: nearestExam?.name || null,
    totalQuizzes: recentAttempts.length,
    averageAccuracy: recentAttempts.length > 0
      ? Math.round(recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length * 100)
      : 0,
    weakTopics: weakTopics.map(m => ({
      subject: m.subject,
      topic: m.topic,
      accuracy: m.accuracy,
      attempts: m.totalAttempts,
    })),
    readiness,
    recentScores: recentAttempts.slice(0, 5).map(a => ({
      subject: a.subject,
      topic: a.topic,
      correct: a.isCorrect,
      difficulty: a.difficulty,
    })),
  }
}

/**
 * Update topic mastery after a quiz attempt
 */
async function updateTopicMastery(userId, subject, topic, isCorrect, difficulty) {
  let mastery = await TopicMastery.findOne({ userId, subject, topic })

  if (!mastery) {
    mastery = await TopicMastery.create({
      userId,
      subject,
      topic,
      totalAttempts: 1,
      correctAttempts: isCorrect ? 1 : 0,
      accuracy: isCorrect ? 100 : 0,
      difficultyBreakdown: {
        easy: { attempts: 0, correct: 0 },
        medium: { attempts: 0, correct: 0 },
        hard: { attempts: 0, correct: 0 },
      },
      lastStudied: new Date(),
      recentAccuracy: isCorrect ? 100 : 0,
      streak: isCorrect ? 1 : 0,
      mastery: isCorrect ? 10 : 0,
    })
  }

  // Update counters
  mastery.totalAttempts++
  if (isCorrect) mastery.correctAttempts++

  // Update difficulty breakdown
  const diffKey = difficulty || 'medium'
  if (!mastery.difficultyBreakdown[diffKey]) {
    mastery.difficultyBreakdown[diffKey] = { attempts: 0, correct: 0 }
  }
  mastery.difficultyBreakdown[diffKey].attempts++
  if (isCorrect) mastery.difficultyBreakdown[diffKey].correct++

  // Calculate accuracy
  mastery.accuracy = Math.round((mastery.correctAttempts / mastery.totalAttempts) * 100)

  // Recent accuracy (last 5 attempts)
  const recentAttempts = await QuizAttempt.find({ userId, subject, topic })
    .sort({ createdAt: -1 })
    .limit(5)

  const recentCorrect = recentAttempts.filter(a => a.isCorrect).length
  mastery.recentAccuracy = Math.round((recentCorrect / recentAttempts.length) * 100)

  // Streak
  if (isCorrect) {
    mastery.streak = (mastery.streak || 0) + 1
  } else {
    mastery.streak = 0
  }

  // Mastery score (composite)
  mastery.mastery = Math.round(
    mastery.accuracy * 0.4 +
    mastery.recentAccuracy * 0.3 +
    Math.min(100, mastery.totalAttempts * 5) * 0.15 +
    mastery.streak * 5 * 0.15
  )

  mastery.lastStudied = new Date()
  mastery.updatedAt = new Date()

  await mastery.save()
  return mastery
}

/**
 * Generate insights for a user
 */
export async function generateUserInsights(userId, preparation) {
  const context = await getStudentContext(userId, preparation)

  // Rule-based insights (deterministic)
  const insights = []

  // Weak topic insights
  if (context.weakTopics.length > 0) {
    const worst = context.weakTopics[0]
    insights.push({
      type: 'weakness',
      text: `${worst.topic} (${worst.subject}) is your weakest area at ${worst.accuracy}% accuracy after ${worst.attempts} attempts.`,
      emoji: '⚠️',
      priority: 'high',
      subject: worst.subject,
      topic: worst.topic,
    })
  }

  // Improvement detection
  if (context.recentScores.length >= 4) {
    const recent = context.recentScores.slice(0, 2)
    const earlier = context.recentScores.slice(2, 4)
    const recentCorrect = recent.filter(s => s.correct).length
    const earlierCorrect = earlier.filter(s => s.correct).length

    if (recentCorrect > earlierCorrect) {
      insights.push({
        type: 'improvement',
        text: `Your recent performance is improving! ${recentCorrect}/2 correct vs ${earlierCorrect}/2 earlier.`,
        emoji: '📈',
        priority: 'medium',
      })
    } else if (recentCorrect < earlierCorrect) {
      insights.push({
        type: 'regression',
        text: `Performance dipped slightly. Review recent topics to stay on track.`,
        emoji: '📉',
        priority: 'medium',
      })
    }
  }

  // Exam proximity alert
  if (context.daysUntilExam !== null && context.daysUntilExam <= 7) {
    insights.push({
      type: 'alert',
      text: `Your ${context.nearestExam} exam is in ${context.daysUntilExam} days. Focus on weak areas.`,
      emoji: '🔴',
      priority: 'high',
      subject: context.nearestExam,
    })
  }

  // Readiness insight
  if (context.readiness.score < 40) {
    insights.push({
      type: 'recommendation',
      text: `Your readiness score is ${context.readiness.score}%. Take more quizzes to improve.`,
      emoji: '🎯',
      priority: 'high',
    })
  }

  // Strength insight
  const masteries = await TopicMastery.find({ userId })
  const strongTopics = masteries.filter(m => m.accuracy >= 85 && m.totalAttempts >= 3)
  if (strongTopics.length > 0) {
    insights.push({
      type: 'strength',
      text: `You're strong in ${strongTopics[0].topic} (${strongTopics[0].accuracy}%). Keep it up!`,
      emoji: '💪',
      priority: 'low',
      subject: strongTopics[0].subject,
      topic: strongTopics[0].topic,
    })
  }

  // Store insights
  const storedInsights = []
  for (const insight of insights) {
    const stored = await Insight.create({ userId, ...insight })
    storedInsights.push(stored)
  }

  return storedInsights
}

/**
 * Replan study schedule after a quiz
 */
export async function replanAfterQuiz(userId, preparation, quizResult) {
  const rankings = await rankTopicsForUser(userId, preparation.subjects || [])

  // Generate schedule from rankings
  const schedule = generateSchedule(rankings, preparation.preferences)

  return {
    reason: quizResult.score < 70
      ? `Your ${quizResult.topic} score was ${quizResult.score}% — increasing study time for this topic.`
      : `Quiz completed with ${quizResult.score}%. Adjusting priorities based on performance.`,
    schedule,
    rankings: rankings.slice(0, 5),
    weakTopics: rankings.filter(r => r.label === 'HIGH').slice(0, 3),
  }
}
