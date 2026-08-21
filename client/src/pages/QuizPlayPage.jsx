import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { getQuizBank } from '../services/catalog'

export function QuizPlayPage() {
  const bank = getQuizBank()
  const config = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('eduvance.quiz.config') || '{}')
    } catch {
      return {}
    }
  }, [])
  const questions = bank.questions.slice(0, config.count || 10)
  const limit = (config.minutes || 15) * 60
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [left, setLeft] = useState(limit)
  const submitted = useRef(false)
  const navigate = useNavigate()
  const q = questions[index]
  const progress = ((index + 1) / questions.length) * 100

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (left === 0) submit()
  }, [left])

  function submit() {
    if (submitted.current) return
    submitted.current = true
    const correct = questions.reduce((n, item, i) => n + (answers[i] === item.answer ? 1 : 0), 0)
    const missed = questions.filter((item, i) => answers[i] !== item.answer).map((item) => item.id)
    sessionStorage.setItem(
      'eduvance.quiz.result',
      JSON.stringify({
        correct,
        total: questions.length,
        score: Math.round((correct / questions.length) * 100),
        leftover: left,
        missed,
        topic: config.topic || bank.topic,
        subject: config.subject || bank.subject,
      }),
    )
    navigate('/quiz/result')
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-2">
          {config.subject || bank.subject} → {config.topic || bank.topic}
        </p>
        <p className="tabular text-sm font-semibold" aria-live="polite">
          {mm}:{ss}
        </p>
      </div>
      <p className="text-xs text-ink-3">
        Question {index + 1} / {questions.length}
      </p>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-canvas-2">
        <motion.div className="h-full bg-ink" animate={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={q.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.22 }}
          className="mt-8"
        >
          <h1 className="font-serif text-3xl text-ink">{q.prompt}</h1>
          <ul className="mt-6 space-y-2">
            {q.options.map((opt, i) => (
              <li key={opt}>
                <button
                  type="button"
                  onClick={() => setAnswers((a) => a.map((x, idx) => (idx === index ? i : x)))}
                  className={`w-full border px-4 py-3 text-left text-sm ${
                    answers[index] === i ? 'border-ink bg-canvas-2' : 'border-line hover:border-ink'
                  }`}
                >
                  {opt}
                </button>
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          Previous
        </Button>
        {index < questions.length - 1 ? (
          <Button onClick={() => setIndex((i) => i + 1)}>Next</Button>
        ) : (
          <Button variant="accent" onClick={submit}>
            Submit quiz
          </Button>
        )}
      </div>
    </div>
  )
}
