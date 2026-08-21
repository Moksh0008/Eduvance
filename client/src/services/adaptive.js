import { allTopics, includedSubjects } from './workspace'
import { daysUntil } from '../utils/format'

export function latestScoreForTopic(workspace, subjectName, topicName) {
  const list = [...(workspace.quizResults || workspace.quizHistory || [])]
    .reverse()
    .find((q) => q.subject === subjectName && q.topic === topicName)
  return list?.score
}

export function deriveNowStudy(workspace) {
  const topics = allTopics(workspace)
  const subjects = includedSubjects(workspace)
  if (!subjects.length) return null

  const scored = topics.map((topic) => {
    const days = daysUntil(topic.examDate)
    const quiz = latestScoreForTopic(workspace, topic.subjectName, topic.name)
    const urgency = Math.max(0, 100 - days * 5)
    const weakness = quiz == null ? 40 : Math.max(0, 100 - quiz)
    const score = Math.round(urgency * 0.45 + weakness * 0.55)
    return { topic, days, quiz, score }
  })

  scored.sort((a, b) => b.score - a.score)
  const pick = scored[0]
  if (!pick) return null

  const minutes = pick.quiz != null && pick.quiz < 70 ? 75 : pick.days <= 5 ? 75 : 45
  const reasons = []
  if (pick.days < 90) reasons.push(`Exam in ${pick.days} days`)
  if (pick.quiz != null) reasons.push(`Recent quiz accuracy: ${pick.quiz}%`)
  else reasons.push('No quiz evidence yet — starting from exam urgency')
  reasons.push('Topic belongs to your selected subjects')
  if (pick.quiz != null && pick.quiz < 70) reasons.push('Topic not yet at target mastery')

  return {
    subject: pick.topic.subjectName,
    topic: pick.topic.name,
    topicId: pick.topic.id,
    subjectId: pick.topic.subjectId,
    priorityScore: Math.min(99, pick.score),
    priorityLabel: pick.score >= 70 || pick.days <= 5 ? 'HIGH' : pick.score >= 45 ? 'MEDIUM' : 'LOW',
    estimatedLabel: `${minutes} min`,
    estimatedMin: minutes,
    provisional: pick.quiz == null,
    reasons,
  }
}

export function deriveSchedule(workspace) {
  const now = deriveNowStudy(workspace)
  const subjects = includedSubjects(workspace)
  const dailyMin = Math.round((workspace.preferences?.dailyHours || 3) * 60)
  if (!subjects.length) return []

  const primary = now ? Math.min(dailyMin, now.estimatedMin || 75) : Math.round(dailyMin * 0.5)
  const rest = Math.max(0, dailyMin - primary)
  const others = subjects.filter((s) => s.name !== now?.subject)

  const blocks = []
  if (now) {
    blocks.push({
      id: 'today-1',
      start: '09:00',
      end: minutesToClock(9 * 60 + primary),
      subject: now.subject,
      topic: now.topic,
      kind: 'Learn',
      priority: now.priorityScore,
      minutes: primary,
      done: false,
      changed: Boolean((workspace.planUpdates || []).length),
    })
  }
  if (others[0] && rest > 0) {
    const slice = Math.round(rest * 0.6) || rest
    blocks.push({
      id: 'today-2',
      start: minutesToClock(9 * 60 + primary + 15),
      end: minutesToClock(9 * 60 + primary + 15 + slice),
      subject: others[0].name,
      topic: (others[0].units?.[0]?.topics?.[0]?.name) || `${others[0].name} review`,
      kind: 'Practice',
      priority: 55,
      minutes: slice,
      done: false,
    })
  }
  return blocks
}

export function derivePlanDelta(workspace) {
  const updates = workspace.planUpdates || []
  const latest = updates.at(-1)
  if (!latest) return null
  const subjects = includedSubjects(workspace).slice(0, 3)
  if (!subjects.length) return null
  return {
    reason: latest.reason,
    original: subjects.map((s) => ({ subject: s.name, hours: 2, label: '2h' })),
    current: subjects.map((s, i) => {
      const boost = s.name === latest.subject || i === 0
      const hours = boost ? 2 + (latest.minutesDelta || 45) / 60 : 1.5
      const h = Math.floor(hours)
      const m = Math.round((hours - h) * 60)
      return { subject: s.name, hours, label: m ? `${h}h ${m}m` : `${h}h` }
    }),
  }
}

export function recordQuizAndReplan(workspace, result) {
  const entry = {
    subject: result.subject,
    subjectId: result.subjectId || null,
    topic: result.topic,
    topicId: result.topicId || null,
    score: result.score,
    total: result.total,
    correct: result.correct,
    incorrect: (result.total || 0) - (result.correct || 0),
    accuracy: result.score,
    date: new Date().toISOString(),
    at: new Date().toISOString(),
    kind: result.kind,
    missed: result.missed || [],
  }
  const weak = result.score < 70
  const update = {
    topic: result.topic,
    subject: result.subject,
    minutesDelta: weak ? 45 : -15,
    reason: weak
      ? `Your exam is approaching and ${result.topic} scored ${result.score}% — below target.`
      : `${result.topic} scored ${result.score}%. Minutes can move to weaker remaining topics.`,
    at: entry.at,
  }

  const history = [...(workspace.quizResults || workspace.quizHistory || []), entry]
  const weakTopics = history
    .filter((q) => q.score < 70)
    .reduce((acc, q) => {
      const key = `${q.subject}|${q.topic}`
      acc[key] = { name: q.topic, subject: q.subject, mastery: q.score }
      return acc
    }, {})

  return {
    ...workspace,
    quizResults: history,
    quizHistory: history,
    weakTopics: Object.values(weakTopics),
    planUpdates: [...(workspace.planUpdates || []), update],
  }
}

function minutesToClock(total) {
  const h = Math.floor(total / 60) % 24
  const m = total % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
