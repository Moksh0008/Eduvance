import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { QuizQuestion } from '../components/domain/QuizQuestion'
import { QuizMentor } from '../components/domain/QuizMentor'
import { getQuizBank, buildTopicQuiz, hasRealQuestions } from '../services/quiz'
import { useAppData } from '../hooks/useAppData'
import { recordStudyDay } from '../utils/streaks'
import { quizSlide } from '../animations/variants'

export function QuizPlayPage() {
  const bank = getQuizBank()
  const data = useAppData()
  const reduce = useReducedMotion()
  const config = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('eduvance.quiz.config') || '{}')
    } catch {
      return {}
    }
  }, [])
  // Use adaptive difficulty based on past performance
  const difficulty = useMemo(() => {
    if (!data || config.kind !== 'check') return 'medium'
    const history = data.quizResults || []
    const topicQuizzes = history.filter(q => q.subject === config.subject && q.topic === config.topic)
    if (topicQuizzes.length === 0) return 'easy'
    const lastScore = topicQuizzes[topicQuizzes.length - 1].score
    if (lastScore >= 80) return 'hard'
    if (lastScore < 50) return 'easy'
    return 'medium'
  }, [data, config])
  const checkQuestions = buildTopicQuiz(config.topic, config.count || 10, config.subject, difficulty)
  const questions = config.kind === 'check' ? checkQuestions : bank.questions.slice(0, config.count || 10)
  const limit = (config.minutes || 15) * 60
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [left, setLeft] = useState(limit)
  const [mentorEvent, setMentorEvent] = useState({ type: 'enter' })
  const q = questions[index]
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0
  const submitted = useRef(false)
  const navigate = useNavigate()

  useEffect(() => {
    const id = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (left === 0) submit()
  }, [left])

  // Trigger final stretch message when 2 questions remain
  useEffect(() => {
    if (index === questions.length - 3 && questions.length > 4) {
      setMentorEvent({ type: 'finalStretch' })
    }
  }, [index, questions.length])

  const handleAnswer = useCallback(
    (selected) => {
      const prev = answers[index]
      setAnswers((a) => a.map((x, idx) => (idx === index ? selected : x)))

      // Only trigger mentor reaction on first answer (not changing answer)
      if (prev === null && selected !== null) {
        const correct = selected === q.answer
        setMentorEvent({
          type: correct ? 'correct' : 'incorrect',
          timestamp: Date.now(),
        })
      }
    },
    [answers, index, q],
  )

  function submit() {
    if (submitted.current) return
    submitted.current = true
    setMentorEvent({ type: 'submit' })
    const correct = questions.reduce((n, item, i) => n + (answers[i] === item.answer ? 1 : 0), 0)
    // Calculate per-question details for analytics
    const questionDetails = questions.map((item, i) => ({
      id: item.id,
      prompt: item.prompt,
      correct: answers[i] === item.answer,
      userAnswer: answers[i],
      correctAnswer: item.answer,
      difficulty: item.difficulty || difficulty,
      topic: item.topic || config.topic,
      subject: item.subject || config.subject,
    }))
    const difficultyScores = {}
    questionDetails.forEach(qd => {
      const d = qd.difficulty || 'unknown'
      if (!difficultyScores[d]) difficultyScores[d] = { correct: 0, total: 0 }
      difficultyScores[d].total++
      if (qd.correct) difficultyScores[d].correct++
    })
    sessionStorage.setItem(
      'eduvance.quiz.result',
      JSON.stringify({
        correct,
        total: questions.length,
        score: Math.round((correct / questions.length) * 100),
        kind: config.kind || 'demo',
        leftover: left,
        difficulty,
        missed: questions.filter((item, i) => answers[i] !== item.answer).map((item) => item.id),
        questionDetails,
        difficultyScores,
        topic: config.topic || bank.topic,
        topicId: config.topicId || null,
        subject: config.subject || bank.subject,
        subjectId: config.subjectId || null,
      }),
    )
    // Record study day for streak tracking
    recordStudyDay()
    // Small delay to let mentor message show before navigating
    setTimeout(() => navigate('/quiz/result'), 600)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  return (
    <div>
      {/* Mentor area */}
      <div className="mb-6">
        <QuizMentor event={mentorEvent} />
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-2">
          {config.subject || bank.subject} → {config.topic || bank.topic}
        </p>
        <div className="flex items-center gap-2 rounded-lg bg-surface px-3 py-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <p className="tabular text-sm font-semibold text-ink" aria-live="polite">
            {mm}:{ss}
          </p>
        </div>
      </div>
      <p className="text-xs text-ink-3">
        Question {index + 1} / {questions.length}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${progress}%` }} />
      </div>

      <AnimatePresence mode="wait">
        {q ? (
          <motion.div
            key={q.id}
            {...(reduce ? { initial: false } : quizSlide)}
            className="mt-6"
          >
            <QuizQuestion
              question={q}
              selected={answers[index]}
              onSelect={handleAnswer}
            />
          </motion.div>
        ) : null}
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
