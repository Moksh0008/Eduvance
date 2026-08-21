import { emptyWorkspace, ensureSubjectTopics, remapQuizHistory, saveWorkspace } from './workspace'
import { recordQuizAndReplan } from './adaptive'

export const PrepAction = {
  HYDRATE: 'HYDRATE',
  COMPLETE_SETUP: 'COMPLETE_SETUP',
  RECORD_QUIZ: 'RECORD_QUIZ',
  PATCH: 'PATCH',
  REPLACE: 'REPLACE',
}

export function preparationReducer(state, action) {
  switch (action.type) {
    case PrepAction.HYDRATE:
      return action.payload
    case PrepAction.COMPLETE_SETUP: {
      const subjects = ensureSubjectTopics(action.payload.subjects || [])
      const history = remapQuizHistory(state.subjects, subjects, state.quizResults || state.quizHistory || [])
      const weakTopics = history
        .filter((q) => q.score < 70)
        .reduce((acc, q) => {
          acc[`${q.subject}|${q.topic}`] = { name: q.topic, subject: q.subject, mastery: q.score }
          return acc
        }, {})
      const next = {
        ...emptyWorkspace(),
        ...state,
        ...action.payload,
        subjects,
        setupCompleted: true,
        onboardingComplete: true,
        demoMode: false,
        analysisStatus: 'idle',
        quizResults: history,
        quizHistory: history,
        weakTopics: Object.values(weakTopics),
        planUpdates: state.planUpdates || [],
        uploadedMaterials: [
          action.payload.timetableFile
            ? {
                id: 'mat_timetable',
                subjectId: null,
                fileName: action.payload.timetableFile.name,
                fileType: action.payload.timetableFile.type,
                status: 'uploaded',
              }
            : null,
          ...subjects
            .filter((s) => s.syllabusFile)
            .map((s) => ({
              id: `mat_${s.id}`,
              subjectId: s.id,
              fileName: s.syllabusFile.name,
              fileType: s.syllabusFile.type,
              status: 'uploaded',
            })),
        ].filter(Boolean),
      }
      return saveWorkspace(next)
    }
    case PrepAction.RECORD_QUIZ:
      return saveWorkspace(recordQuizAndReplan(state, action.payload))
    case PrepAction.PATCH:
      return saveWorkspace({ ...state, ...action.payload, demoMode: false })
    case PrepAction.REPLACE:
      return saveWorkspace({ ...action.payload, demoMode: false })
    default:
      return state
  }
}
