import mongoose from 'mongoose'

const insightSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['strength', 'weakness', 'improvement', 'regression', 'action', 'consistency', 'recommendation', 'alert'], required: true },
  text: { type: String, required: true },
  emoji: { type: String, default: '💡' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  subject: { type: String, default: null },
  topic: { type: String, default: null },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

insightSchema.index({ userId: 1, createdAt: -1 })
insightSchema.index({ userId: 1, type: 1 })

export const Insight = mongoose.model('Insight', insightSchema)
