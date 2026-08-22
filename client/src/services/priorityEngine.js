/* ═══════════════════════════════════════════════════
   PRIORITY ENGINE — Intelligent topic prioritization
   Factors: exam proximity, difficulty, recency, mastery,
            quiz history, prerequisites, study consistency
   ═══════════════════════════════════════════════════ */

import { daysUntil } from '../utils/format'

/**
 * Calculate a comprehensive priority score for a topic.
 * Returns a score 0-100 with detailed reasoning.
 *
 * Weights:
 *   Exam proximity:     30%
 *   Performance gap:    25%
 *   Recency penalty:    15%
 *   Study time need:    15%
 *   Syllabus weight:    15%
 */
export function calculatePriority(topic, workspace = {}) {
  const reasons = []
  let score = 0

  // ── 1. EXAM PROXIMITY (30%) ──
  const days = topic.examDate ? daysUntil(topic.examDate) : 999
  const proximityScore = Math.max(0, 100 - days * 3)
  const proximityWeight = proximityScore * 0.30
  score += proximityWeight

  if (days <= 3) reasons.push({ text: `⚠️ Exam in ${days} day${days !== 1 ? 's' : ''}`, intensity: 'high' })
  else if (days <= 7) reasons.push({ text: `Exam in ${days} days`, intensity: 'medium' })
  else if (days <= 14) reasons.push({ text: `${days} days until exam`, intensity: 'low' })

  // ── 2. PERFORMANCE GAP (25%) ──
  const recentScore = getLatestScore(topic, workspace)
  const targetScore = 75
  const performanceGap = recentScore != null ? Math.max(0, targetScore - recentScore) : 50
  const performanceScore = Math.min(100, performanceGap * 1.33)
  const performanceWeight = performanceScore * 0.25
  score += performanceWeight

  if (recentScore != null) {
    if (recentScore < 50) reasons.push({ text: `🔴 Accuracy: ${recentScore}% — needs significant work`, intensity: 'high' })
    else if (recentScore < 70) reasons.push({ text: `🟡 Accuracy: ${recentScore}% — below target`, intensity: 'medium' })
    else if (recentScore < 85) reasons.push({ text: `🟢 Accuracy: ${recentScore}% — on track`, intensity: 'low' })
    else reasons.push({ text: `✅ Accuracy: ${recentScore}% — strong`, intensity: 'minimal' })
  } else {
    reasons.push({ text: 'No quiz data yet — needs assessment', intensity: 'medium' })
  }

  // ── 3. RECENCY PENALTY (15%) ──
  const lastStudied = getLastStudyTime(topic, workspace)
  const daysSinceStudied = lastStudied
    ? Math.max(0, Math.floor((Date.now() - new Date(lastStudied).getTime()) / 86400000))
    : 999
  const recencyScore = Math.min(100, daysSinceStudied * 8)
  const recencyWeight = recencyScore * 0.15
  score += recencyWeight

  if (daysSinceStudied === 999) {
    reasons.push({ text: 'Never studied', intensity: 'medium' })
  } else if (daysSinceStudied > 7) {
    reasons.push({ text: `Not revised for ${daysSinceStudied} days`, intensity: 'medium' })
  } else if (daysSinceStudied > 3) {
    reasons.push({ text: `Last studied ${daysSinceStudied} days ago`, intensity: 'low' })
  }

  // ── 4. STUDY TIME NEED (15%) ──
  const estimatedMinutes = estimateStudyTime(recentScore, topic)
  const timeNeedScore = Math.min(100, estimatedMinutes / 1.5)
  const timeNeedWeight = timeNeedScore * 0.15
  score += timeNeedWeight

  if (estimatedMinutes >= 75) reasons.push({ text: `Needs ~${estimatedMinutes} min of focused study`, intensity: 'medium' })
  else if (estimatedMinutes >= 45) reasons.push({ text: `~${estimatedMinutes} min recommended`, intensity: 'low' })

  // ── 5. SYLLABUS WEIGHT (15%) ──
  const importance = topic.importance || 'medium'
  const importanceMap = { high: 100, medium: 60, low: 30 }
  const syllabusScore = importanceMap[importance] || 60
  const syllabusWeight = syllabusScore * 0.15
  score += syllabusWeight

  if (importance === 'high') reasons.push({ text: 'High syllabus weight', intensity: 'low' })

  // ── FINAL SCORE ──
  const finalScore = Math.round(Math.min(99, Math.max(1, score)))

  let priorityLabel = 'LOW'
  if (finalScore >= 70) priorityLabel = 'HIGH'
  else if (finalScore >= 45) priorityLabel = 'MEDIUM'

  return {
    score: finalScore,
    label: priorityLabel,
    reasons,
    subject: topic.subjectName,
    topic: topic.name,
    estimatedMinutes,
    daysUntilExam: days,
    recentScore,
  }
}

/**
 * Rank all topics by priority and return the top recommendations
 */
export function rankTopics(topics, workspace = {}, limit = 10) {
  const ranked = topics
    .map(topic => calculatePriority(topic, workspace))
    .sort((a, b) => b.score - a.score)

  return ranked.slice(0, limit)
}

/**
 * Detect weak topics that need immediate attention
 */
export function detectWeakTopics(workspace) {
  const history = workspace.quizResults || workspace.quizHistory || []
  const topicScores = {}

  history.forEach(q => {
    const key = `${q.subject}|${q.topic}`
    if (!topicScores[key]) topicScores[key] = { scores: [], subject: q.subject, topic: q.topic }
    topicScores[key].scores.push(q.score)
  })

  return Object.values(topicScores)
    .map(t => ({
      subject: t.subject,
      topic: t.topic,
      avgScore: Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length),
      attempts: t.scores.length,
      trend: t.scores.length >= 2 ? t.scores[t.scores.length - 1] - t.scores[t.scores.length - 2] : 0,
    }))
    .filter(t => t.avgScore < 70)
    .sort((a, b) => a.avgScore - b.avgScore)
}

/**
 * Calculate exam readiness score
 */
export function calculateReadiness(workspace) {
  const history = workspace.quizResults || workspace.quizHistory || []
  if (history.length === 0) return { score: 10, label: 'Getting started', breakdown: {} }

  // Factors
  const avgScore = history.length
    ? Math.round(history.reduce((n, q) => n + q.score, 0) / history.length)
    : 0

  const uniqueTopics = new Set(history.map(q => q.topic)).size
  const totalTopics = (workspace.subjects || []).reduce((n, s) =>
    n + (s.units || []).reduce((nu, u) => nu + (u.topics || []).length, 0), 0)
  const coverage = totalTopics ? Math.round((uniqueTopics / totalTopics) * 100) : 0

  const recentQuizzes = history.slice(-5)
  const recentAvg = recentQuizzes.length
    ? Math.round(recentQuizzes.reduce((n, q) => n + q.score, 0) / recentQuizzes.length)
    : 0

  const strongTopics = history.filter(q => q.score >= 80).length
  const strongRatio = history.length ? Math.round((strongTopics / history.length) * 100) : 0

  // Composite readiness
  const readiness = Math.round(
    avgScore * 0.35 +
    coverage * 0.25 +
    recentAvg * 0.25 +
    strongRatio * 0.15
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
      avgScore,
      coverage,
      recentAvg,
      strongRatio,
      totalQuizzes: history.length,
      uniqueTopics,
    },
  }
}

/**
 * Generate AI insights from student data
 */
export function generateInsights(workspace) {
  const insights = []
  const history = workspace.quizResults || workspace.quizHistory || []
  const weak = detectWeakTopics(workspace)
  const readiness = calculateReadiness(workspace)

  // Strongest subject
  const subjectScores = {}
  history.forEach(q => {
    if (!subjectScores[q.subject]) subjectScores[q.subject] = []
    subjectScores[q.subject].push(q.score)
  })
  const subjectAvgs = Object.entries(subjectScores).map(([name, scores]) => ({
    name,
    avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    count: scores.length,
  })).filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg)

  if (subjectAvgs.length >= 2) {
    const strongest = subjectAvgs[0]
    const weakest = subjectAvgs[subjectAvgs.length - 1]
    insights.push({
      type: 'strength',
      text: `Your strongest subject is ${strongest.name} (${strongest.avg}% average)`,
      emoji: '💪',
    })
    if (weakest.avg < 70) {
      insights.push({
        type: 'weakness',
        text: `${weakest.name} needs attention — ${weakest.avg}% average across ${weakest.count} quizzes`,
        emoji: '⚠️',
      })
    }
  }

  // Trend analysis
  if (history.length >= 4) {
    const recent = history.slice(-3)
    const earlier = history.slice(-6, -3)
    if (recent.length && earlier.length) {
      const recentAvg = Math.round(recent.reduce((n, q) => n + q.score, 0) / recent.length)
      const earlierAvg = Math.round(earlier.reduce((n, q) => n + q.score, 0) / earlier.length)
      const diff = recentAvg - earlierAvg
      if (diff > 10) {
        insights.push({ type: 'improvement', text: `Your scores improved by ${diff}% this week! 📈`, emoji: '🔥' })
      } else if (diff < -5) {
        insights.push({ type: 'regression', text: `Scores dropped ${Math.abs(diff)}% — review recent weak areas`, emoji: '📉' })
      }
    }
  }

  // Weak topic insights
  if (weak.length > 0) {
    insights.push({
      type: 'action',
      text: `"${weak[0].topic}" (${weak[0].subject}) is your weakest area at ${weak[0].avgScore}%`,
      emoji: '🎯',
    })
  }

  // Study consistency
  if (history.length >= 3) {
    const dates = [...new Set(history.map(q => q.date?.split('T')[0]))].sort()
    if (dates.length >= 2) {
      const span = daysBetween(dates[0], dates[dates.length - 1])
      const density = span > 0 ? Math.round((dates.length / span) * 7) : 0
      insights.push({
        type: 'consistency',
        text: `You've studied on ${dates.length} different days over ${span} days (${density} days/week)`,
        emoji: '📅',
      })
    }
  }

  return insights
}

// ── Helpers ──

function getLatestScore(topic, workspace) {
  const history = workspace.quizResults || workspace.quizHistory || []
  const match = history
    .filter(q => q.topic === topic.name || q.topicId === topic.id)
    .reverse()[0]
  return match?.score ?? null
}

function getLastStudyTime(topic, workspace) {
  const history = workspace.quizResults || workspace.quizHistory || []
  const match = history
    .filter(q => q.topic === topic.name || q.topicId === topic.id)
    .reverse()[0]
  return match?.date || match?.at || null
}

function estimateStudyTime(score, topic) {
  if (score == null) return 60
  if (score >= 85) return 20
  if (score >= 70) return 35
  if (score >= 50) return 55
  return 75
}

function daysBetween(d1, d2) {
  return Math.max(1, Math.ceil((new Date(d2) - new Date(d1)) / 86400000))
}
