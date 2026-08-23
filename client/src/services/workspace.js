import { loadPreparation, savePreparation, clearPreparation, loadUi, saveUi } from './storage'
import { loadAuth } from './auth'

export const HOUR_PRESETS = [
  { id: '<1', label: 'Less than 1 hour/day', hours: 0.75 },
  { id: '1-2', label: '1–2 hours/day', hours: 1.5 },
  { id: '3', label: '3 hours/day', hours: 3 },
  { id: '2-4', label: '2–4 hours/day', hours: 3 },
  { id: '4+', label: '4+ hours/day', hours: 5 },
  { id: 'custom', label: 'Custom', hours: 3 },
]

export function emptyWorkspace() {
  return {
    setupCompleted: false,
    onboardingComplete: false,
    demoMode: false,
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

function currentUserId() {
  return loadAuth()?.user?.id || null
}

export function loadWorkspace() {
  const userId = currentUserId()
  if (!userId) return emptyWorkspace()
  const stored = loadPreparation(userId)
  if (!stored) return emptyWorkspace()
  const merged = { ...emptyWorkspace(), ...stored }
  if (merged.onboardingComplete && !merged.setupCompleted) merged.setupCompleted = true
  if (merged.quizHistory?.length && !merged.quizResults?.length) merged.quizResults = merged.quizHistory
  if (merged.demoMode) {
    saveUi({ ...loadUi(), demoMode: true })
    merged.demoMode = false
    savePreparation(merged, userId)
  }
  return { ...merged, demoMode: false }
}

export function saveWorkspace(workspace) {
  const next = { ...workspace, demoMode: false }
  const userId = currentUserId()
  if (userId) savePreparation(next, userId)
  return next
}

export function clearWorkspace() {
  clearPreparation(currentUserId())
}

export function fileMeta(file) {
  if (!file) return null
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
    uploadedAt: new Date().toISOString(),
    status: 'uploaded',
  }
}

export function includedSubjects(workspace) {
  const list = workspace.subjects || []
  if (workspace.preferences?.include !== 'selected') return list
  const ids = new Set(workspace.preferences.selectedIds || [])
  return list.filter((s) => ids.has(s.id))
}

export function allTopics(workspace) {
  return includedSubjects(workspace).flatMap((subject) =>
    (subject.units || []).flatMap((unit) =>
      (unit.topics || [])
        .filter((topic) => topic.name?.trim())
        .map((topic) => ({
          ...topic,
          unitId: unit.id,
          unitName: unit.name,
          subjectId: subject.id,
          subjectName: subject.name,
          examDate: subject.examDate,
        })),
    ),
  )
}

/** Guarantee every included subject has at least one quizable topic without inventing a syllabus tree from a PDF. */
export function ensureSubjectTopics(subjects) {
  return (subjects || []).map((s) => {
    const namedTopics = (s.units || []).flatMap((u) => (u.topics || []).filter((t) => t.name?.trim()))
    if (namedTopics.length) return s
    // No topics extracted yet — return subject without fake topics
    return { ...s, units: [] }
  })
}

export function indexTopics(subjects) {
  const byId = {}
  ;(subjects || []).forEach((s) => {
    ;(s.units || []).forEach((u) => {
      ;(u.topics || []).forEach((t) => {
        if (t.id) byId[t.id] = { ...t, subjectId: s.id, subjectName: s.name }
      })
    })
  })
  return byId
}

/** Keep quiz evidence across Edit Preparation; retarget labels when the same subject/topic id is renamed. */
export function remapQuizHistory(prevSubjects, nextSubjects, results) {
  const nextById = Object.fromEntries((nextSubjects || []).map((s) => [s.id, s]))
  const prevByName = Object.fromEntries((prevSubjects || []).map((s) => [s.name, s]))
  const nextTopics = indexTopics(nextSubjects)
  return (results || []).map((q) => {
    const prev = (prevSubjects || []).find((s) => s.id === q.subjectId) || prevByName[q.subject]
    const next = (prev && nextById[prev.id]) || nextById[q.subjectId]
    if (!next) return q
    const topic = q.topicId ? nextTopics[q.topicId] : null
    return {
      ...q,
      subjectId: next.id,
      subject: next.name,
      topic: topic?.name || q.topic,
    }
  })
}

export function collectMaterials(workspace) {
  const fromSubjects = (workspace.subjects || [])
    .filter((s) => s.syllabusFile)
    .map((s) => ({
      id: `mat_${s.id}`,
      subjectId: s.id,
      fileName: s.syllabusFile.name,
      fileType: s.syllabusFile.type,
      status: 'uploaded',
    }))
  const tt = workspace.timetableFile
    ? [
        {
          id: 'mat_timetable',
          subjectId: null,
          fileName: workspace.timetableFile.name,
          fileType: workspace.timetableFile.type,
          status: 'uploaded',
        },
      ]
    : []
  return [...tt, ...fromSubjects, ...(workspace.uploadedMaterials || [])]
}
