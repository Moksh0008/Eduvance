import mongoose from 'mongoose'

const quizSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  totalQuestions: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  correctCount: { type: Number, default: 0 },
  status: { type: String, enum: ['in-progress', 'completed', 'abandoned'], default: 'in-progress' },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
  timePerQuestion: { type: [Number], default: [] },
}, { timestamps: true })

quizSchema.index({ userId: 1, createdAt: -1 })
quizSchema.index({ userId: 1, subject: 1, topic: 1 })

export const Quiz = mongoose.model('Quiz', quizSchema)
