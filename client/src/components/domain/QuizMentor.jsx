import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const MESSAGES = {
  enter: [
    "Ready? Let's see what you know!",
    "You've got this. Let's begin!",
    "Time to show what you've learned.",
  ],
  correct: [
    "Nice one! 🔥",
    "Exactly right!",
    "You nailed it!",
    "Perfect — keep going!",
    "That's the one!",
  ],
  incorrect: [
    "Not quite — let's learn from it.",
    "That's okay. This is what practice is for.",
    "Almost! Let's understand why.",
    "No worries — now you know.",
  ],
  finalStretch: [
    "Last few questions — stay focused!",
    "Almost there — finish strong!",
    "Final push!",
  ],
  submit: [
    "Great work! Let's see the results.",
    "Challenge complete!",
    "All done — let's review!",
  ],
  celebrate: [
    "Fantastic score! You're on fire! 🎉",
    "Excellent work! Your preparation is paying off!",
    "That's a strong result — well done!",
  ],
  encourage: [
    "Good effort! Every quiz makes you stronger.",
    "Keep going — improvement comes with practice.",
    "Solid attempt. Let's build on this!",
  ],
  weakScore: [
    "That's okay — now we know what to focus on.",
    "This is exactly why we practice. Let's improve!",
    "Every mistake is a learning opportunity.",
  ],
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function getMentorState(score) {
  if (score >= 80) return 'celebrate'
  if (score >= 60) return 'encourage'
  return 'weakScore'
}

function MentorSVG({ state }) {
  const reduce = useReducedMotion()
  const eyes = state === 'celebrate' ? 'happy' : state === 'encourage' || state === 'weakScore' ? 'gentle' : 'normal'
  const mouth = state === 'celebrate' ? 'smile' : state === 'encourage' ? 'smile-small' : state === 'weakScore' ? 'neutral' : 'smile'

  return (
    <motion.svg
      width="80"
      height="80"
      viewBox="0 0 80 80"
      fill="none"
      animate={reduce ? {} : {
        y: [0, -3, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Body */}
      <motion.ellipse
        cx="40"
        cy="65"
        rx="18"
        ry="12"
        fill="var(--color-accent-soft)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
      />

      {/* Head */}
      <motion.circle
        cx="40"
        cy="32"
        r="22"
        fill="var(--color-surface)"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        animate={state === 'celebrate' ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />

      {/* Glasses frame */}
      <circle cx="32" cy="30" r="7" fill="none" stroke="var(--color-accent-2)" strokeWidth="1.5" />
      <circle cx="48" cy="30" r="7" fill="none" stroke="var(--color-accent-2)" strokeWidth="1.5" />
      <line x1="39" y1="30" x2="41" y2="30" stroke="var(--color-accent-2)" strokeWidth="1.5" />

      {/* Eyes */}
      {eyes === 'happy' ? (
        <>
          <path d="M29 29 Q32 26 35 29" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M45 29 Q48 26 51 29" stroke="var(--color-ink)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </>
      ) : eyes === 'gentle' ? (
        <>
          <circle cx="32" cy="30" r="2" fill="var(--color-ink)" />
          <circle cx="48" cy="30" r="2" fill="var(--color-ink)" />
        </>
      ) : (
        <>
          <circle cx="32" cy="30" r="2.5" fill="var(--color-ink)" />
          <circle cx="48" cy="30" r="2.5" fill="var(--color-ink)" />
          {/* Sparkle in right eye */}
          <circle cx="49" cy="29" r="0.8" fill="var(--color-surface)" />
        </>
      )}

      {/* Mouth */}
      {mouth === 'smile' ? (
        <path d="M35 38 Q40 43 45 38" stroke="var(--color-accent-2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : mouth === 'smile-small' ? (
        <path d="M36 39 Q40 42 44 39" stroke="var(--color-accent-2)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <line x1="36" y1="40" x2="44" y2="40" stroke="var(--color-accent-2)" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Arms */}
      <motion.path
        d="M22 62 Q16 55 18 48"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        animate={state === 'celebrate' ? { d: 'M22 62 Q12 48 14 42' } : { d: 'M22 62 Q16 55 18 48' }}
        transition={{ duration: 0.3 }}
      />
      <motion.path
        d="M58 62 Q64 55 62 48"
        stroke="var(--color-accent)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        animate={state === 'celebrate' ? { d: 'M58 62 Q68 48 66 42' } : { d: 'M58 62 Q64 55 62 48' }}
        transition={{ duration: 0.3 }}
      />

      {/* Celebration particles */}
      {state === 'celebrate' && (
        <>
          {[0, 1, 2, 3, 4].map((i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
            const x = 40 + Math.cos(angle) * 32
            const y = 18 + Math.sin(angle) * 28
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill="var(--color-accent)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
                transition={{
                  duration: 0.8,
                  delay: 0.1 * i,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                }}
              />
            )
          })}
        </>
      )}
    </motion.svg>
  )
}

function SpeechBubble({ children, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative rounded-xl border border-card-border bg-card px-4 py-2.5 text-sm text-ink shadow-lg"
        >
          <div className="absolute -bottom-1.5 left-8 h-3 w-3 rotate-45 border-b border-r border-card-border bg-card" />
          <p className="relative">{children}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function QuizMentor({ event, score }) {
  const reduce = useReducedMotion()
  const [message, setMessage] = useState(() => pickRandom(MESSAGES.enter))
  const [state, setState] = useState('enter')
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!event) return

    let msg = ''
    let newState = 'normal'

    switch (event.type) {
      case 'correct':
        msg = pickRandom(MESSAGES.correct)
        newState = 'celebrate'
        break
      case 'incorrect':
        msg = pickRandom(MESSAGES.incorrect)
        newState = 'encourage'
        break
      case 'finalStretch':
        msg = pickRandom(MESSAGES.finalStretch)
        newState = 'normal'
        break
      case 'submit':
        msg = pickRandom(MESSAGES.submit)
        newState = 'excited'
        break
      case 'result': {
        const s = getMentorState(event.score)
        msg = pickRandom(MESSAGES[s])
        newState = s
        break
      }
      default:
        return
    }

    setMessage(msg)
    setState(newState)
    setVisible(true)

    const timer = setTimeout(() => {
      if (event.type !== 'result') {
        setVisible(false)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [event])

  return (
    <motion.div
      className="flex items-end gap-3"
      initial={reduce ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.3 }}
    >
      <MentorSVG state={state} />
      <div className="max-w-[220px]">
        <SpeechBubble visible={visible}>{message}</SpeechBubble>
      </div>
    </motion.div>
  )
}

export function QuizMentorCompact({ score }) {
  const state = score >= 80 ? 'celebrate' : score >= 60 ? 'encourage' : 'weakScore'
  const msg = score >= 80
    ? pickRandom(MESSAGES.celebrate)
    : score >= 60
      ? pickRandom(MESSAGES.encourage)
      : pickRandom(MESSAGES.weakScore)

  return (
    <motion.div
      className="flex items-end gap-3"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.5 }}
    >
      <MentorSVG state={state} />
      <div className="max-w-[260px]">
        <SpeechBubble visible>{msg}</SpeechBubble>
      </div>
    </motion.div>
  )
}
