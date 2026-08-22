import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { QuizQuestion } from '../components/domain/QuizQuestion'
import { QuizMentor } from '../components/domain/QuizMentor'
import { getQuizBank, buildTopicQuiz, hasRealQuestions } from '../services/quiz'
import { aiApi } from '../services/aiApi'
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
  const localQuestions = config.kind === 'check' ? checkQuestions : bank.questions.slice(0, config.count || 10)
  const [aiQuestions, setAiQuestions] = useState(null)
  const [aiQuizId, setAiQuizId] = useState(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [aiError, setAiError] = useState(null)
  const [fromMaterial, setFromMaterial] = useState(false)
  const questions = aiQuestions || localQuestions
  const limit = (config.minutes || 15) * 60
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))

  // Try loading AI-generated questions on mount
  useEffect(() => {
    if (config.kind !== 'check' || !config.subject || !config.topic) return
    let cancelled = false
    setLoadingAi(true)
    aiApi.generateQuiz(config.subject, config.topic, difficulty, config.count || 10)
      .then(result => {
        if (cancelled || !result?.questions?.length) {
          setAiError('AI could not generate questions. Using local question bank.')
          return
        }
        setAiQuizId(result.quizId)
        setFromMaterial(result.fromMaterial || false)
        setAiQuestions(result.questions.map((q, i) => ({
          id: q.id || `ai-${i}`,
          prompt: q.prompt,
          options: q.options,
          answer: q.correctAnswer,
          difficulty: q.difficulty || difficulty,
          subject: config.subject,
          topic: config.topic,
        })))
      })
      .catch((err) => {
        setAiError(`AI quiz unavailable: ${err.message || 'Backend may be starting up'}. Using local questions.`)
      })
      .finally(() => setLoadingAi(false))
    return () => { cancelled = true }
  }, [config.subject, config.topic, difficulty])
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
    const resultData = {
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
      aiQuizId,
    }
    sessionStorage.setItem('eduvance.quiz.result', JSON.stringify(resultData))
    // Record study day for streak tracking
    recordStudyDay()
    // If using AI quiz, complete it on backend for mastery tracking + replan
    if (aiQuizId) {
      aiApi.completeQuiz(aiQuizId).catch(() => {
        // Backend evaluation is best-effort — quiz result is already saved locally
      })
    }
    // Small delay to let mentor message show before navigating
    setTimeout(() => navigate('/quiz/result'), 600)
  }

  const mm = String(Math.floor(left / 60)).padStart(2, '0')
  const ss = String(left % 60).padStart(2, '0')

  if (loadingAi && !aiQuestions) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-sm text-ink-2">Generating AI questions for {config.topic}...</p>
        <p className="mt-1 text-xs text-ink-3">Analyzing your study material and performance</p>
      </div>
    )
  }

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
      {/* AI vs Local indicator */}
      {aiQuestions ? (
        <p className="mt-1 flex items-center gap-1 text-[10px] text-accent">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          AI-generated{fromMaterial ? ' from your study material' : ''}
        </p>
      ) : aiError ? (
        <p className="mt-1 text-[10px] text-amber-500">
          ⚠️ {aiError}
        </p>
      ) : null}
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
