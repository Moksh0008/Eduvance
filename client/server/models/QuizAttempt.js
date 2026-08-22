import mongoose from 'mongoose'

const quizAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  selectedAnswer: { type: Number, required: true },
  correctAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
})

quizAttemptSchema.index({ userId: 1, quizId: 1 })
quizAttemptSchema.index({ userId: 1, subject: 1, topic: 1 })

export const QuizAttempt = mongoose.model('QuizAttempt', quizAttemptSchema)
