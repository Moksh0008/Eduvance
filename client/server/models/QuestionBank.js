import mongoose from 'mongoose'

const questionBankSchema = new mongoose.Schema({
  // Normalized matching fields (lowercase, trimmed)
  subject: { type: String, required: true, index: true },
  topic: { type: String, required: true, index: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },

  // Question content
  prompt: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, default: '' },

  // Metadata
  hitCount: { type: Number, default: 0 },
  lastUsedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true })

// Compound index for efficient cache lookups
questionBankSchema.index({ subject: 1, topic: 1, difficulty: 1 })

// Unique compound index to prevent duplicate questions
questionBankSchema.index(
  { subject: 1, topic: 1, difficulty: 1, prompt: 1 },
  { unique: true }
)

// Normalize helper: lowercase + trim + collapse whitespace
questionBankSchema.statics.normalize = function (str) {
  return (str || '').toLowerCase().trim().replace(/\s+/g, ' ')
}

export const QuestionBank = mongoose.model('QuestionBank', questionBankSchema)
