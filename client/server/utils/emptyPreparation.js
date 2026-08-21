export function emptyPreparation() {
  return {
    student: { name: '', email: '' },
    setupCompleted: false,
    onboardingComplete: false,
    analysisStatus: 'idle',
    timetableFile: null,
    exams: [],
    subjects: [],
    uploadedMaterials: [],
    preferences: {
      generate: 'both',
      generateStudyPlan: true,
      generateQuizzes: true,
      include: 'all',
      selectedIds: [],
      selectedSubjects: [],
      hoursPreset: '3',
      dailyHours: 3,
    },
    progress: {},
    quizResults: [],
    quizHistory: [],
    weakTopics: [],
    studyPlan: [],
    planUpdates: [],
    analytics: {},
  }
}

export function toClientPreparation(doc) {
  if (!doc) return emptyPreparation()
  const raw = typeof doc.toObject === 'function' ? doc.toObject() : doc
  const { _id, __v, userId, passwordHash, ...rest } = raw
  return {
    ...emptyPreparation(),
    ...rest,
    setupCompleted: Boolean(rest.setupCompleted || rest.onboardingComplete),
    quizResults: rest.quizResults?.length ? rest.quizResults : rest.quizHistory || [],
    quizHistory: rest.quizHistory?.length ? rest.quizHistory : rest.quizResults || [],
  }
}
