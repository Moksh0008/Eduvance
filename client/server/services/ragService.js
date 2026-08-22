/* ═══════════════════════════════════════════════════
   RAG SERVICE — Retrieval-Augmented Generation
   Processes student materials and retrieves relevant context
   ═══════════════════════════════════════════════════ */

import { MaterialChunk } from '../models/MaterialChunk.js'

const CHUNK_SIZE = 800 // characters per chunk
const CHUNK_OVERLAP = 100 // overlap between chunks

/**
 * Process raw text into chunks and store in MongoDB
 */
export async function processAndStoreMaterial(userId, materialId, fileName, fileType, rawText, subject = '') {
  if (!rawText || rawText.trim().length === 0) {
    throw new Error('No text content to process')
  }

  // Clean the text
  const cleaned = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/ {3,}/g, '  ')
    .trim()

  // Split into chunks
  const chunks = splitIntoChunks(cleaned)

  // Store each chunk
  const storedChunks = []
  for (let i = 0; i < chunks.length; i++) {
    const chunk = await MaterialChunk.create({
      userId,
      materialId,
      fileName,
      fileType,
      chunkIndex: i,
      content: chunks[i],
      subject: subject || detectSubject(chunks[i]),
      topic: extractTopic(chunks[i]),
      metadata: {
        totalChunks: chunks.length,
        charCount: chunks[i].length,
      },
    })
    storedChunks.push(chunk)
  }

  return {
    materialId,
    fileName,
    chunksStored: storedChunks.length,
    subjects: [...new Set(storedChunks.map(c => c.subject))],
  }
}

/**
 * Retrieve relevant chunks for a given query/topic
 */
export async function retrieveRelevantChunks(userId, subject, topic, limit = 5) {
  // First try exact subject+topic match
  let chunks = []
  
  if (subject && topic) {
    chunks = await MaterialChunk.find({
      userId,
      subject: { $regex: new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      topic: { $regex: new RegExp(topic.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
    }).sort({ chunkIndex: 1 }).limit(limit)
  }

  // If not enough, broaden to subject only
  if (chunks.length < limit && subject) {
    const existingIds = new Set(chunks.map(c => String(c._id)))
    const moreChunks = await MaterialChunk.find({
      userId,
      subject: { $regex: new RegExp(subject.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      _id: { $nin: [...existingIds] },
    }).sort({ chunkIndex: 1 }).limit(limit - chunks.length)
    chunks = [...chunks, ...moreChunks]
  }

  // If still not enough, try partial topic match
  if (chunks.length < limit && topic) {
    const existingIds = new Set(chunks.map(c => String(c._id)))
    const topicWords = topic.split(/\s+/).filter(w => w.length > 2)
    if (topicWords.length > 0) {
      const topicRegex = topicWords.join('|')
      const moreChunks = await MaterialChunk.find({
        userId,
        topic: { $regex: new RegExp(topicRegex, 'i') },
        _id: { $nin: [...existingIds] },
      }).sort({ chunkIndex: 1 }).limit(limit - chunks.length)
      chunks = [...chunks, ...moreChunks]
    }
  }

  // If still not enough, get any material for this user
  if (chunks.length === 0) {
    chunks = await MaterialChunk.find({ userId })
      .sort({ chunkIndex: 1 })
      .limit(limit)
  }

  return chunks.map(c => ({
    content: c.content,
    subject: c.subject,
    topic: c.topic,
    fileName: c.fileName,
    chunkId: c._id,
  }))
}

/**
 * Get all materials for a user
 */
export async function getUserMaterials(userId) {
  const materials = await MaterialChunk.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: { materialId: '$materialId', fileName: '$fileName' },
        chunkCount: { $sum: 1 },
        subjects: { $addToSet: '$subject' },
        topics: { $addToSet: '$topic' },
        createdAt: { $min: '$createdAt' },
      },
    },
    { $sort: { createdAt: -1 } },
  ])

  return materials.map(m => ({
    materialId: m._id.materialId,
    fileName: m._id.fileName,
    chunkCount: m.chunkCount,
    subjects: m.subjects.filter(Boolean),
    topics: m.topics.filter(Boolean),
    createdAt: m.createdAt,
  }))
}

/**
 * Delete all chunks for a material
 */
export async function deleteMaterial(userId, materialId) {
  const result = await MaterialChunk.deleteMany({ userId, materialId })
  return { deleted: result.deletedCount }
}

/**
 * Build context string from retrieved chunks for Grok prompt
 */
export function buildContextString(chunks) {
  if (!chunks.length) return ''
  return chunks
    .map((c, i) => `[Source: ${c.fileName} — ${c.subject}/${c.topic}]\n${c.content}`)
    .join('\n\n---\n\n')
}

// ── Internal Helpers ──

function splitIntoChunks(text) {
  const chunks = []
  let start = 0

  while (start < text.length) {
    let end = start + CHUNK_SIZE

    // Try to break at paragraph or sentence boundary
    if (end < text.length) {
      const paragraphBreak = text.lastIndexOf('\n\n', end)
      const sentenceBreak = text.lastIndexOf('. ', end)
      const newlineBreak = text.lastIndexOf('\n', end)

      if (paragraphBreak > start + CHUNK_SIZE * 0.5) {
        end = paragraphBreak + 2
      } else if (sentenceBreak > start + CHUNK_SIZE * 0.5) {
        end = sentenceBreak + 2
      } else if (newlineBreak > start + CHUNK_SIZE * 0.5) {
        end = newlineBreak + 1
      }
    }

    chunks.push(text.slice(start, Math.min(end, text.length)).trim())
    start = end - CHUNK_OVERLAP
  }

  return chunks.filter(c => c.length > 20)
}

function detectSubject(text) {
  const lower = text.toLowerCase()
  const subjects = [
    'database', 'dbms', 'sql', 'normalization',
    'network', 'tcp', 'ip', 'osi', 'routing',
    'operating system', 'process', 'memory', 'thread',
    'java', 'object', 'class', 'inheritance',
    'algorithm', 'data structure', 'sorting', 'graph',
    'compiler', 'lexer', 'parser', 'grammar',
    'machine learning', 'neural', 'deep learning',
    'physics', 'chemistry', 'mathematics', 'calculus',
  ]

  for (const s of subjects) {
    if (lower.includes(s)) return s.charAt(0).toUpperCase() + s.slice(1)
  }
  return 'General'
}

function extractTopic(text) {
  // Try to extract a topic from the first 200 characters
  const firstLines = text.slice(0, 200)
  const lines = firstLines.split('\n').filter(l => l.trim())

  // Look for heading-like lines
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('#') || trimmed.startsWith('Chapter') || trimmed.startsWith('Unit')) {
      return trimmed.replace(/^#+\s*/, '').replace(/^(Chapter|Unit)\s*\d*[:.]\s*/i, '').trim()
    }
  }

  // Use first meaningful line
  return lines[0]?.slice(0, 80)?.trim() || 'General'
}
