/* ═══════════════════════════════════════════════════
   DECISION ENGINE — Deterministic priority calculations
   This is NOT AI. It computes numbers algorithmically.
   Grok handles reasoning; this handles math.
   ═══════════════════════════════════════════════════ */

import { TopicMastery } from '../models/TopicMastery.js'
import { QuizAttempt } from '../models/QuizAttempt.js'

/**
 * Calculate days until a date string
 */
function daysUntil(dateStr) {
  if (!dateStr) return 999
  const target = new Date(dateStr)
  const now = new Date()
  const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

/**
 * Calculate priority score for a topic (0-100)
 * Weights:
 *   Exam proximity:     30%
 *   Performance gap:    25%
 *   Recency penalty:    15%
 *   Study time need:    15%
 *   Syllabus weight:    15%
 */
export function calculateTopicPriority(topic, mastery, examDate) {
  const reasons = []
  let score = 0

  // 1. EXAM PROXIMITY (30%)
  const days = daysUntil(examDate)
  const proximityScore = Math.max(0, 100 - days * 3)
  score += proximityScore * 0.30

  if (days <= 3) reasons.push(`Exam in ${days} day${days !== 1 ? 's' : ''} — urgent`)
  else if (days <= 7) reasons.push(`Exam in ${days} days`)
  else if (days <= 14) reasons.push(`${days} days until exam`)

  // 2. PERFORMANCE GAP (25%)
  const accuracy = mastery?.accuracy ?? null
  const targetScore = 75
  const performanceGap = accuracy != null ? Math.max(0, targetScore - accuracy) : 50
  const performanceScore = Math.min(100, performanceGap * 1.33)
  score += performanceScore * 0.25

  if (accuracy != null) {
    if (accuracy < 50) reasons.push(`Accuracy: ${accuracy}% — needs significant work`)
    else if (accuracy < 70) reasons.push(`Accuracy: ${accuracy}% — below target`)
    else if (accuracy >= 85) reasons.push(`Accuracy: ${accuracy}% — strong`)
  } else {
    reasons.push('No quiz data yet — needs assessment')
  }

  // 3. RECENCY PENALTY (15%)
  const lastStudied = mastery?.lastStudied
  const daysSinceStudied = lastStudied
    ? Math.max(0, Math.floor((Date.now() - new Date(lastStudied).getTime()) / 86400000))
    : 999
  const recencyScore = Math.min(100, daysSinceStudied * 8)
  score += recencyScore * 0.15

  if (daysSinceStudied === 999) reasons.push('Never studied')
  else if (daysSinceStudied > 7) reasons.push(`Not revised for ${daysSinceStudied} days`)

  // 4. STUDY TIME NEED (15%)
  const estimatedMinutes = estimateStudyTime(accuracy)
  const timeNeedScore = Math.min(100, estimatedMinutes / 1.5)
  score += timeNeedScore * 0.15

  // 5. SYLLABUS WEIGHT (15%)
  const importance = topic.importance || 'medium'
  const importanceMap = { high: 100, medium: 60, low: 30 }
  score += (importanceMap[importance] || 60) * 0.15

  if (importance === 'high') reasons.push('High syllabus weight')

  const finalScore = Math.round(Math.min(99, Math.max(1, score)))
  let priorityLabel = 'LOW'
  if (finalScore >= 70) priorityLabel = 'HIGH'
  else if (finalScore >= 45) priorityLabel = 'MEDIUM'

  return {
    score: finalScore,
    label: priorityLabel,
    reasons,
    subject: topic.subjectName || topic.subject,
    topic: topic.name || topic.topicName,
    estimatedMinutes,
    daysUntilExam: days,
    recentScore: accuracy,
  }
}

/**
 * Rank all topics for a user and return prioritized list
 */
export async function rankTopicsForUser(userId, subjects) {
  const masteries = await TopicMastery.find({ userId })
  const masteryMap = {}
  masteries.forEach(m => {
    const key = `${m.subject}|${m.topic}`
    masteryMap[key] = m
  })

  const allTopics = []
  subjects.forEach(s => {
    const examDate = s.examDate
    ;(s.units || []).forEach(u => {
      ;(u.topics || []).forEach(t => {
        if (t.name) {
          const key = `${s.name}|${t.name}`
          allTopics.push({
            ...t,
            subjectName: s.name,
            subjectId: s.id || s._id,
            examDate,
            importance: t.importance || 'medium',
          })
        }
      })
    })
  })

  const ranked = allTopics
    .map(topic => {
      const key = `${topic.subjectName}|${topic.name}`
      return calculateTopicPriority(topic, masteryMap[key], topic.examDate)
    })
    .sort((a, b) => b.score - a.score)

  return ranked
}

/**
 * Get adaptive difficulty for a topic based on performance history
 */
export async function getAdaptiveDifficulty(userId, subject, topic) {
  const attempts = await QuizAttempt.find({ userId, subject, topic })
    .sort({ createdAt: -1 })
    .limit(5)

  if (attempts.length === 0) return 'easy'

  const recentAccuracies = attempts.map(a => a.isCorrect ? 1 : 0)
  const recentAvg = recentAccuracies.reduce((a, b) => a + b, 0) / recentAccuracies.length

  if (recentAvg >= 0.8) {
    // Doing well — increase difficulty
    const currentMaxDifficulty = attempts[0]?.difficulty || 'medium'
    if (currentMaxDifficulty === 'easy') return 'medium'
    if (currentMaxDifficulty === 'medium') return 'hard'
    return 'hard'
  }

  if (recentAvg < 0.5) {
    // Struggling — decrease difficulty
    const currentMaxDifficulty = attempts[0]?.difficulty || 'medium'
    if (currentMaxDifficulty === 'hard') return 'medium'
    if (currentMaxDifficulty === 'medium') return 'easy'
    return 'easy'
  }

  return attempts[0]?.difficulty || 'medium'
}

/**
 * Generate dynamic study schedule
 */
export function generateSchedule(rankings, preferences = {}) {
  const dailyMinutes = Math.round((preferences.dailyHours || 3) * 60)
  const schedule = []
  let remainingMinutes = dailyMinutes

  for (const ranking of rankings) {
    if (remainingMinutes <= 0) break

    const minutes = Math.min(remainingMinutes, ranking.estimatedMinutes || 45)
    remainingMinutes -= minutes + 15 // 15 min break between sessions

    schedule.push({
      subject: ranking.subject,
      topic: ranking.topic,
      minutes,
      priority: ranking.score,
      priorityLabel: ranking.label,
      reasons: ranking.reasons,
    })
  }

  return schedule
}

/**
 * Calculate student readiness score (0-100)
 */
export async function calculateReadiness(userId) {
  const attempts = await QuizAttempt.find({ userId }).sort({ createdAt: -1 })
  const masteries = await TopicMastery.find({ userId })

  if (attempts.length === 0 && masteries.length === 0) {
    return { score: 10, label: 'Getting started', breakdown: {} }
  }

  const avgAccuracy = masteries.length > 0
    ? Math.round(masteries.reduce((sum, m) => sum + m.accuracy, 0) / masteries.length)
    : 0

  const recentAttempts = attempts.slice(-10)
  const recentAvg = recentAttempts.length > 0
    ? Math.round(recentAttempts.filter(a => a.isCorrect).length / recentAttempts.length * 100)
    : 0

  const topicCoverage = masteries.filter(m => m.totalAttempts > 0).length
  const totalTopics = masteries.length || 1
  const coverageScore = Math.round((topicCoverage / totalTopics) * 100)

  const readiness = Math.round(
    avgAccuracy * 0.35 +
    coverageScore * 0.25 +
    recentAvg * 0.25 +
    Math.min(100, topicCoverage * 10) * 0.15
  )

  let label = 'Getting started'
  if (readiness >= 80) label = 'Well prepared'
  else if (readiness >= 60) label = 'On track'
  else if (readiness >= 40) label = 'Needs work'
  else if (readiness >= 20) label = 'Early stage'

  return {
    score: Math.min(99, readiness),
    label,
    breakdown: {
      avgAccuracy,
      coverageScore,
      recentAvg,
      topicCoverage,
      totalTopics,
    },
  }
}

/**
 * Detect weak topics that need attention
 */
export async function detectWeakTopics(userId) {
  const masteries = await TopicMastery.find({ userId })
  return masteries
    .filter(m => m.totalAttempts > 0 && m.accuracy < 70)
    .sort((a, b) => a.accuracy - b.accuracy)
    .map(m => ({
      subject: m.subject,
      topic: m.topic,
      accuracy: m.accuracy,
      attempts: m.totalAttempts,
      lastStudied: m.lastStudied,
    }))
}

// ── Helpers ──

function estimateStudyTime(accuracy) {
  if (accuracy == null) return 60
  if (accuracy >= 85) return 20
  if (accuracy >= 70) return 35
  if (accuracy >= 50) return 55
  return 75
}
