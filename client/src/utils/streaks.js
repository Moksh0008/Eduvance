/* ═══════════════════════════════════════════════════
   STREAK TRACKER — Records study sessions, calculates streaks
   Uses localStorage for persistence
   ═══════════════════════════════════════════════════ */

const STORAGE_KEY = 'edu-streaks'

function getToday() {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

function getYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function loadStreakData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { days: [], lastRecorded: null, bestStreak: 0 }
    return JSON.parse(raw)
  } catch {
    return { days: [], lastRecorded: null, bestStreak: 0 }
  }
}

function saveStreakData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

/**
 * Record a study session for today.
 * Call this when the user starts/completes a study session or quiz.
 */
export function recordStudyDay() {
  const today = getToday()
  const data = loadStreakData()

  // Already recorded today — no-op
  if (data.days.includes(today)) return getStreak()

  data.days.push(today)
  // Keep only last 90 days to avoid bloat
  if (data.days.length > 90) {
    data.days = data.days.slice(-90)
  }
  data.lastRecorded = today

  // Calculate best streak
  const streak = calculateStreak(data.days)
  if (streak.current > data.bestStreak) {
    data.bestStreak = streak.current
  }

  saveStreakData(data)
  return streak
}

/**
 * Calculate current and best streak from sorted day array.
 */
function calculateStreak(days) {
  if (!days.length) return { current: 0, best: 0 }

  const sorted = [...new Set(days)].sort().reverse() // newest first
  const today = getToday()
  const yesterday = getYesterday()

  // Current streak must include today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) {
    return { current: 0, best: 0 }
  }

  let current = 1
  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = new Date(sorted[i])
    const prev = new Date(sorted[i + 1])
    const diffDays = (curr - prev) / 86400000

    if (diffDays === 1) {
      current++
    } else {
      break
    }
  }

  return { current, best: 0 }
}

/**
 * Get current streak info.
 */
export function getStreak() {
  const data = loadStreakData()
  const streak = calculateStreak(data.days)
  return {
    current: streak.current,
    best: data.bestStreak,
    totalDays: new Set(data.days).size,
    todayRecorded: data.days.includes(getToday()),
  }
}

/**
 * Get streak milestone info for Octo to celebrate.
 */
export function getStreakMilestone(streakCount) {
  const milestones = [
    { at: 1, message: "Your first study day! Every journey starts with a single step! 🐙", emoji: "🌟", tier: 'bronze' },
    { at: 3, message: "3-day streak! You're building a habit! 🔥", emoji: "🔥", tier: 'bronze' },
    { at: 5, message: "5 days in a row! You're on FIRE! 🔥🔥", emoji: "🔥", tier: 'silver' },
    { at: 7, message: "ONE FULL WEEK! You're unstoppable! 🎉🐙", emoji: "🎯", tier: 'silver' },
    { at: 10, message: "10 days! That's a real commitment! 💪", emoji: "💎", tier: 'gold' },
    { at: 14, message: "TWO WEEKS STREAK! You're a machine! 🏆", emoji: "🏆", tier: 'gold' },
    { at: 21, message: "21 days — they say that's how habits form! 🧠", emoji: "🧠", tier: 'platinum' },
    { at: 30, message: "30 DAY STREAK! LEGENDARY! 🐙👑", emoji: "👑", tier: 'platinum' },
  ]

  // Find the milestone that was just reached
  const hit = milestones.filter(m => streakCount >= m.at)
  return hit.length > 0 ? hit[hit.length - 1] : null
}

/**
 * Check if a given streak count just hit a new milestone.
 */
export function isNewMilestone(streakCount) {
  const milestones = [1, 3, 5, 7, 10, 14, 21, 30]
  return milestones.includes(streakCount)
}

/**
 * Get streak tier color.
 */
export function getStreakColor(tier) {
  switch (tier) {
    case 'platinum': return { bg: 'rgba(139,92,246,0.2)', border: '#8b5cf6', text: '#a78bfa' }
    case 'gold': return { bg: 'rgba(234,179,8,0.2)', border: '#eab308', text: '#fbbf24' }
    case 'silver': return { bg: 'rgba(148,163,184,0.2)', border: '#94a3b8', text: '#cbd5e1' }
    default: return { bg: 'rgba(249,115,22,0.2)', border: '#f97316', text: '#fb923c' }
  }
}
