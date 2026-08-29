import mongoose from 'mongoose'

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },

  // Plan: 'free' or 'premium'
  plan: { type: String, enum: ['free', 'premium'], default: 'free', required: true },

  // Status: active, inactive, cancelled, expired
  status: { type: String, enum: ['active', 'inactive', 'cancelled', 'expired'], default: 'active', required: true },

  // Subscription dates
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: null }, // null = no expiry (free plan or lifetime premium)
  cancelledAt: { type: Date, default: null },

  // Payment integration points (for future use)
  paymentProvider: { type: String, default: null }, // 'stripe', 'razorpay', etc.
  paymentId: { type: String, default: null }, // external payment ID
  planPrice: { type: Number, default: 0 }, // in cents or smallest currency unit

  // Feature flags (overridable per-user if needed)
  features: {
    dailyAiLimit: { type: Number, default: null }, // null = use plan default
    advancedAnalytics: { type: Boolean, default: null },
    advancedExplanations: { type: Boolean, default: null },
    enhancedPlanning: { type: Boolean, default: null },
  },
}, { timestamps: true })

// Fast lookup for plan checks
subscriptionSchema.index({ userId: 1, plan: 1 })

// Helper: check if subscription is currently active
subscriptionSchema.methods.isActive = function () {
  if (this.status === 'cancelled' || this.status === 'expired') return false
  if (this.plan === 'free') return true // free is always active
  if (this.endDate && new Date() > this.endDate) return false
  return this.status === 'active'
}

export const Subscription = mongoose.model('Subscription', subscriptionSchema)
