import * as catalog from './catalog'
import { deriveNowStudy, deriveSchedule, derivePlanDelta } from './adaptive'
import { allTopics, collectMaterials, includedSubjects } from './workspace'
import { daysUntil } from '../utils/format'

export function buildUserView(workspace, user) {
  const history = workspace.quizResults || workspace.quizHistory || []
  const included = includedSubjects(workspace)
  const includedIds = new Set(included.map((s) => s.id))

  const allSubjects = (workspace.subjects || []).map((s) => mapSubject(s, history))
  const subjects = allSubjects.filter((s) => includedIds.has(s.id))

  const allExams = allSubjects.map((s) => ({
    id: `ex-${s.id}`,
    subjectId: s.id,
    name: s.name,
    date: s.examDate,
    time: s.examTime || '10:00',
    venue: '—',
    marks: s.marks || 100,
    included: includedIds.has(s.id),
  }))
  const exams = allExams.filter((e) => e.included)

  const topics = allTopics(workspace)
  const nowStudy = deriveNowStudy(workspace)
  const schedule = deriveSchedule(workspace)
  const quizAverage = history.length
    ? Math.round(history.reduce((n, q) => n + q.score, 0) / history.length)
    : 0

  const bySubject = {}
  const byTopic = {}
  history.forEach((q) => {
    bySubject[q.subject] = bySubject[q.subject] || []
    bySubject[q.subject].push(q.score)
    const key = `${q.subject} → ${q.topic}`
    byTopic[key] = byTopic[key] || []
    byTopic[key].push(q.score)
  })

  const subjectAccuracy = subjects.map((s) => {
    const scores = bySubject[s.name] || []
    return {
      name: s.name,
      accuracy: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      attempts: scores.length,
    }
  })
  const topicAccuracy = Object.entries(byTopic).map(([topic, scores]) => ({
    topic,
    accuracy: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
  }))
  const ranked = [...subjectAccuracy].filter((s) => s.attempts).sort((a, b) => b.accuracy - a.accuracy)

  const weakTopics = (workspace.weakTopics || []).length
    ? workspace.weakTopics
    : history.filter((q) => q.score < 70).map((q) => ({ name: q.topic, subject: q.subject, mastery: q.score }))

  const strongTopics = history
    .filter((q) => q.score >= 70)
    .map((q) => ({ name: q.topic, subject: q.subject, mastery: q.score }))

  const overall = subjects.length
    ? Math.round(subjects.reduce((n, s) => n + s.progress, 0) / subjects.length)
    : 0

  const generate = workspace.preferences?.generate
  const wantsPlan = generate === 'both' || generate === 'timetable' || workspace.preferences?.generateStudyPlan
  const wantsQuiz = generate === 'both' || generate === 'quizzes' || workspace.preferences?.generateQuizzes

  return {
    isDemo: false,
    analysisQueued: false,
    setupCompleted: Boolean(workspace.setupCompleted || workspace.onboardingComplete),
    student: {
      name: user?.name || 'Student',
      email: user?.email || '',
      dailyMinutes: (workspace.preferences?.dailyHours || 3) * 60,
      weeklyHoursLogged: history.length * 0.4,
      prepScore: overall,
      targetPrepScore: 85,
    },
    nowStudy,
    exams,
    allExams,
    subjects,
    allSubjects,
    includedIds: [...includedIds],
    topics,
    schedule: wantsPlan ? schedule : [],
    weekPlan: [],
    progress: {
      overall,
      hoursThisWeek: Math.round(history.length * 0.4 * 10) / 10,
      hoursTarget: (workspace.preferences?.dailyHours || 3) * 7,
      topicsCompleted: new Set(history.filter((q) => q.score >= 70).map((q) => q.topic)).size,
      topicsTotal: topics.length,
      quizAverage,
      weakTopics,
      strongTopics,
      activity: history.slice(-6).reverse().map((q, i) => ({
        id: `q-${i}`,
        text: `Quiz · ${q.subject} → ${q.topic} · ${q.score}%`,
        time: q.date || q.at,
      })),
      risks: [],
    },
    analytics: {
      overallAccuracy: quizAverage,
      subjectAccuracy,
      topicAccuracy,
      strongest: ranked.slice(0, 3),
      weakest: [...ranked].reverse().slice(0, 3),
      history,
      trend: history.map((q, i) => ({ attempt: i + 1, accuracy: q.score, label: q.topic })),
    },
    planDelta: derivePlanDelta(workspace),
    monitorRisks: buildRisks(nowStudy, exams, weakTopics),
    readiness: subjects.map((s) => ({
      subjectId: s.id,
      name: s.name,
      overall: s.progress,
      coverage: s.syllabusCoverage,
      mastery: s.mastery,
      practice: s.mastery,
      revision: Math.min(100, s.progress + 8),
      status: s.progress >= 70 ? 'on-track' : 'at-risk',
      statusLabel: s.progress >= 70 ? "You're on track" : s.mastery ? 'Needs practice' : 'Awaiting evidence',
      note: 'Preparation readiness from your quizzes and topic list — not a predicted exam mark.',
    })),
    timetableFile: workspace.timetableFile,
    materials: collectMaterials(workspace),
    preferences: workspace.preferences,
    generate,
    wantsPlan,
    wantsQuiz,
    quizResults: history,
  }
}

function mapSubject(s, history) {
  const quizzes = (history || []).filter((q) => q.subjectId === s.id || q.subject === s.name)
  const avg = quizzes.length ? Math.round(quizzes.reduce((n, q) => n + q.score, 0) / quizzes.length) : 0
  const topicCount = (s.units || []).reduce((n, u) => n + (u.topics || []).filter((t) => t.name).length, 0)
  const attempted = new Set(quizzes.map((q) => q.topic)).size
  const coverage = topicCount ? Math.round((attempted / topicCount) * 100) : s.syllabusFile ? 10 : 0
  return {
    id: s.id,
    name: s.name,
    fullName: s.name,
    code: '',
    examDate: s.examDate,
    examTime: s.examTime,
    marks: s.marks,
    progress: Math.max(coverage, avg ? Math.round(avg * 0.4 + coverage * 0.6) : coverage),
    mastery: avg,
    syllabusCoverage: coverage,
    priority: daysUntil(s.examDate || '2099-01-01') <= 7 ? 'high' : 'medium',
    weakTopics: quizzes.filter((q) => q.score < 70).map((q) => q.topic),
    syllabusFile: s.syllabusFile,
    units: s.units || [],
  }
}

function buildRisks(nowStudy, exams, weakTopics) {
  const risks = []
  const soon = exams.find((e) => daysUntil(e.date) <= 7)
  if (soon && weakTopics.length) {
    risks.push({
      id: 'risk-soon',
      level: 'high',
      label: 'High risk',
      title: `${soon.name} exam is in ${daysUntil(soon.date)} days.`,
      body: `${weakTopics[0].name} is still below target. Replan remaining hours toward it.`,
      cta: 'Replan',
      to: '/planner',
    })
  }
  if (nowStudy && nowStudy.priorityLabel === 'HIGH') {
    risks.push({
      id: 'risk-now',
      level: 'attention',
      label: 'Attention',
      title: `${nowStudy.subject} → ${nowStudy.topic}`,
      body: nowStudy.reasons?.[1] || 'This is the highest-return block in the current state.',
      cta: 'Study now',
      to: '/study-session',
    })
  }
  return risks
}

export function buildDemoView() {
  return {
    isDemo: true,
    analysisQueued: false,
    setupCompleted: true,
    student: catalog.getStudent(),
    nowStudy: catalog.getNowStudy(),
    exams: catalog.getExams().map((e) => {
      const s = catalog.getSubjects().find((x) => x.id === e.subjectId)
      return { ...e, name: s?.name }
    }),
    subjects: catalog.getSubjects(),
    allSubjects: catalog.getSubjects(),
    allExams: catalog.getExams().map((e) => {
      const s = catalog.getSubjects().find((x) => x.id === e.subjectId)
      return { ...e, name: s?.name, included: true }
    }),
    topics: catalog.getTopics(),
    schedule: catalog.getSchedule(false),
    weekPlan: catalog.getWeekPlan(),
    progress: catalog.getProgress(),
    analytics: {
      overallAccuracy: catalog.getProgress().quizAverage,
      subjectAccuracy: catalog.getSubjects().map((s) => ({ name: s.name, accuracy: s.mastery })),
      topicAccuracy: [],
      strongest: catalog.getProgress().strongTopics.map((t) => ({ name: t.subject, accuracy: t.mastery })),
      weakest: catalog.getProgress().weakTopics.map((t) => ({ name: t.subject, accuracy: t.mastery })),
      history: [],
      trend: [],
    },
    planDelta: catalog.getPlanDelta(),
    monitorRisks: catalog.getMonitorRisks(),
    readiness: catalog.getReadiness(),
    timetableFile: { name: 'demo-timetable.pdf' },
    materials: [],
    preferences: { generate: 'both', dailyHours: 6 },
    generate: 'both',
    wantsPlan: true,
    wantsQuiz: true,
    quizResults: [],
  }
}
