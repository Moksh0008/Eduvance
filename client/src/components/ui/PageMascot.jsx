import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const pageMessages = {
  '/dashboard': [
    "Your next move is ready! 🎯",
    "Exam countdown is on! ⏰",
    "Let's conquer today! 💪",
  ],
  '/syllabus': [
    "Your syllabus is your treasure map! 🗺",
    "Every topic is a step closer! 📚",
    "Knowledge is power! ⚡",
  ],
  '/subjects': [
    "Which subject needs love today? 🤔",
    "Each subject has its own story! 📖",
    "Master one, unlock the next! 🔑",
  ],
  '/planner': [
    "Your plan is smart! Trust it! 🗓",
    "Time flies — let's use it wisely! ⏱",
    "Every minute counts! 🎯",
  ],
  '/revision': [
    "Repetition is the mother of learning! 🔄",
    "Review today, remember tomorrow! 💡",
    "Your brain thanks you! 🧠",
  ],
  '/quiz': [
    "Time to test your knowledge! 🎯",
    "You've got this! 💪",
    "Show what you know! ⭐",
  ],
  '/progress': [
    "Look how far you've come! 🌟",
    "Progress is progress! 📈",
    "Every step matters! 🚀",
  ],
  '/analytics': [
    "Data tells the truth! 📊",
    "Your patterns are fascinating! 🧐",
    "Insight leads to improvement! 💡",
  ],
  '/insights': [
    "Let's discover something new! 🔍",
    "Your data has stories! 📖",
    "Smart students review insights! 🧠",
  ],
  '/question-papers': [
    "Practice makes permanent! 📝",
    "Past papers = future success! 🏆",
    "Try a timed session! ⏱",
  ],
  '/profile': [
    "Looking good! 🎓",
    "Your profile, your identity! 🌟",
    "Keep your info updated! ✏️",
  ],
  '/settings': [
    "Customize your experience! ⚙️",
    "Make Eduvance yours! 🎨",
    "Small changes, big impact! ✨",
  ],
  '/study-session': [
    "Focus mode activated! 🎯",
    "Deep work starts now! 🧘",
    "You're in the zone! 🔥",
  ],
}

const defaultMessages = [
  "I'm here to help! 🎓",
  "Let's make today count! 💪",
  "Your study buddy is ready! 📚",
]

export function PageMascot({ pagePath }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  
  const msgs = pageMessages[pagePath] || defaultMessages
  const currentMsg = msgs[msgIndex % msgs.length]

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => prev + 1)
    }, 5000)
    return () => clearInterval(interval)
  }, [msgs.length])

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex items-end gap-2 sm:bottom-8 sm:right-8"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.8 }}
    >
      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key={msgIndex}
            initial={{ opacity: 0, scale: 0.9, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="max-w-[200px] rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-medium leading-relaxed text-ink shadow-lg"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}
          >
            {currentMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini Evo */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -3, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
        aria-label="Toggle Evo mascot"
      >
        <svg width="48" height="56" viewBox="0 0 100 116" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <ellipse cx="50" cy="68" rx="28" ry="26" fill="#6366f1" />
          <ellipse cx="50" cy="68" rx="28" ry="26" fill="url(#miniBodyGrad)" />
          
          {/* Face */}
          <ellipse cx="50" cy="58" rx="22" ry="20" fill="#e8eaf0" />
          
          {/* Eyes */}
          <circle cx="42" cy="55" r="3.5" fill="#1a1d2e" />
          <circle cx="58" cy="55" r="3.5" fill="#1a1d2e" />
          <circle cx="43.5" cy="53.5" r="1.2" fill="white" />
          <circle cx="59.5" cy="53.5" r="1.2" fill="white" />
          
          {/* Smile */}
          <path d="M43 64 Q50 70 57 64" stroke="#1a1d2e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          
          {/* Blush */}
          <ellipse cx="36" cy="62" rx="4" ry="2.5" fill="#f0a0b0" opacity="0.5" />
          <ellipse cx="64" cy="62" rx="4" ry="2.5" fill="#f0a0b0" opacity="0.5" />
          
          {/* Graduation cap */}
          <polygon points="50,22 32,30 50,36 68,30" fill="#1a1d2e" />
          <rect x="48" y="30" width="4" height="3" fill="#1a1d2e" />
          <circle cx="50" cy="22" r="2.5" fill="#eab308" />
          
          {/* Feet */}
          <ellipse cx="40" cy="92" rx="10" ry="5" fill="#4f46e5" />
          <ellipse cx="60" cy="92" rx="10" ry="5" fill="#4f46e5" />
          
          <defs>
            <linearGradient id="miniBodyGrad" x1="22" y1="42" x2="78" y2="94">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
          </defs>
        </svg>

        {/* Notification dot */}
        {!isExpanded && (
          <motion.div
            className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-accent"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}
