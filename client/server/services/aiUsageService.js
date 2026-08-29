/* ═══════════════════════════════════════════════════
   AI USAGE SERVICE — Daily generation limit tracking
   Only actual AI API calls consume limits.
   Cached questions are always free.
   ═══════════════════════════════════════════════════ */

import { AiUsage } from '../models/AiUsage.js'

// Configurable daily limit via environment variable
// Defaults to 3 if not set
const DAILY_LIMIT = Math.max(1, parseInt(process.env.DAILY_AI_GENERATION_LIMIT, 10) || 3)

console.log(`[AiUsage] Daily AI generation limit: ${DAILY_LIMIT}`)

/**
 * Get today's date string in UTC.
 * Daily reset happens at UTC midnight (no timezone confusion).
 */
function getTodayUTC() {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

/**
 * Get the current usage record for today.
 * Creates one if it doesn't exist.
 */
async function getOrCreateUsage(userId) {
  const today = getTodayUTC()

  // Try to find existing record
  let usage = await AiUsage.findOne({ userId, date: today })
  if (usage) return usage

  // Create new record for today — use upsert to handle race condition
  try {
    usage = await AiUsage.findOneAndUpdate(
      { userId, date: today },
      {
        $setOnInsert: {
          userId,
          date: today,
          aiRequestsUsed: 0,
          lastRequestAt: null,
          createdAt: new Date(),
        },
      },
      { upsert: true, new: true }
    )
  } catch (err) {
    // Duplicate key = another request created it first — just read it
    if (err.code === 11000) {
      usage = await AiUsage.findOne({ userId, date: today })
    } else {
      throw err
    }
  }

  return usage
}

/**
 * Check if the user can make an AI request.
 * Returns { allowed, remaining, used, limit }
 */
export async function checkAiLimit(userId) {
  const usage = await getOrCreateUsage(userId)
  const remaining = Math.max(0, DAILY_LIMIT - usage.aiRequestsUsed)

  return {
    allowed: remaining > 0,
    remaining,
    used: usage.aiRequestsUsed,
    limit: DAILY_LIMIT,
    date: getTodayUTC(),
  }
}

/**
 * Atomically increment AI usage after a successful AI generation.
 * Uses $inc for race-condition safety — concurrent requests
 * won't bypass the limit.
 *
 * Returns { allowed, remaining, used, limit } after increment.
 */
export async function incrementAiUsage(userId) {
  const today = getTodayUTC()

  // Atomic read-modify-write: only increment if under limit
  const usage = await AiUsage.findOneAndUpdate(
    {
      userId,
      date: today,
      aiRequestsUsed: { $lt: DAILY_LIMIT }, // only if under limit
    },
    {
      $inc: { aiRequestsUsed: 1 },
      $set: { lastRequestAt: new Date() },
    },
    { new: true }
  )

  if (!usage) {
    // Either record doesn't exist or limit already reached
    // Try to create the record first
    const existing = await AiUsage.findOne({ userId, date: today })
    if (!existing) {
      // Shouldn't happen if checkAiLimit was called first, but handle gracefully
      console.warn(`[AiUsage] No usage record for ${userId} on ${today}`)
      return { allowed: false, remaining: 0, used: DAILY_LIMIT, limit: DAILY_LIMIT, date: today }
    }
    // Limit already reached
    const remaining = Math.max(0, DAILY_LIMIT - existing.aiRequestsUsed)
    console.log(`[AiUsage] User ${userId} at daily limit: ${existing.aiRequestsUsed}/${DAILY_LIMIT}`)
    return {
      allowed: false,
      remaining,
      used: existing.aiRequestsUsed,
      limit: DAILY_LIMIT,
      date: today,
    }
  }

  const remaining = Math.max(0, DAILY_LIMIT - usage.aiRequestsUsed)
  console.log(`[AiUsage] User ${userId} AI usage: ${usage.aiRequestsUsed}/${DAILY_LIMIT} (remaining: ${remaining})`)

  return {
    allowed: true,
    remaining,
    used: usage.aiRequestsUsed,
    limit: DAILY_LIMIT,
    date: today,
  }
}

/**
 * Get current usage status without incrementing.
 * Safe to call from frontend.
 */
export async function getUsageStatus(userId) {
  const usage = await getOrCreateUsage(userId)
  const remaining = Math.max(0, DAILY_LIMIT - usage.aiRequestsUsed)

  return {
    remaining,
    used: usage.aiRequestsUsed,
    limit: DAILY_LIMIT,
    date: getTodayUTC(),
  }
}

/**
 * Reset is automatic — each day creates a fresh record.
 * No manual reset needed. The date-based lookup naturally
 * ignores previous days' records.
 *
 * Timezone: UTC midnight. If a user is in UTC+5:30 (India),
 * their day resets at 5:30 AM IST, not midnight IST.
 * This is intentional — UTC is consistent globally.
 */
