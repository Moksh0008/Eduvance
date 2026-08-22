import mongoose from 'mongoose'

const topicMasterySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  totalAttempts: { type: Number, default: 0 },
  correctAttempts: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  difficultyBreakdown: {
    easy: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    medium: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
    hard: { attempts: { type: Number, default: 0 }, correct: { type: Number, default: 0 } },
  },
  lastStudied: { type: Date, default: null },
  recentAccuracy: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  mastery: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

topicMasterySchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true })

export const TopicMastery = mongoose.model('TopicMastery', topicMasterySchema)
