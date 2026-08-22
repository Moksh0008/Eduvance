import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppData } from '../../hooks/useAppData'
import { getStreak } from '../../utils/streaks'

const C = {
  body: '#6D4CD8', bodyLight: '#9B72FF', bodyDark: '#5A3DB8',
  eye: '#34495E', eyeWhite: '#F7F9FC',
  cap: '#2ECC71', capDark: '#1a8a4a',
  bow: '#FFD164', cheek: '#FFB6B9', highlight: '#FF8A3D', star: '#FFD164',
}

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
  profile: ["Looking good! 🎓", "Your avatar says a lot about you! 🐙", "Keep your profile updated! ✏️"],
  settings: ["Make Eduvance yours! ⚙️", "Customize everything! I don't mind! 🐙"],
  'study-session': ["Deep work starts NOW! 🎯", "Timer's running! Stay focused! ⏱️", "You're in the zone! Don't break it! 🔥"],
  'question-papers': ["Past papers = future success! 🏆", "Try a timed session — I dare you! 😏", "Practice makes permanent! 📝"],
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
  streak: [
    "🔥 Your streak is INCREDIBLE! Keep it going!",
    "🔥 I love seeing those fire emojis! You're on a roll!",
    "🔥 Streak power! You're building an unstoppable habit!",
    "🔥 That streak makes me so happy! Don't stop now!",
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
  ],
  highProgress: [
    "WOW! You're doing amazing! 🌟🎉",
    "Your preparation score is incredible! 📈",
    "Keep this up and you'll ACE the exam! 🏆",
  ],
}

const EXPRESSIONS = {
  happy: { eyeType: 'normal', mouthType: 'smile', blush: 0.5 },
  excited: { eyeType: 'sparkle', mouthType: 'wide', blush: 0.7 },
  thinking: { eyeType: 'lookUp', mouthType: 'hmm', blush: 0.3 },
  surprised: { eyeType: 'wide', mouthType: 'oh', blush: 0.6 },
  curious: { eyeType: 'lookSide', mouthType: 'smile', blush: 0.4 },
  sleepy: { eyeType: 'closed', mouthType: 'yawn', blush: 0.3 },
}

/* ═══ OCTO SVG — Matches exact character sheet ═══ */
function OctoSVG({ expression = 'happy', size = 80, enable3D = true }) {
  const expr = EXPRESSIONS[expression] || EXPRESSIONS.happy
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  function handleMouseMove(e) {
    if (!enable3D) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -12, y: x * 12 })
  }

  return (
    <div style={{ perspective: '500px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setIsHovered(false) }}>
    <div style={{
      transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${isHovered ? 'scale(1.06)' : 'scale(1)'}`,
      transformStyle: 'preserve-3d',
      transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.22,1,0.36,1)',
      filter: isHovered ? `drop-shadow(0 ${6 + tilt.x}px ${12 + Math.abs(tilt.y)}px rgba(109,76,216,0.3))` : 'drop-shadow(0 3px 6px rgba(109,76,216,0.15))',
    }}>
    <svg width={size} height={size} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>

      {/* ── TENTACLES (8 stubby, round-tipped) ── */}
      {[
        { x: 55, y: 155, tx: 30, ty: 195, mx: 40, my: 175 },
        { x: 75, y: 165, tx: 55, ty: 205, mx: 60, my: 188 },
        { x: 100, y: 170, tx: 90, ty: 210, mx: 95, my: 195 },
        { x: 125, y: 165, tx: 140, ty: 205, mx: 135, my: 188 },
        { x: 145, y: 155, tx: 170, ty: 195, mx: 160, my: 175 },
        { x: 150, y: 140, tx: 180, ty: 170, mx: 168, my: 158 },
        { x: 100, y: 175, tx: 100, ty: 215, mx: 100, my: 198 },
        { x: 50, y: 140, tx: 20, ty: 170, mx: 32, my: 158 },
      ].map((t, i) => (
        <motion.path key={i}
          d={`M${t.x} ${t.y} Q${t.mx} ${t.my} ${t.tx} ${t.ty}`}
          stroke={C.body} strokeWidth="14" strokeLinecap="round" fill="none"
          animate={{
            d: [
              `M${t.x} ${t.y} Q${t.mx} ${t.my} ${t.tx} ${t.ty}`,
              `M${t.x} ${t.y} Q${t.mx + (i % 2 ? 4 : -4)} ${t.my + 3} ${t.tx + (i % 2 ? 5 : -5)} ${t.ty + 4}`,
              `M${t.x} ${t.y} Q${t.mx} ${t.my} ${t.tx} ${t.ty}`,
            ]
          }}
          transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}

      {/* Suction cups on tentacles */}
      {[
        { x: 35, y: 180 }, { x: 60, y: 195 }, { x: 95, y: 200 },
        { x: 135, y: 195 }, { x: 165, y: 180 }, { x: 175, y: 162 },
        { x: 100, y: 205 }, { x: 25, y: 162 },
      ].map((s, i) => (
        <circle key={`s${i}`} cx={s.x} cy={s.y} r="4" fill={C.bodyLight} opacity="0.4" />
      ))}

      {/* ── BODY (round, matching character sheet) ── */}
      <ellipse cx="100" cy="115" rx="62" ry="58" fill={C.body} />
      <ellipse cx="100" cy="110" rx="58" ry="54" fill={C.bodyLight} />
      {/* Body highlight */}
      <ellipse cx="85" cy="95" rx="25" ry="20" fill="white" opacity="0.08" />

      {/* ── FACE (round, friendly) ── */}
      <ellipse cx="100" cy="100" rx="44" ry="42" fill={C.eyeWhite} opacity="0.95" />

      {/* ── GLASSES (round frames, matching character sheet) ── */}
      <circle cx="78" cy="96" r="18" fill="none" stroke={C.eye} strokeWidth="3" opacity="0.5" />
      <circle cx="122" cy="96" r="18" fill="none" stroke={C.eye} strokeWidth="3" opacity="0.5" />
      {/* Bridge */}
      <path d="M96 96 Q100 92 104 96" stroke={C.eye} strokeWidth="2.5" fill="none" opacity="0.4" />
      {/* Temple arms */}
      <path d="M60 96 Q50 90 42 88" stroke={C.eye} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />
      <path d="M140 96 Q150 90 158 88" stroke={C.eye} strokeWidth="2" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* ── EYES (big, round, expressive) ── */}
      {expr.eyeType === 'closed' ? (
        <>
          <path d="M68 96 Q78 106 88 96" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M112 96 Q122 106 132 96" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : expr.eyeType === 'wide' ? (
        <>
          <circle cx="78" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="122" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="78" cy="96" r="7" fill={C.eye} />
          <circle cx="122" cy="96" r="7" fill={C.eye} />
          <circle cx="80" cy="93" r="3" fill="white" />
          <circle cx="124" cy="93" r="3" fill="white" />
        </>
      ) : expr.eyeType === 'sparkle' ? (
        <>
          <circle cx="78" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="122" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="78" cy="96" r="7" fill={C.eye} />
          <circle cx="122" cy="96" r="7" fill={C.eye} />
          <circle cx="81" cy="93" r="3.5" fill="white" />
          <circle cx="125" cy="93" r="3.5" fill="white" />
          <circle cx="75" cy="99" r="1.5" fill="white" opacity="0.6" />
          <circle cx="119" cy="99" r="1.5" fill="white" opacity="0.6" />
          <motion.text x="60" y="80" fontSize="10" fill={C.star}
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>✦</motion.text>
          <motion.text x="135" y="80" fontSize="10" fill={C.star}
            animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}>✦</motion.text>
        </>
      ) : expr.eyeType === 'lookUp' ? (
        <>
          <circle cx="78" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="122" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="78" cy="92" r="6" fill={C.eye} />
          <circle cx="122" cy="92" r="6" fill={C.eye} />
          <circle cx="80" cy="90" r="2.5" fill="white" />
          <circle cx="124" cy="90" r="2.5" fill="white" />
        </>
      ) : expr.eyeType === 'lookSide' ? (
        <>
          <circle cx="78" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="122" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="74" cy="96" r="6" fill={C.eye} />
          <circle cx="118" cy="96" r="6" fill={C.eye} />
          <circle cx="72" cy="94" r="2.5" fill="white" />
          <circle cx="116" cy="94" r="2.5" fill="white" />
        </>
      ) : (
        <>
          <circle cx="78" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="122" cy="96" r="10" fill={C.eyeWhite} />
          <circle cx="78" cy="96" r="7" fill={C.eye} />
          <circle cx="122" cy="96" r="7" fill={C.eye} />
          <circle cx="81" cy="93" r="3" fill="white" />
          <circle cx="125" cy="93" r="3" fill="white" />
        </>
      )}

      {/* ── MOUTH ── */}
      {expr.mouthType === 'smile' && (
        <path d="M82 120 Q100 136 118 120" stroke={C.eye} strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthType === 'wide' && (
        <path d="M78 118 Q100 142 122 118" stroke={C.eye} strokeWidth="3" fill={C.highlight} opacity="0.25" strokeLinecap="round" />
      )}
      {expr.mouthType === 'hmm' && (
        <path d="M86 124 Q96 120 114 124" stroke={C.eye} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      )}
      {expr.mouthType === 'oh' && (
        <ellipse cx="100" cy="126" rx="6" ry="8" fill={C.eye} opacity="0.6" />
      )}
      {expr.mouthType === 'yawn' && (
        <ellipse cx="100" cy="124" rx="8" ry="6" fill={C.eye} opacity="0.4" />
      )}

      {/* ── CHEEK BLUSH ── */}
      <ellipse cx="58" cy="114" rx="8" ry="5" fill={C.cheek} opacity={expr.blush} />
      <ellipse cx="142" cy="114" rx="8" ry="5" fill={C.cheek} opacity={expr.blush} />

      {/* ── BOW TIE (yellow, matching character sheet) ── */}
      <path d="M88 145 L100 152 L112 145 L100 158Z" fill={C.bow} />
      <circle cx="100" cy="152" r="3.5" fill={C.highlight} />

      {/* ── GRADUATION CAP (dark green, gold tassel) ── */}
      <polygon points="100,28 55,48 100,60 145,48" fill={C.cap} />
      <rect x="95" y="48" width="10" height="8" fill={C.capDark} rx="1" />
      <circle cx="100" cy="28" r="5" fill={C.star} />
      <motion.line x1="100" y1="28" x2="115" y2="18" stroke={C.star} strokeWidth="3" strokeLinecap="round"
        animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
        style={{ transformOrigin: '100px 28px' }} />
      <circle cx="115" cy="18" r="4" fill={C.star} />

    </svg>
    </div>
    </div>
  )
}

function getReminder(data) {
  if (!data) return null
  const examDate = data.preferences?.examDate
  const daysLeft = examDate ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000)) : null
  if (daysLeft !== null && daysLeft <= 14) return 'examNear'
  return null
}

/* ═══ STUDY MASCOT (landing page) ═══ */
export function StudyMascot({ context = 'welcome', compact = false, className = '' }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const msgs = octoMessages[context] || octoMessages.idle
  const currentMsg = msgs[msgIndex % msgs.length]

  const expression = useMemo(() => {
    if (['correct', 'progress', 'highProgress', 'welcome'].includes(context)) return 'excited'
    if (['incorrect', 'lowProgress'].includes(context)) return 'thinking'
    if (['quiz', 'study', 'study-session'].includes(context)) return 'curious'
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
          <OctoSVG expression={expression} size={56} />
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
        <OctoSVG expression={expression} size={120} />
      </motion.div>
    </div>
  )
}

/* ═══ PAGE MASCOT (floating corner) ═══ */
export function PageMascot({ pagePath }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const data = useAppData()
  const reminder = getReminder(data)

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
        <OctoSVG expression={expression} size={64} />
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
