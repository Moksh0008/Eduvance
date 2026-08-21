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

/* ─── Premium Teacher Illustration SVG ─── */
function MentorSVG({ state }) {
  const reduce = useReducedMotion()
  const isHappy = state === 'celebrate'
  const isGentle = state === 'encourage' || state === 'weakScore'

  return (
    <motion.svg
      width="100"
      height="120"
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={reduce ? {} : { y: [0, -3, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* ── Hair back (behind head) ── */}
      <ellipse cx="50" cy="32" rx="22" ry="24" fill="#3d2c1e" />

      {/* ── Hair bun ── */}
      <motion.circle
        cx="50"
        cy="12"
        r="10"
        fill="#3d2c1e"
        animate={isHappy ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.4 }}
      />
      <circle cx="50" cy="12" r="6" fill="#4a3628" opacity="0.5" />

      {/* ── Neck ── */}
      <rect x="45" y="52" width="10" height="10" rx="3" fill="#e8b89d" />

      {/* ── Blazer / body ── */}
      <path
        d="M30 62 Q30 58 38 56 L50 54 L62 56 Q70 58 70 62 L72 95 Q72 100 65 100 L35 100 Q28 100 28 95 Z"
        fill="var(--color-accent)"
        opacity="0.9"
      />
      {/* Blazer lapels */}
      <path d="M42 56 L46 68 L50 60" fill="var(--color-accent-2)" opacity="0.4" />
      <path d="M58 56 L54 68 L50 60" fill="var(--color-accent-2)" opacity="0.4" />
      {/* Blazer buttons */}
      <circle cx="50" cy="72" r="1.5" fill="var(--color-surface)" opacity="0.6" />
      <circle cx="50" cy="80" r="1.5" fill="var(--color-surface)" opacity="0.6" />

      {/* ── Shirt collar ── */}
      <path d="M43 55 L50 62 L57 55" fill="var(--color-surface)" stroke="var(--color-surface)" strokeWidth="0.5" />

      {/* ── Left arm (holding book) ── */}
      <motion.path
        d="M30 64 Q22 70 18 80 Q16 85 20 88"
        stroke="#e8b89d"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hand */}
      <circle cx="20" cy="88" r="4" fill="#e8b89d" />

      {/* ── Book in left hand ── */}
      <motion.g
        animate={isHappy ? { rotate: [0, -8, 0] } : { rotate: 0 }}
        transition={{ duration: 0.5 }}
        style={{ transformOrigin: '18px 82px' }}
      >
        <rect x="8" y="74" width="16" height="12" rx="1.5" fill="#4f46e5" />
        <rect x="9" y="75" width="14" height="10" rx="1" fill="#6366f1" />
        <line x1="16" y1="75" x2="16" y2="85" stroke="#4f46e5" strokeWidth="0.8" />
        {/* Book pages */}
        <line x1="11" y1="78" x2="15" y2="78" stroke="var(--color-surface)" strokeWidth="0.6" opacity="0.6" />
        <line x1="11" y1="80" x2="15" y2="80" stroke="var(--color-surface)" strokeWidth="0.6" opacity="0.6" />
        <line x1="11" y1="82" x2="14" y2="82" stroke="var(--color-surface)" strokeWidth="0.6" opacity="0.6" />
        <line x1="17" y1="78" x2="21" y2="78" stroke="var(--color-surface)" strokeWidth="0.6" opacity="0.6" />
        <line x1="17" y1="80" x2="21" y2="80" stroke="var(--color-surface)" strokeWidth="0.6" opacity="0.6" />
      </motion.g>

      {/* ── Right arm (pointing / celebrating) ── */}
      <motion.path
        d={
          isHappy
            ? 'M70 64 Q78 52 80 40 Q81 36 78 34'
            : 'M70 64 Q76 58 80 52 Q82 48 84 44'
        }
        stroke="#e8b89d"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        animate={
          isHappy
            ? { d: 'M70 64 Q78 52 80 40 Q81 36 78 34' }
            : { d: 'M70 64 Q76 58 80 52 Q82 48 84 44' }
        }
        transition={{ duration: 0.3 }}
      />
      {/* Right hand */}
      <motion.circle
        cx={isHappy ? 78 : 84}
        cy={isHappy ? 34 : 44}
        r="4"
        fill="#e8b89d"
        animate={isHappy ? { cx: 78, cy: 34 } : { cx: 84, cy: 44 }}
        transition={{ duration: 0.3 }}
      />

      {/* ── Pointer stick (when not celebrating) ── */}
      {!isHappy && (
        <motion.line
          x1="84"
          y1="44"
          x2="92"
          y2="28"
          stroke="#4a3628"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}

      {/* ── Head / face ── */}
      <ellipse cx="50" cy="36" rx="18" ry="20" fill="#e8b89d" />

      {/* ── Hair front / bangs ── */}
      <path
        d="M32 30 Q32 18 50 16 Q68 18 68 30 Q65 26 58 24 Q50 22 42 24 Q35 26 32 30"
        fill="#3d2c1e"
      />
      {/* Hair side strands */}
      <path d="M32 30 Q30 36 31 42" stroke="#3d2c1e" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M68 30 Q70 36 69 42" stroke="#3d2c1e" strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* ── Glasses ── */}
      <rect x="34" y="32" width="13" height="10" rx="5" fill="none" stroke="#4a3628" strokeWidth="1.8" />
      <rect x="53" y="32" width="13" height="10" rx="5" fill="none" stroke="#4a3628" strokeWidth="1.8" />
      <line x1="47" y1="37" x2="53" y2="37" stroke="#4a3628" strokeWidth="1.5" />
      {/* Temple arms */}
      <line x1="34" y1="36" x2="31" y2="35" stroke="#4a3628" strokeWidth="1.2" />
      <line x1="66" y1="36" x2="69" y2="35" stroke="#4a3628" strokeWidth="1.2" />

      {/* ── Eyes ── */}
      {isHappy ? (
        /* Happy closed eyes (arcs) */
        <>
          <path d="M37 37 Q40.5 34 44 37" stroke="#3d2c1e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <path d="M56 37 Q59.5 34 63 37" stroke="#3d2c1e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </>
      ) : isGentle ? (
        /* Gentle soft eyes */
        <>
          <ellipse cx="40.5" cy="37" rx="2.2" ry="2.5" fill="#3d2c1e" />
          <ellipse cx="59.5" cy="37" rx="2.2" ry="2.5" fill="#3d2c1e" />
          <circle cx="41.3" cy="36.2" r="0.7" fill="var(--color-surface)" />
          <circle cx="60.3" cy="36.2" r="0.7" fill="var(--color-surface)" />
        </>
      ) : (
        /* Normal bright eyes */
        <>
          <ellipse cx="40.5" cy="37" rx="2.5" ry="3" fill="#3d2c1e" />
          <ellipse cx="59.5" cy="37" rx="2.5" ry="3" fill="#3d2c1e" />
          <circle cx="41.5" cy="36" r="1" fill="var(--color-surface)" />
          <circle cx="60.5" cy="36" r="1" fill="var(--color-surface)" />
          <circle cx="40" cy="38" r="0.4" fill="var(--color-surface)" opacity="0.5" />
          <circle cx="59" cy="38" r="0.4" fill="var(--color-surface)" opacity="0.5" />
        </>
      )}

      {/* ── Eyebrows ── */}
      {isHappy ? (
        <>
          <path d="M36 32 Q40.5 29 45 32" stroke="#3d2c1e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M55 32 Q59.5 29 64 32" stroke="#3d2c1e" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="37" y1="31" x2="44" y2="31.5" stroke="#3d2c1e" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="56" y1="31.5" x2="63" y2="31" stroke="#3d2c1e" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      {/* ── Nose ── */}
      <path d="M49 39 Q50 41 51 39" stroke="#d4a088" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* ── Mouth ── */}
      {isHappy ? (
        <path d="M43 44 Q50 50 57 44" stroke="#c47a6a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      ) : isGentle ? (
        <path d="M45 45 Q50 48 55 45" stroke="#c47a6a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M46 45 Q50 47 54 45" stroke="#c47a6a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      )}

      {/* ── Cheek blush ── */}
      <ellipse cx="35" cy="42" rx="3.5" ry="2" fill="#e8a090" opacity="0.3" />
      <ellipse cx="65" cy="42" rx="3.5" ry="2" fill="#e8a090" opacity="0.3" />

      {/* ── Celebration sparkles ── */}
      {isHappy && (
        <>
          {[
            { x: 12, y: 18, delay: 0 },
            { x: 88, y: 14, delay: 0.15 },
            { x: 8, y: 48, delay: 0.3 },
            { x: 92, y: 52, delay: 0.45 },
            { x: 50, y: 4, delay: 0.2 },
          ].map((p, i) => (
            <motion.g key={i}>
              <motion.path
                d={`M${p.x} ${p.y - 3} L${p.x + 1} ${p.y} L${p.x} ${p.y + 3} L${p.x - 1} ${p.y} Z`}
                fill="var(--color-accent)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1.3, 0] }}
                transition={{ duration: 0.7, delay: p.delay, repeat: Infinity, repeatDelay: 1.5 }}
              />
            </motion.g>
          ))}
        </>
      )}

      {/* ── Pencil behind ear (subtle detail) ── */}
      <line x1="66" y1="28" x2="74" y2="18" stroke="#e8b84c" strokeWidth="2" strokeLinecap="round" />
      <polygon points="74,18 76,15 73,16" fill="#e8b84c" />
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
      <div className="max-w-[220px] pb-2">
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
      <div className="max-w-[260px] pb-2">
        <SpeechBubble visible>{msg}</SpeechBubble>
      </div>
    </motion.div>
  )
}
