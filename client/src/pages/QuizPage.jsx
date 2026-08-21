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
import { getQuizBank } from '../services/quiz'
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
    sessionStorage.setItem(
      'eduvance.quiz.config',
      JSON.stringify({
        kind: 'check',
        subject: topic.subjectName || topic.subject,
        subjectId: topic.subjectId,
        topic: topic.name,
        topicId: topic.id,
        count: 10,
        minutes: 15,
      }),
    )
    navigate('/quiz/play')
  }

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
        <div className="mb-10 border border-ink bg-ink px-6 py-6 text-canvas">
          <p className="text-[11px] uppercase tracking-wider text-canvas/50">Demo quiz</p>
          <h2 className="mt-2 font-serif text-3xl">
            {bank.subject} → {bank.topic}
          </h2>
          <p className="mt-2 text-sm text-canvas/70">10 questions · sample item bank — separate from your workspace.</p>
          <Button variant="accent" className="mt-5" onClick={startDemo}>
            Start demo quiz
          </Button>
        </div>
      ) : null}

      {!data.isDemo && !data.wantsQuiz ? (
        <AdaptiveInsight>
          You asked for a study plan only. You can still run a self-check on your topics, or{' '}
          <Link to="/setup" className="font-medium text-accent hover:underline">
            edit preparation
          </Link>{' '}
          to include quizzes.
        </AdaptiveInsight>
      ) : null}

      {!data.isDemo && subjects.length && !topics.length ? (
        <EmptyState
          title="Add syllabus topics to generate topic-level planning."
          body="Enter topics in Edit Preparation. Uploaded PDFs are stored, not parsed yet."
          action={
            <Button as={Link} to="/setup" variant="secondary">
              Edit preparation
            </Button>
          }
        />
      ) : null}

      {!data.isDemo && subjects.length && topics.length ? (
        <div className="mt-8 max-w-xl space-y-4">
          <h2 className="font-medium">Quiz from your preparation</h2>
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
          <Button className="mt-2" onClick={startCheck} disabled={!selectedTopic}>
            Start quiz
          </Button>
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
