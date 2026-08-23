/* ═══════════════════════════════════════════════════
   AI API — Frontend service for AI backend endpoints
   All calls go through /api/ai/*
   ═══════════════════════════════════════════════════ */

import { api } from './api'

export const aiApi = {
  /** Analyze a file (PDF/text) server-side → returns structured subjects/units/topics */
  analyzeFile: async (file, subject = '') => {
    const formData = new FormData()
    formData.append('file', file)
    if (subject) formData.append('subject', subject)
    const token = (() => {
      try {
        const raw = localStorage.getItem('eduvance.auth')
        return raw ? JSON.parse(raw).token : null
      } catch { return null }
    })()
    let lastErr
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 120000)
        const res = await fetch('/api/ai/analyze-file', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timeout)
        const text = await res.text()
        let json
        try { json = JSON.parse(text) } catch {
          throw new Error('Server is waking up...')
        }
        if (!res.ok || json.success === false) throw new Error(json.message || `Analysis failed (${res.status})`)
        return json.data
      } catch (err) {
        lastErr = err
        if (attempt < 2) await new Promise(r => setTimeout(r, 5000 * (attempt + 1)))
      }
    }
    throw lastErr || new Error('Analysis failed. Server may be starting up — try again in 30 seconds.')
  },

  /** Analyze a timetable PDF server-side → returns exam/subject dates */
  analyzeTimetable: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const token = (() => {
      try {
        const raw = localStorage.getItem('eduvance.auth')
        return raw ? JSON.parse(raw).token : null
      } catch { return null }
    })()
    let lastErr
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 120000)
        const res = await fetch('/api/ai/analyze-timetable', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timeout)
        const text = await res.text()
        let json
        try { json = JSON.parse(text) } catch {
          throw new Error('Server is waking up...')
        }
        if (!res.ok || json.success === false) throw new Error(json.message || `Analysis failed (${res.status})`)
        return json.data
      } catch (err) {
        lastErr = err
        if (attempt < 2) await new Promise(r => setTimeout(r, 5000 * (attempt + 1)))
      }
    }
    throw lastErr || new Error('Analysis failed after retries')
  },

  /** Analyze syllabus text → returns structured subjects/units/topics */
  analyzeSyllabus: (syllabusText, subject) =>
    api.post('/ai/analyze-syllabus', { syllabusText, subject }, { timeout: 45000, retries: 1 }),

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

    let lastErr
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 120000)
        const res = await fetch('/api/ai/upload-material', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
          signal: controller.signal,
        })
        clearTimeout(timeout)
        const text = await res.text()
        let json
        try { json = JSON.parse(text) } catch {
          throw new Error('Server is waking up...')
        }
        if (!res.ok || json.success === false) {
          throw new Error(json.message || `Upload failed (${res.status})`)
        }
        return json.data
      } catch (err) {
        lastErr = err
        if (attempt < 2) await new Promise(r => setTimeout(r, 5000 * (attempt + 1)))
      }
    }
    throw lastErr || new Error('Upload failed. Server may be starting up — try again in 30 seconds.')
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
