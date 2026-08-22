import mongoose from 'mongoose'

const materialChunkSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  materialId: { type: String, required: true },
  fileName: { type: String, required: true },
  fileType: { type: String, default: 'text/plain' },
  chunkIndex: { type: Number, required: true },
  content: { type: String, required: true },
  subject: { type: String, default: '' },
  topic: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  embedding: { type: [Number], default: [] },
  createdAt: { type: Date, default: Date.now },
})

materialChunkSchema.index({ userId: 1, materialId: 1 })
materialChunkSchema.index({ userId: 1, subject: 1 })
materialChunkSchema.index({ userId: 1, topic: 1 })

export const MaterialChunk = mongoose.model('MaterialChunk', materialChunkSchema)
