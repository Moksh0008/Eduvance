import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { DemoBanner } from '../components/domain/ModeBanners'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'
import { SubjectSelector } from '../components/domain/SubjectSelector'
import { TopicSelector } from '../components/domain/TopicSelector'
import { AdaptiveInsight } from '../components/domain/AdaptiveInsight'
import { getQuizBank, hasRealQuestions } from '../services/quiz'
import { useAppData } from '../hooks/useAppData'
import { useAppState } from '../context/AppState'

export function QuizPage() {
  const data = useAppData()
  const { setupCompleted } = useAppState()
  const bank = getQuizBank()
  const subjects = data.subjects || []
  const topics = data.topics || []
  const navigate = useNavigate()
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '')
  const topicOptions = topics.filter((t) => !subjectId || t.subjectId === subjectId)
  const [topicId, setTopicId] = useState('')

  useEffect(() => {
    if (!subjectId && subjects[0]?.id) setSubjectId(subjects[0].id)
  }, [subjects, subjectId])

  useEffect(() => {
    if (!topicOptions.some((t) => t.id === topicId)) {
      setTopicId(topicOptions[0]?.id || '')
    }
  }, [topicOptions, topicId])

  const selectedTopic = topics.find((t) => t.id === topicId) || topicOptions[0]

  function startDemo() {
    sessionStorage.setItem(
      'eduvance.quiz.config',
      JSON.stringify({ kind: 'demo', subject: bank.subject, topic: bank.topic, count: 10, minutes: 15 }),
    )
    navigate('/quiz/play')
  }

  function startCheck() {
    const topic = selectedTopic
    if (!topic) return
    const subjectName = topic.subjectName || topic.subject || subjects.find(s => s.id === topic.subjectId)?.name || ''
    sessionStorage.setItem(
      'eduvance.quiz.config',
      JSON.stringify({
        kind: 'check',
        subject: subjectName,
        subjectId: topic.subjectId,
        topic: topic.name,
        topicId: topic.id,
        count: 10,
        minutes: 15,
      }),
    )
    navigate('/quiz/play')
  }

  const hasBankQuestions = selectedTopic && (() => {
    const subjName = selectedTopic.subjectName || selectedTopic.subject || subjects.find(s => s.id === selectedTopic.subjectId)?.name || ''
    return hasRealQuestions(subjName, selectedTopic.name)
  })()

  if (!data.isDemo && !setupCompleted) {
    return (
      <EmptyState
        title="Complete setup to begin adaptive preparation."
        body="Quiz uses the subjects and topics from your preparation — it will not ask for a timetable."
        action={
          <Button as={Link} to="/setup">
            Open setup
          </Button>
        }
      />
    )
  }

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Practice"
        title="Study → quiz → evaluate → replan"
        description="Eduvance already knows your subjects. A quiz writes evidence into the same preparation state."
      />
      <div className="mb-8">
        <AdaptiveLoop compact />
      </div>

      {data.isDemo ? (
        <div className="mb-10 rounded-xl border border-accent/20 bg-gradient-to-br from-accent/[0.12] via-surface to-surface px-6 py-6">
          <p className="text-[11px] uppercase tracking-wider text-accent-2">Demo quiz</p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            {bank.subject} → {bank.topic}
          </h2>
          <p className="mt-2 text-sm text-ink-2">10 questions · sample item bank — separate from your workspace.</p>
          <Button variant="accent" className="mt-5" onClick={startDemo}>
            Start demo quiz
          </Button>
        </div>
      ) : null}

      {!data.isDemo && !data.wantsQuiz ? (
        <AdaptiveInsight>
          You asked for a study plan only. You can still run a self-check on your topics, or{' '}
          <Link to="/setup" className="font-medium text-accent-2 hover:text-accent transition-colors">
            edit preparation
          </Link>{' '}
          to include quizzes.
        </AdaptiveInsight>
      ) : null}

      {!data.isDemo && subjects.length && !topics.length ? (
        <EmptyState
          title="No topics extracted yet."
          body="Upload a syllabus PDF in Edit Preparation and click '🧠 Analyze syllabus with AI' to auto-extract topics. Make sure your AI backend is configured (GROQ_API_KEY on Render)."
          action={
            <Button as={Link} to="/setup" variant="secondary">
              Edit preparation
            </Button>
          }
        />
      ) : null}

      {!data.isDemo && subjects.length && topics.length ? (
        <div className="mt-8 max-w-xl space-y-4">
          <h2 className="font-medium text-ink">Quiz from your preparation</h2>
          <p className="text-sm text-ink-2">No timetable upload. Subjects and topics come from setup.</p>
          <SubjectSelector
            subjects={subjects}
            value={subjectId}
            onChange={(id) => {
              setSubjectId(id)
              const next = topics.find((t) => t.subjectId === id)
              if (next) setTopicId(next.id)
            }}
          />
          <TopicSelector topics={topicOptions} value={topicId} onChange={setTopicId} />
          <div className="flex items-center gap-3">
            <Button className="mt-2" onClick={startCheck} disabled={!selectedTopic}>
              Start quiz
            </Button>
            {selectedTopic && (
              <span className="mt-2 text-xs text-ink-3">
                {hasBankQuestions ? '✅ Real MCQ questions available' : '📝 Self-assessment mode'}
              </span>
            )}
          </div>
        </div>
      ) : null}

      {!data.isDemo && !subjects.length ? (
        <EmptyState
          title="No subjects in this workspace"
          body="Complete preparation once, then every quiz uses that list."
          action={
            <Button as={Link} to="/setup" variant="secondary">
              Edit preparation
            </Button>
          }
        />
      ) : null}
    </div>
  )
}
