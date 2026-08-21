import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { QuizResult } from '../components/domain/QuizResult'
import { QuizMentorCompact } from '../components/domain/QuizMentor'
import { useAppState } from '../context/AppState'

export function QuizResultPage() {
  const { recordQuiz, demoMode } = useAppState()
  const result = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('eduvance.quiz.result') || 'null')
    } catch {
      return null
    }
  }, [])
  const navigate = useNavigate()
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!result || demoMode) return
    const key = `${result.subject}|${result.topic}|${result.score}|${result.correct}|${result.total}`
    if (sessionStorage.getItem('eduvance.quiz.persisted') === key) return
    recordQuiz(result)
    sessionStorage.setItem('eduvance.quiz.persisted', key)
  }, [result, demoMode, recordQuiz])

  if (!result) {
    return (
      <div>
        <PageHeader title="No quiz result yet" description="Start a quiz to generate a performance analysis." />
        <Button as={Link} to="/quiz">
          Go to quiz
        </Button>
      </div>
    )
  }

  function addToPlan() {
    sessionStorage.setItem(
      'eduvance.plan.inject',
      JSON.stringify({
        topic: result.topic,
        minutesDelta: result.score < 70 ? 45 : -15,
        reason: `Score ${result.score}%`,
      }),
    )
    setAdded(true)
    setTimeout(() => navigate('/planner'), 500)
  }

  return (
    <div>
      <PageHeader eyebrow="Quiz performance" title={`${result.subject} → ${result.topic}`} />

      {/* Mentor celebration/encouragement */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuizMentorCompact score={result.score} />
      </motion.div>

      {result.kind === 'demo' ? (
        <p className="mb-4 text-sm text-ink-3">Demo item bank — not produced from an uploaded syllabus.</p>
      ) : (
        <p className="mb-4 text-sm text-ink-3">This result is already in your central preparation state.</p>
      )}
      <QuizResult result={result} onAddToPlan={addToPlan} added={added} />
    </div>
  )
}
