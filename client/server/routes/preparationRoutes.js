import { Router } from 'express'
import { deletePreparation, getPreparation, savePreparation } from '../controllers/preparationController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { Preparation } from '../models/Preparation.js'

export const preparationRoutes = Router()

preparationRoutes.use(authMiddleware)
preparationRoutes.get('/', getPreparation)
preparationRoutes.post('/', savePreparation)
preparationRoutes.put('/', savePreparation)
preparationRoutes.delete('/', deletePreparation)

// GET /api/preparation/syllabus/topics — Returns flattened topic list from stored syllabus
preparationRoutes.get('/syllabus/topics', async (req, res) => {
  try {
    const prep = await Preparation.findOne({ userId: req.user.userId })
    if (!prep || !prep.subjects?.length) {
      return res.json({ success: true, data: { subjects: [], topics: [] } })
    }
    // Flatten subjects → units → topics
    const subjects = []
    const topics = []
    for (const subj of prep.subjects) {
      const subjectTopics = []
      for (const unit of (subj.units || [])) {
        for (const topic of (unit.topics || [])) {
          if (topic.name?.trim()) {
            const t = {
              id: topic.id || `t_${subj.id}_${unit.id}_${topic.name}`,
              name: topic.name,
              subjectId: subj.id,
              subjectName: subj.name,
              unitId: unit.id,
              unitName: unit.name,
              difficulty: topic.difficulty || 'medium',
              importance: topic.importance || 'medium',
            }
            subjectTopics.push(t)
            topics.push(t)
          }
        }
      }
      if (subjectTopics.length > 0) {
        subjects.push({ id: subj.id, name: subj.name, topicCount: subjectTopics.length })
      }
    }
    return res.json({ success: true, data: { subjects, topics } })
  } catch (err) {
    console.error('[SyllabusTopics]', err.message)
    return res.status(500).json({ success: false, message: err.message })
  }
})
