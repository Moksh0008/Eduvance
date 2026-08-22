import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppData } from '../../hooks/useAppData'
import { getStreak } from '../../utils/streaks'

/* ═══════════════════════════════════════════════════
   OCTO — Curious mind, Happy learner
   Purple octopus mascot with graduation cap & glasses
   ═══════════════════════════════════════════════════ */

// Color palette from the character sheet
const C = {
  body: '#6D4CD8',
  bodyLight: '#9B72FF',
  bodyDark: '#5A3DB8',
  head: '#9B72FF',
  eye: '#34495E',
  eyeWhite: '#F7F9FC',
  cap: '#2ECC71',
  capDark: '#1a8a4a',
  bow: '#FFD164',
  cheek: '#FFB6B9',
  cheekLight: '#FFD4D6',
  highlight: '#FF8A3D',
  beaker: '#00B4DB',
  book: '#FF8A3D',
  star: '#FFD164',
}

// ── Contextual messages with personality ──
const octoMessages = {
  welcome: [
    "Hi! I'm Octo! 🐙 Let's learn together!",
    "Curious mind, happy learner! That's you!",
    "Ready to explore something awesome? 🌟",
    "Welcome back! I missed you! 💜",
  ],
  dashboard: [
    "Your next move is waiting! 🎯",
    "Exam countdown is ON! Let's focus! ⏰",
    "I crunched your numbers — here's what matters! 📊",
    "Don't procrastinate! I'm watching! 👀",
  ],
  syllabus: [
    "Your syllabus is a treasure map! 🗺️",
    "Every topic you add makes me smarter! 🧠",
    "Knowledge is an ocean — let's dive in! 🌊",
    "Wow, that's a lot of topics! Let's prioritize! 📋",
  ],
  subjects: [
    "Which subject needs some love today? 💜",
    "I see some subjects hiding from you! 🫣",
    "Every subject is a new adventure! 🚀",
    "Pro tip: start with what scares you most! 💪",
  ],
  planner: [
    "Your plan is ready! I'm so proud! 🗓️",
    "Time flies when you're learning! ⏱️",
    "I rearranged your schedule — trust me! 🧠",
    "Study breaks are important too! Even I take them! 😴",
  ],
  quiz: [
    "Time to test that brain! 🧠✨",
    "Show me what you've got! 💪",
    "No peeking at notes! I'm watching! 👀",
    "Remember: wrong answers teach you more! 📚",
  ],
  correct: [
    "Nailed it! 🎉 You're brilliant!",
    "See? You know more than you think! 🌟",
    "That's the spirit! Keep going! 🚀",
    "Correct! My tentacles are doing a happy dance! 🐙💃",
  ],
  incorrect: [
    "Oops! But hey, now you know! 📚",
    "Not quite! But mistakes make us stronger! 💪",
    "Close! Let's learn from this one! 🤔",
    "Don't worry — even I forget things sometimes! 🐙",
  ],
  progress: [
    "Look at you GROW! I'm so proud! 🌱",
    "Your preparation graph is going UP! 📈",
    "Every session makes you stronger! 💜",
    "Progress is progress — even small steps count! ✨",
  ],
  analytics: [
    "Ooh, data! My favorite! 📊",
    "Your patterns are fascinating! 🧐",
    "I see some weak spots — let's fix them! 🔧",
    "Numbers don't lie! Let's improve! 📈",
  ],
  study: [
    "Focus mode activated! Deep work time! 🧘",
    "45 minutes of pure learning! Let's go! ⏱️",
    "You're in the zone! I believe in you! 🔥",
    "No distractions! Just you and the knowledge! 📖",
  ],
  insights: [
    "I found something interesting in your data! 🔍",
    "Smart students review their insights! 🧠",
    "Your performance tells a story! 📖",
    "Let's discover what your data says! 💡",
  ],
  revision: [
    "Repetition is the mother of learning! 🔄",
    "Review today, ace tomorrow! 🏆",
    "Your brain loves revisiting old topics! 🧠",
    "Spaced repetition is your superpower! ⚡",
  ],
  profile: [
    "Looking good! 🎓",
    "Your avatar says a lot about you! 🐙",
    "Keep your profile updated! ✏️",
  ],
  settings: [
    "Make Eduvance yours! ⚙️",
    "Customize everything! I don't mind! 🐙",
  ],
  'study-session': [
    "Deep work starts NOW! 🎯",
    "Timer's running! Stay focused! ⏱️",
    "You're in the zone! Don't break it! 🔥",
  ],
  'question-papers': [
    "Past papers = future success! 🏆",
    "Try a timed session — I dare you! 😏",
    "Practice makes permanent! 📝",
  ],
  idle: [
    "What should we study next? 🤔",
    "I'm bored! Let's learn something! 🐙",
    "Psst... your exam is getting closer! 👀",
    "Did you know octopuses have 3 hearts? ❤️ Just kidding — study time!",
    "I have 8 arms but I still need YOUR help to study! 💜",
    "Fun fact: I can solve a Rubik's cube in 2 moves... with 8 arms! 🧩",
    "Why did the student bring a ladder to class? Because they wanted to reach their goals! 😄",
    "What's an octopus's favorite class? Octo-nomics! 📚 ...ok that was bad 😅",
    "Remember: every expert was once a beginner! 🌟",
    "I'm not just cute — I'm also smart! Let me help you! 🧠",
  ],
  examNear: [
    "⚠️ Your exam is getting close! Let's prioritize! ⏰",
    "Exam alert! Time to focus on weak topics! 🎯",
    "Less than 2 weeks! Let's make every day count! 💪",
    "Exam crunch time! I believe in you! 🐙💜",
  ],
  lowProgress: [
    "Hey... we need to talk about your progress 😬",
    "Your preparation needs attention! Let's fix it! 🔧",
    "Don't panic! We still have time! Let's plan! 📋",
    "I'm worried about your readiness! Let's study! 📚",
  ],
  highProgress: [
    "WOW! You're doing amazing! 🌟🎉",
    "Your preparation score is incredible! 📈",
    "Keep this up and you'll ACE the exam! 🏆",
    "I'm so proud of you! You're crushing it! 💜",
  ],
  streak: [
    "🔥 Your streak is INCREDIBLE! Keep it going!",
    "🔥 I love seeing those fire emojis! You're on a roll!",
    "🔥 Streak power! You're building an unstoppable habit!",
    "🔥 That streak makes me so happy! Don't stop now!",
  ],
}

// ── Expression configs ──
const EXPRESSIONS = {
  happy: { eyeType: 'normal', mouthType: 'smile', blush: 0.5, brows: 'normal' },
  excited: { eyeType: 'sparkle', mouthType: 'wide', blush: 0.7, brows: 'raised' },
  thinking: { eyeType: 'lookUp', mouthType: 'hmm', blush: 0.3, brows: 'furrowed' },
  surprised: { eyeType: 'wide', mouthType: 'oh', blush: 0.6, brows: 'raised' },
  curious: { eyeType: 'lookSide', mouthType: 'smile', blush: 0.4, brows: 'raised' },
  sleepy: { eyeType: 'closed', mouthType: 'yawn', blush: 0.3, brows: 'normal' },
}

function OctoSVG({ expression = 'happy', size = 80, enable3D = true }) {
  const expr = EXPRESSIONS[expression] || EXPRESSIONS.happy
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseMove(e) {
    if (!enable3D) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -15, y: x * 15 })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <div
      style={{
        perspective: '600px',
        perspectiveOrigin: '50% 50%',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
    <div style={{
      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.08)' : 'scale(1)'}`,
      transformStyle: 'preserve-3d',
      transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      filter: isHovered ? `drop-shadow(0 ${8 + tilt.x}px ${16 + Math.abs(tilt.y)}px rgba(109,76,216,0.35))` : 'drop-shadow(0 4px 8px rgba(109,76,216,0.2))',
    }}>
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
      {/* Tentacles */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
        const angle = (i * 45 - 90) * Math.PI / 180
        const baseX = 60 + Math.cos(angle) * 30
        const baseY = 78 + Math.sin(angle) * 15
        const tipX = 60 + Math.cos(angle) * 42
        const tipY = 95 + Math.sin(angle) * 20
        const midX = 60 + Math.cos(angle) * 36
        const midY = 88 + Math.sin(angle) * 22
        return (
          <motion.path key={i}
            d={`M${baseX} ${baseY} Q${midX} ${midY} ${tipX} ${tipY}`}
            stroke={C.body} strokeWidth="6" strokeLinecap="round" fill="none"
            animate={{ d: [`M${baseX} ${baseY} Q${midX} ${midY} ${tipX} ${tipY}`,
                           `M${baseX} ${baseY} Q${midX + (i % 2 ? 3 : -3)} ${midY + 2} ${tipX + (i % 2 ? 4 : -4)} ${tipY + 3}`,
                           `M${baseX} ${baseY} Q${midX} ${midY} ${tipX} ${tipY}`] }}
            transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}

      {/* Suction cups on tentacles */}
      {[0, 2, 4, 6].map(i => {
        const angle = (i * 45 - 90) * Math.PI / 180
        const x = 60 + Math.cos(angle) * 36
        const y = 90 + Math.sin(angle) * 18
        return <circle key={`s${i}`} cx={x} cy={y} r="2" fill={C.bodyLight} opacity="0.5" />
      })}

      {/* Body — base layer */}
      <ellipse cx="60" cy="68" rx="32" ry="28" fill={C.body} />
      <ellipse cx="60" cy="65" rx="30" ry="26" fill={C.bodyLight} />

      {/* Face area — raised layer */}
      <g style={{ transform: 'translateZ(4px)' }}>
      <ellipse cx="60" cy="58" rx="24" ry="22" fill={C.eyeWhite} opacity="0.95" />

      {/* Glasses */}
      <rect x="36" y="48" width="18" height="14" rx="4" fill="none" stroke={C.eye} strokeWidth="2" opacity="0.6" />
      <rect x="66" y="48" width="18" height="14" rx="4" fill="none" stroke={C.eye} strokeWidth="2" opacity="0.6" />
      <line x1="54" y1="55" x2="66" y2="55" stroke={C.eye} strokeWidth="1.5" opacity="0.5" />
      <line x1="36" y1="55" x2="32" y2="52" stroke={C.eye} strokeWidth="1.5" opacity="0.5" />
      <line x1="84" y1="55" x2="88" y2="52" stroke={C.eye} strokeWidth="1.5" opacity="0.5" />

      {/* Eyes */}
      {expr.eyeType === 'closed' ? (
        <>
          <path d="M42 55 Q46 58 50 55" stroke={C.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M70 55 Q74 58 78 55" stroke={C.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : expr.eyeType === 'wide' ? (
        <>
          <circle cx="45" cy="55" r="5" fill={C.eye} />
          <circle cx="75" cy="55" r="5" fill={C.eye} />
          <circle cx="46.5" cy="53.5" r="2" fill="white" />
          <circle cx="76.5" cy="53.5" r="2" fill="white" />
        </>
      ) : expr.eyeType === 'sparkle' ? (
        <>
          <circle cx="45" cy="54" r="5" fill={C.eye} />
          <circle cx="75" cy="54" r="5" fill={C.eye} />
          <circle cx="47" cy="52" r="2" fill="white" />
          <circle cx="77" cy="52" r="2" fill="white" />
          <circle cx="43" cy="56" r="1" fill="white" opacity="0.6" />
          <circle cx="73" cy="56" r="1" fill="white" opacity="0.6" />
          {/* Star sparkles */}
          <motion.text x="38" y="46" fontSize="6" fill={C.star}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}>✦</motion.text>
          <motion.text x="78" y="46" fontSize="6" fill={C.star}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>✦</motion.text>
        </>
      ) : expr.eyeType === 'lookUp' ? (
        <>
          <circle cx="45" cy="53" r="5" fill={C.eyeWhite} />
          <circle cx="75" cy="53" r="5" fill={C.eyeWhite} />
          <circle cx="45" cy="51" r="3" fill={C.eye} />
          <circle cx="75" cy="51" r="3" fill={C.eye} />
          <circle cx="46" cy="50" r="1" fill="white" />
          <circle cx="76" cy="50" r="1" fill="white" />
        </>
      ) : expr.eyeType === 'lookSide' ? (
        <>
          <circle cx="45" cy="55" r="5" fill={C.eyeWhite} />
          <circle cx="75" cy="55" r="5" fill={C.eyeWhite} />
          <circle cx="43" cy="55" r="3" fill={C.eye} />
          <circle cx="73" cy="55" r="3" fill={C.eye} />
          <circle cx="42" cy="54" r="1" fill="white" />
          <circle cx="72" cy="54" r="1" fill="white" />
        </>
      ) : (
        <>
          <circle cx="45" cy="55" r="5" fill={C.eye} />
          <circle cx="75" cy="55" r="5" fill={C.eye} />
          <circle cx="47" cy="53" r="2" fill="white" />
          <circle cx="77" cy="53" r="2" fill="white" />
        </>
      )}

      {/* Brows */}
      {expr.brows === 'raised' && (
        <>
          <line x1="40" y1="45" x2="50" y2="44" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="70" y1="44" x2="80" y2="45" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      )}
      {expr.brows === 'furrowed' && (
        <>
          <line x1="40" y1="46" x2="50" y2="48" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="70" y1="48" x2="80" y2="46" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        </>
      )}

      {/* Mouth */}
      {expr.mouthType === 'smile' && (
        <path d="M50 68 Q60 76 70 68" stroke={C.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthType === 'wide' && (
        <path d="M48 67 Q60 80 72 67" stroke={C.eye} strokeWidth="2" fill={C.highlight} opacity="0.3" strokeLinecap="round" />
      )}
      {expr.mouthType === 'hmm' && (
        <path d="M52 70 Q58 68 68 70" stroke={C.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthType === 'oh' && (
        <ellipse cx="60" cy="72" rx="4" ry="5" fill={C.eye} opacity="0.7" />
      )}
      {expr.mouthType === 'yawn' && (
        <ellipse cx="60" cy="70" rx="5" ry="4" fill={C.eye} opacity="0.5" />
      )}

      {/* Blush */}
      <ellipse cx="36" cy="64" rx="5" ry="3" fill={C.cheek} opacity={expr.blush} />
      <ellipse cx="84" cy="64" rx="5" ry="3" fill={C.cheek} opacity={expr.blush} />

      {/* Bow tie */}
      <path d="M54 78 L60 82 L66 78 L60 86Z" fill={C.bow} />
      <circle cx="60" cy="82" r="2" fill={C.highlight} />
      </g>

      {/* Graduation cap — topmost layer for 3D depth */}
      <g style={{ transform: 'translateZ(8px)' }}>
      <polygon points="60,18 35,30 60,38 85,30" fill={C.cap} />
      <rect x="57" y="30" width="6" height="5" fill={C.capDark} />
      <circle cx="60" cy="18" r="3" fill={C.star} />
      <motion.line x1="60" y1="18" x2="68" y2="12" stroke={C.star} strokeWidth="2" strokeLinecap="round"
        animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
        style={{ transformOrigin: '60px 18px' }} />
      <circle cx="68" cy="12" r="2.5" fill={C.star} />
      </g>
    </svg>
    </div>
    </div>
  )
}

// ── Reminder generator ──
function getReminder(data) {
  if (!data) return null
  const subjects = data.subjects || []
  const examDate = data.preferences?.examDate
  const totalTopics = subjects.reduce((a, s) => a + (s.topics?.length || 0), 0)
  const daysLeft = examDate ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000)) : null

  if (daysLeft !== null && daysLeft <= 14) return 'examNear'
  if (daysLeft !== null && daysLeft <= 3) return 'examNear'
  return null
}

/* ═══ STUDY MASCOT (landing page / large) ═══ */
export function StudyMascot({ context = 'welcome', compact = false, className = '' }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const data = useAppData()
  const msgs = octoMessages[context] || octoMessages.idle
  const currentMsg = msgs[msgIndex % msgs.length]

  // Determine expression from context
  const expression = useMemo(() => {
    if (['correct', 'progress', 'highProgress', 'welcome'].includes(context)) return 'excited'
    if (['incorrect', 'lowProgress'].includes(context)) return 'thinking'
    if (['quiz', 'study', 'study-session'].includes(context)) return 'curious'
    if (['idle', 'settings'].includes(context)) return 'happy'
    return 'happy'
  }, [context])

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex(p => p + 1), 4000)
    return () => clearInterval(interval)
  }, [msgs.length])

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-3 ${className}`}>
        <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
          <OctoSVG expression={expression} size={48} />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.div key={msgIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className="rounded-xl px-3 py-1.5 text-xs font-medium text-ink"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
            {currentMsg}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div key={msgIndex}
          initial={{ opacity: 0, scale: 0.9, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -6 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative rounded-2xl px-5 py-3 text-sm font-medium text-ink"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
          {currentMsg}
          <div className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2"
            style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '8px solid var(--color-surface)' }} />
        </motion.div>
      </AnimatePresence>
      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}>
        <OctoSVG expression={expression} size={80} />
      </motion.div>
    </div>
  )
}

/* ═══ PAGE MASCOT (floating corner assistant) ═══ */
export function PageMascot({ pagePath }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const data = useAppData()
  const reminder = getReminder(data)

  // Build message list: page messages + possible reminder + streak
  const msgs = useMemo(() => {
    const base = octoMessages[pagePath] || octoMessages.idle
    const extra = reminder ? octoMessages[reminder] : []
    const streak = getStreak()
    const streakMsgs = streak.current >= 3 ? octoMessages.streak : []
    return [...extra, ...streakMsgs, ...base]
  }, [pagePath, reminder])

  const currentMsg = msgs[msgIndex % msgs.length]

  const expression = useMemo(() => {
    if (reminder === 'examNear') return 'surprised'
    if (pagePath === '/quiz') return 'curious'
    if (pagePath === '/progress') return 'excited'
    if (pagePath === '/analytics') return 'thinking'
    return 'happy'
  }, [pagePath, reminder])

  useEffect(() => {
    const interval = setInterval(() => setMsgIndex(p => p + 1), 5000)
    return () => clearInterval(interval)
  }, [msgs.length])

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40 flex items-end gap-2 sm:bottom-8 sm:right-8"
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 0.8 }}>
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div key={msgIndex}
            initial={{ opacity: 0, scale: 0.9, x: 10 }} animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="max-w-[200px] rounded-2xl rounded-br-sm px-4 py-2.5 text-xs font-medium leading-relaxed text-ink shadow-lg"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
            {currentMsg}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => setIsExpanded(!isExpanded)}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -3, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' } }}
        aria-label="Toggle Octo mascot">
        <OctoSVG expression={expression} size={52} />
        {!isExpanded && (
          <motion.div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full"
            style={{ background: reminder ? C.highlight : C.cap }}
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
        )}
      </motion.button>
    </motion.div>
  )
}

export { OctoSVG, octoMessages }
