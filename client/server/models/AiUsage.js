import mongoose from 'mongoose'

const aiUsageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Date stored as UTC midnight for clear daily reset
  date: { type: String, required: true }, // "YYYY-MM-DD" in UTC
  aiRequestsUsed: { type: Number, default: 0, min: 0 },
  lastRequestAt: { type: Date, default: null },
}, { timestamps: true })

// One record per user per day — compound unique index prevents duplicates
aiUsageSchema.index({ userId: 1, date: 1 }, { unique: true })

// Fast lookup for today's usage
aiUsageSchema.index({ userId: 1 })

// Helper: get today's date string in UTC
aiUsageSchema.statics.todayUTC = function () {
  return new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
}

export const AiUsage = mongoose.model('AiUsage', aiUsageSchema)
