/* ═══════════════════════════════════════════════════
   FEATURE GATE SERVICE — Plan-based access control
   
   Backend-enforced feature limits per subscription plan.
   Frontend can display premium UI, but backend is authoritative.
   
   Plans are configurable via environment variables.
   ═══════════════════════════════════════════════════ */

import { Subscription } from '../models/Subscription.js'

// ═══ PLAN CONFIGURATION ═══
// Configurable via environment variables.

const PLAN_CONFIG = {
  free: {
    label: 'Free',
    dailyAiLimit: parseInt(process.env.FREE_DAILY_AI_LIMIT, 10) || 3,
    maxQuizQuestions: parseInt(process.env.FREE_MAX_QUIZ_QUESTIONS, 10) || 10,
    advancedAnalytics: false,
    advancedExplanations: false,
    enhancedPlanning: false,
    prioritySupport: false,
  },
  premium: {
    label: 'Premium',
    dailyAiLimit: parseInt(process.env.PREMIUM_DAILY_AI_LIMIT, 10) || 20,
    maxQuizQuestions: parseInt(process.env.PREMIUM_MAX_QUIZ_QUESTIONS, 10) || 50,
    advancedAnalytics: true,
    advancedExplanations: true,
    enhancedPlanning: true,
    prioritySupport: true,
  },
}

console.log('[FeatureGate] Plan config:', {
  free: { dailyAiLimit: PLAN_CONFIG.free.dailyAiLimit },
  premium: { dailyAiLimit: PLAN_CONFIG.premium.dailyAiLimit },
})

// ═══ SUBSCRIPTION HELPERS ═══

/**
 * Get or create a user's subscription record.
 * New users default to free plan.
 */
export async function getOrCreateSubscription(userId) {
  let sub = await Subscription.findOne({ userId })
  if (sub) return sub

  // Create default free subscription
  try {
    sub = await Subscription.create({
      userId,
      plan: 'free',
      status: 'active',
      startDate: new Date(),
    })
  } catch (err) {
    if (err.code === 11000) {
      sub = await Subscription.findOne({ userId })
    } else {
      throw err
    }
  }

  return sub
}

/**
 * Get the effective plan for a user.
 * Checks subscription status and expiry.
 */
export async function getEffectivePlan(userId) {
  const sub = await getOrCreateSubscription(userId)

  // Check if premium subscription has expired
  if (sub.plan === 'premium' && sub.endDate && new Date() > sub.endDate) {
    // Auto-downgrade expired premium to free
    sub.plan = 'free'
    sub.status = 'expired'
    await sub.save()
    console.log(`[FeatureGate] User ${userId} premium expired — downgraded to free`)
  }

  // Check if cancelled
  if (sub.status === 'cancelled') {
    sub.plan = 'free'
  }

  return sub.plan
}

// ═══ FEATURE ACCESS CHECKS ═══

/**
 * Get the full feature set for a user's current plan.
 * Respects per-user feature overrides from subscription.features.
 */
export async function getPlanFeatures(userId) {
  const sub = await getOrCreateSubscription(userId)
  const effectivePlan = sub.isActive() ? sub.plan : 'free'
  const baseConfig = PLAN_CONFIG[effectivePlan]

  // Apply per-user overrides from subscription.features
  const features = { ...baseConfig }
  if (sub.features) {
    if (sub.features.dailyAiLimit != null) features.dailyAiLimit = sub.features.dailyAiLimit
    if (sub.features.advancedAnalytics != null) features.advancedAnalytics = sub.features.advancedAnalytics
    if (sub.features.advancedExplanations != null) features.advancedExplanations = sub.features.advancedExplanations
    if (sub.features.enhancedPlanning != null) features.enhancedPlanning = sub.features.enhancedPlanning
  }

  return {
    plan: effectivePlan,
    status: sub.status,
    isActive: sub.isActive(),
    features,
    subscription: {
      startDate: sub.startDate,
      endDate: sub.endDate,
      cancelledAt: sub.cancelledAt,
    },
  }
}

/**
 * Check if a user has access to a specific feature.
 * Returns { allowed, reason }
 */
export async function checkFeatureAccess(userId, feature) {
  const planFeatures = await getPlanFeatures(userId)

  const featureMap = {
    'ai-generation': () => ({
      allowed: true, // All plans can generate (limit differs)
      dailyLimit: planFeatures.features.dailyAiLimit,
      plan: planFeatures.plan,
    }),
    'advanced-analytics': () => ({
      allowed: planFeatures.features.advancedAnalytics,
      reason: planFeatures.features.advancedAnalytics
        ? 'Included in your plan'
        : 'Upgrade to Premium for advanced analytics',
    }),
    'advanced-explanations': () => ({
      allowed: planFeatures.features.advancedExplanations,
      reason: planFeatures.features.advancedExplanations
        ? 'Included in your plan'
        : 'Upgrade to Premium for detailed AI explanations',
    }),
    'enhanced-planning': () => ({
      allowed: planFeatures.features.enhancedPlanning,
      reason: planFeatures.features.enhancedPlanning
        ? 'Included in your plan'
        : 'Upgrade to Premium for enhanced study planning',
    }),
    'priority-support': () => ({
      allowed: planFeatures.features.prioritySupport,
      reason: planFeatures.features.prioritySupport
        ? 'Included in your plan'
        : 'Upgrade to Premium for priority support',
    }),
    'max-quiz-questions': () => ({
      allowed: true,
      maxQuestions: planFeatures.features.maxQuizQuestions,
      plan: planFeatures.plan,
    }),
  }

  const checker = featureMap[feature]
  if (!checker) {
    return { allowed: false, reason: `Unknown feature: ${feature}` }
  }

  return checker()
}

/**
 * Get the daily AI limit for a user based on their plan.
 */
export async function getDailyAiLimit(userId) {
  const plan = await getEffectivePlan(userId)
  return PLAN_CONFIG[plan].dailyAiLimit
}

// ═══ ADMIN FUNCTIONS ═══

/**
 * Upgrade a user to premium. (For future payment integration)
 */
export async function upgradeToPremium(userId, options = {}) {
  const { durationDays = 30, paymentId = null, paymentProvider = null } = options

  const sub = await getOrCreateSubscription(userId)
  sub.plan = 'premium'
  sub.status = 'active'
  sub.startDate = new Date()
  sub.endDate = durationDays
    ? new Date(Date.now() + durationDays * 86400000)
    : null
  sub.paymentId = paymentId
  sub.paymentProvider = paymentProvider
  sub.cancelledAt = null
  await sub.save()

  console.log(`[FeatureGate] User ${userId} upgraded to premium (expires: ${sub.endDate || 'never'})`)
  return sub
}

/**
 * Cancel a user's premium subscription.
 */
export async function cancelPremium(userId) {
  const sub = await getOrCreateSubscription(userId)
  if (sub.plan === 'free') return sub

  sub.status = 'cancelled'
  sub.cancelledAt = new Date()
  await sub.save()

  console.log(`[FeatureGate] User ${userId} premium cancelled`)
  return sub
}

/**
 * Get plan configuration (for admin/debugging).
 */
export function getPlanConfig() {
  return { ...PLAN_CONFIG }
}
