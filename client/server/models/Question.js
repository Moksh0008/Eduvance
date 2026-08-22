import mongoose from 'mongoose'

const questionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  prompt: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: Number, required: true },
  explanation: { type: String, default: '' },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  sourceMaterialId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaterialChunk', default: null },
  sourceContext: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
})

questionSchema.index({ userId: 1, subject: 1, topic: 1 })
questionSchema.index({ userId: 1, createdAt: -1 })

export const Question = mongoose.model('Question', questionSchema)
