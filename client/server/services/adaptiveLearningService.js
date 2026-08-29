/* ═══════════════════════════════════════════════════
   ADAPTIVE LEARNING ENGINE
   Deterministic priority scoring — no AI calls.
   Uses stored user performance data to answer:
   "What should I study next?"
   ═══════════════════════════════════════════════════ */

import { TopicMastery } from '../models/TopicMastery.js'
import { QuizAttempt } from '../models/QuizAttempt.js'
import { Preparation } from '../models/Preparation.js'

// ═══ CONFIGURABLE THRESHOLDS ═══
// Override via environment variables, or use sensible defaults.
const CONFIG = {
  // Topic classification thresholds (accuracy %)
  WEAK_THRESHOLD: parseInt(process.env.ADAPTIVE_WEAK_THRESHOLD, 10) || 50,
  STRONG_THRESHOLD: parseInt(process.env.ADAPTIVE_STRONG_THRESHOLD, 10) || 75,

  // Priority score weights (must sum to 1.0)
  WEIGHT_WEAKNESS: 0.30,
  WEIGHT_RECENCY: 0.20,
  WEIGHT_EXAM_URGENCY: 0.25,
  WEIGHT_IMPORTANCE: 0.15,
  WEIGHT_ATTEMPT_GAP: 0.10,

  // How many days since last attempt triggers "needs revision"
  RECENCY_DAYS_PENALTY: 5,

  // Default estimated study minutes per topic
  DEFAULT_STUDY_MINUTES: 45,
}

// ═══ TOPIC CLASSIFICATION ═══

/**
 * Classify a topic as 'weak', 'medium', or 'strong'
 * based on accuracy and configurable thresholds.
 */
export function classifyTopic(accuracy) {
  if (accuracy == null || accuracy === 0) return 'untested'
  if (accuracy < CONFIG.WEAK_THRESHOLD) return 'weak'
  if (accuracy >= CONFIG.STRONG_THRESHOLD) return 'strong'
  return 'medium'
}

/**
 * Get the label and color info for a classification.
 */
export function getClassificationInfo(classification) {
  const info = {
    weak: { label: 'Weak', color: 'risk', icon: '🔴', description: 'Needs significant practice' },
    medium: { label: 'Medium', color: 'amber', icon: '🟡', description: 'On track but room to improve' },
    strong: { label: 'Strong', color: 'success', icon: '🟢', description: 'Well understood — maintain with revision' },
    untested: { label: 'Not yet tested', color: 'neutral', icon: '⚪', description: 'No quiz data available yet' },
  }
  return info[classification] || info.medium
}

// ═══ PRIORITY SCORING ═══

/**
 * Calculate the priority score for a single topic.
 * Returns a detailed recommendation object.
 *
 * Formula:
 *   score = (weakness × 0.30) + (recency × 0.20) + (examUrgency × 0.25)
 *         + (importance × 0.15) + (attemptGap × 0.10)
 *
 * Each factor is normalized to 0–100.
 */
export function calculatePriority(topicData, mastery, examDate) {
  const {
    subjectName,
    topicName,
    importance = 'medium',
  } = topicData

  const accuracy = mastery?.accuracy ?? null
  const lastStudied = mastery?.lastStudied ?? null
  const totalAttempts = mastery?.totalAttempts ?? 0

  const classification = classifyTopic(accuracy)
  const reasons = []
  let score = 0

  // ─── FACTOR 1: WEAKNESS SCORE (30%) ───
  // Higher score = weaker topic = higher priority
  let weaknessScore = 0
  if (accuracy == null || totalAttempts === 0) {
    weaknessScore = 70 // untested = moderately high priority
    reasons.push('No quiz data yet — needs assessment')
  } else if (accuracy < CONFIG.WEAK_THRESHOLD) {
    weaknessScore = Math.min(100, (CONFIG.WEAK_THRESHOLD - accuracy) * 2 + 30)
    reasons.push(`Accuracy: ${accuracy}% — below ${CONFIG.WEAK_THRESHOLD}% threshold`)
  } else if (accuracy < CONFIG.STRONG_THRESHOLD) {
    weaknessScore = Math.max(0, (CONFIG.STRONG_THRESHOLD - accuracy) * 1.5)
    reasons.push(`Accuracy: ${accuracy}% — room to improve`)
  } else {
    weaknessScore = 0
    reasons.push(`Accuracy: ${accuracy}% — strong performance`)
  }
  score += weaknessScore * CONFIG.WEIGHT_WEAKNESS

  // ─── FACTOR 2: RECENCY (20%) ───
  // More days since last practice = higher priority
  let recencyScore = 0
  const daysSinceStudied = lastStudied
    ? Math.max(0, Math.floor((Date.now() - new Date(lastStudied).getTime()) / 86400000))
    : null

  if (daysSinceStudied === null) {
    recencyScore = 80
    reasons.push('Never practiced')
  } else if (daysSinceStudied >= CONFIG.RECENCY_DAYS_PENALTY) {
    recencyScore = Math.min(100, daysSinceStudied * 8)
    reasons.push(`Not practiced for ${daysSinceStudied} days`)
  } else if (daysSinceStudied >= 2) {
    recencyScore = daysSinceStudied * 10
    reasons.push(`Last practiced ${daysSinceStudied} days ago`)
  } else {
    recencyScore = 0
    reasons.push('Practiced recently')
  }
  score += recencyScore * CONFIG.WEIGHT_RECENCY

  // ─── FACTOR 3: EXAM URGENCY (25%) ───
  let examUrgencyScore = 0
  const daysUntilExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000))
    : null

  if (daysUntilExam !== null) {
    if (daysUntilExam <= 3) {
      examUrgencyScore = 100
      reasons.push(`Exam in ${daysUntilExam} day${daysUntilExam !== 1 ? 's' : ''} — urgent`)
    } else if (daysUntilExam <= 7) {
      examUrgencyScore = 80
      reasons.push(`Exam in ${daysUntilExam} days`)
    } else if (daysUntilExam <= 14) {
      examUrgencyScore = 50
      reasons.push(`${daysUntilExam} days until exam`)
    } else {
      examUrgencyScore = 20
    }
  } else {
    examUrgencyScore = 30 // no exam info = moderate default
  }
  score += examUrgencyScore * CONFIG.WEIGHT_EXAM_URGENCY

  // ─── FACTOR 4: IMPORTANCE (15%) ───
  const importanceMap = { high: 100, medium: 50, low: 20 }
  const importanceScore = importanceMap[importance] || 50
  if (importance === 'high') reasons.push('High syllabus weight')
  score += importanceScore * CONFIG.WEIGHT_IMPORTANCE

  // ─── FACTOR 5: ATTEMPT GAP (10%) ───
  // Fewer attempts relative to other topics = higher priority
  let attemptGapScore = 50 // default for untested
  if (totalAttempts > 0) {
    // Normalize: 0 attempts = 100, 10+ attempts = low score
    attemptGapScore = Math.max(0, 100 - totalAttempts * 10)
    if (totalAttempts < 3) {
      reasons.push(`Only ${totalAttempts} attempt${totalAttempts !== 1 ? 's' : ''} — needs more practice`)
    }
  }
  score += attemptGapScore * CONFIG.WEIGHT_ATTEMPT_GAP

  // ─── FINAL SCORE ───
  const finalScore = Math.round(Math.min(99, Math.max(1, score)))

  // Determine priority level
  let priority = 'LOW'
  let priorityColor = 'success'
  if (finalScore >= 70) {
    priority = 'HIGH'
    priorityColor = 'risk'
  } else if (finalScore >= 45) {
    priority = 'MEDIUM'
    priorityColor = 'amber'
  }

  // Determine suggested action
  const suggestedAction = getSuggestedAction(classification, accuracy, daysSinceStudied, totalAttempts)

  // Estimate study time
  const estimatedMinutes = estimateStudyTime(accuracy, totalAttempts)

  return {
    subject: subjectName,
    topic: topicName,
    score: finalScore,
    priority,
    priorityColor,
    classification,
    classificationInfo: getClassificationInfo(classification),
    accuracy: accuracy ?? null,
    totalAttempts,
    lastAttemptedAt: lastStudied,
    daysSinceStudied,
    daysUntilExam,
    examDate: examDate || null,
    importance,
    reasons,
    suggestedAction,
    estimatedMinutes,
  }
}

// ═══ RECOMMENDATION GENERATION ═══

/**
 * Generate top recommendations for a user.
 * Combines TopicMastery data with Preparation subjects/exams.
 */
export async function getRecommendations(userId, limit = 5) {
  // 1. Load user data
  const [masteries, preparation] = await Promise.all([
    TopicMastery.find({ userId }),
    Preparation.findOne({ userId }),
  ])

  const subjects = preparation?.subjects || []
  const exams = preparation?.exams || []

  // Build mastery lookup
  const masteryMap = {}
  masteries.forEach(m => {
    masteryMap[`${m.subject}|${m.topic}`] = m
  })

  // Build exam date lookup by subject name
  const examDateMap = {}
  exams.forEach(e => {
    if (e.date && e.name) {
      examDateMap[e.name.toLowerCase()] = e.date
    }
  })

  // 2. Build topic list from all subjects
  const allTopics = []
  for (const subject of subjects) {
    const examDate = examDateMap[subject.name?.toLowerCase()] || subject.examDate || null
    for (const unit of (subject.units || [])) {
      for (const topic of (unit.topics || [])) {
        if (!topic.name) continue
        allTopics.push({
          subjectName: subject.name,
          topicName: topic.name,
          importance: topic.importance || 'medium',
          examDate,
        })
      }
    }
  }

  // 3. Calculate priority for each topic
  const recommendations = allTopics.map(t => {
    const key = `${t.subjectName}|${t.topicName}`
    return calculatePriority(t, masteryMap[key], t.examDate)
  })

  // 4. Sort by priority score (highest first)
  recommendations.sort((a, b) => b.score - a.score)

  // 5. Return top N
  return recommendations.slice(0, limit)
}

/**
 * Get a summary of the user's topic landscape.
 */
export async function getTopicSummary(userId) {
  const masteries = await TopicMastery.find({ userId })

  const summary = {
    total: masteries.length,
    weak: 0,
    medium: 0,
    strong: 0,
    untested: 0,
    avgAccuracy: 0,
    topicsNeedingAttention: 0,
  }

  if (masteries.length === 0) return summary

  let totalAccuracy = 0
  for (const m of masteries) {
    const cls = classifyTopic(m.accuracy)
    summary[cls]++
    totalAccuracy += m.accuracy || 0
  }

  summary.avgAccuracy = Math.round(totalAccuracy / masteries.length)
  summary.topicsNeedingAttention = summary.weak + summary.untested

  return summary
}

// ═══ HELPERS ═══

function getSuggestedAction(classification, accuracy, daysSinceStudied, totalAttempts) {
  if (totalAttempts === 0 || accuracy == null) {
    return { action: 'Take a practice quiz', questions: 10, description: 'Start with a diagnostic quiz to assess your understanding.' }
  }

  if (classification === 'weak') {
    if (daysSinceStudied !== null && daysSinceStudied > 7) {
      return { action: 'Review and practice', questions: 15, description: 'Study the material again, then take a focused quiz.' }
    }
    return { action: 'Practice with targeted questions', questions: 10, description: 'Focus on weak areas with extra practice questions.' }
  }

  if (classification === 'medium') {
    return { action: 'Practice to strengthen', questions: 10, description: 'A few more quizzes should push this into strong territory.' }
  }

  // strong
  if (daysSinceStudied !== null && daysSinceStudied > 14) {
    return { action: 'Quick revision quiz', questions: 5, description: 'Quick refresher to maintain your knowledge.' }
  }
  return { action: 'Maintain with occasional review', questions: 5, description: 'Keep this strong with periodic review.' }
}

function estimateStudyTime(accuracy, totalAttempts) {
  if (accuracy == null || totalAttempts === 0) return CONFIG.DEFAULT_STUDY_MINUTES
  if (accuracy >= 85) return 15
  if (accuracy >= 70) return 30
  if (accuracy >= 50) return 45
  return 60
}
