/* ═══════════════════════════════════════════════════
   AI API — Frontend service for AI backend endpoints
   All calls go through /api/ai/*
   ═══════════════════════════════════════════════════ */

import { api } from './api'

export const aiApi = {
  /** Analyze syllabus text → returns structured subjects/units/topics */
  analyzeSyllabus: (syllabusText, subject) =>
    api.post('/ai/analyze-syllabus', { syllabusText, subject }),

  /** Upload study material file */
  uploadMaterial: async (file, subject = '') => {
    const formData = new FormData()
    formData.append('file', file)
    if (subject) formData.append('subject', subject)

    const token = (() => {
      try {
        const raw = localStorage.getItem('eduvance.auth')
        return raw ? JSON.parse(raw).token : null
      } catch { return null }
    })()

    const res = await fetch('/api/ai/upload-material', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const json = await res.json()
    if (!res.ok || json.success === false) {
      throw new Error(json.message || 'Upload failed')
    }
    return json.data
  },

  /** Generate AI quiz questions */
  generateQuiz: (subject, topic, difficulty, count = 5) =>
    api.post('/ai/generate-quiz', { subject, topic, difficulty, count }),

  /** Evaluate a single answer */
  evaluateAnswer: (quizId, questionId, selectedAnswer, timeTaken) =>
    api.post('/ai/evaluate-answer', { quizId, questionId, selectedAnswer, timeTaken }),

  /** Complete a quiz and get results + replan */
  completeQuiz: (quizId) =>
    api.post('/ai/complete-quiz', { quizId }),

  /** Get AI insights */
  getInsights: () => api.get('/ai/insights'),

  /** Get student context (weak topics, readiness, exam proximity) */
  getContext: () => api.get('/ai/context'),

  /** Get topic rankings */
  getRankings: () => api.get('/ai/rankings'),

  /** Get readiness score */
  getReadiness: () => api.get('/ai/readiness'),

  /** Get weak topics */
  getWeakTopics: () => api.get('/ai/weak-topics'),

  /** Get topic mastery data */
  getMastery: () => api.get('/ai/mastery'),

  /** Get uploaded materials */
  getMaterials: () => api.get('/ai/materials'),

  /** Delete a material */
  deleteMaterial: (materialId) => api.del(`/ai/materials/${materialId}`),

  /** Get Octo's contextual message */
  getOctoMessage: () => api.post('/ai/octo-message'),

  /** Replan study schedule */
  replan: () => api.post('/ai/replan'),
}
