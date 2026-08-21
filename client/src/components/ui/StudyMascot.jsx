import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const messages = {
  welcome: [
    "Hi there! I'm Evo! 🎓",
    "Ready to conquer your exams?",
    "Let's make a plan together!",
  ],
  quiz: [
    "You've got this! 💪",
    "Let's see what you know!",
    "Time to show your skills!",
  ],
  correct: [
    "Nice one! 🔥",
    "Exactly right! ⭐",
    "You're on fire!",
  ],
  incorrect: [
    "Almost! Let's learn from it. 📚",
    "Not quite — but now you know!",
    "Don't worry, every mistake helps!",
  ],
  study: [
    "Focus mode activated! 🎯",
    "Let's make these 45 minutes count!",
    "You're doing great! Keep going!",
  ],
  progress: [
    "Look at you growing! 🌱",
    "Your preparation is getting stronger!",
    "Keep that momentum going!",
  ],
  idle: [
    "What should we study next? 🤔",
    "I'm here to help you prepare!",
    "Your next best move awaits!",
  ],
}

export function StudyMascot({ context = 'welcome', compact = false, className = '' }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isWaving, setIsWaving] = useState(true)

  const msgs = messages[context] || messages.idle
  const currentMsg = msgs[msgIndex % msgs.length]

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => prev + 1)
    }, 4000)
    return () => clearInterval(interval)
  }, [msgs.length])

  useEffect(() => {
    const timeout = setTimeout(() => setIsWaving(false), 1200)
    return () => clearTimeout(timeout)
  }, [])

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <MascotFace size={48} isWaving={isWaving} />
        <AnimatePresence mode="wait">
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-ink"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}
          >
            {currentMsg}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={msgIndex}
          initial={{ opacity: 0, scale: 0.9, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative rounded-2xl px-5 py-3 text-sm font-medium text-ink"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}
        >
          {currentMsg}
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2"
               style={{
                 borderLeft: '6px solid transparent',
                 borderRight: '6px solid transparent',
                 borderTop: '8px solid var(--color-surface)',
               }} />
        </motion.div>
      </AnimatePresence>

      {/* Mascot */}
      <MascotFace size={80} isWaving={isWaving} />
    </div>
  )
}

function MascotFace({ size = 64, isWaving = false }) {
  return (
    <motion.div
      className="relative select-none"
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="50" cy="58" rx="32" ry="30" fill="#6366f1" />
        <ellipse cx="50" cy="58" rx="32" ry="30" fill="url(#bodyGrad)" />

        {/* Face area */}
        <ellipse cx="50" cy="50" rx="26" ry="24" fill="#e8eaf0" />

        {/* Eyes */}
        <circle cx="40" cy="47" r="5" fill="#1a1d2e" />
        <circle cx="60" cy="47" r="5" fill="#1a1d2e" />
        <circle cx="42" cy="45" r="1.5" fill="white" />
        <circle cx="62" cy="45" r="1.5" fill="white" />

        {/* Mouth - smile */}
        <path d="M42 56 Q50 63 58 56" stroke="#1a1d2e" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <ellipse cx="33" cy="54" rx="5" ry="3" fill="#f0a0b0" opacity="0.5" />
        <ellipse cx="67" cy="54" rx="5" ry="3" fill="#f0a0b0" opacity="0.5" />

        {/* Graduation cap */}
        <polygon points="50,18 30,28 50,35 70,28" fill="#1a1d2e" />
        <rect x="47" y="28" width="6" height="4" fill="#1a1d2e" />
        <circle cx="50" cy="18" r="3" fill="#eab308" />
        <line x1="50" y1="18" x2="56" y2="14" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="56" cy="14" r="2" fill="#eab308" />

        {/* Waving arm */}
        {isWaving && (
          <motion.g
            animate={{ rotate: [0, 15, -15, 10, 0] }}
            transition={{ duration: 0.8, repeat: 2 }}
            style={{ originX: '75px', originY: '60px' }}
          >
            <ellipse cx="82" cy="50" rx="8" ry="5" fill="#6366f1" />
            <circle cx="88" cy="48" r="4" fill="#e8eaf0" />
          </motion.g>
        )}

        <defs>
          <linearGradient id="bodyGrad" x1="18" y1="28" x2="82" y2="88">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

export function MascotBubble({ message, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium"
      style={{ background: 'var(--color-accent-soft)', color: 'var(--color-accent-2)' }}
    >
      {children && <span>{children}</span>}
      <span>{message}</span>
    </motion.div>
  )
}
