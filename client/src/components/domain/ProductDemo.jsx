import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════
   PRODUCT DEMO — Disney-Fantasy Cinematic Walkthrough
   Octo guides the user through Eduvance with magic
   ═══════════════════════════════════════════════════ */

const OCTO_IMG = '/mascot/octo-140.webp'

const DEMO_STEPS = [
  {
    id: 'welcome',
    octoMsg: "Hi there! I'm Octo — let me show you the magic! ✨",
    octoMsg2: "Eduvance learns what you know and what you don't.",
    octoPos: { bottom: '60px', right: '20px' },
    bubbleDir: 'left',
    wandAngle: -45,
    screen: WelcomeScreen,
  },
  {
    id: 'dashboard',
    octoMsg: "Look! Your exam countdown, streak, and priorities — all live!",
    octoMsg2: "I track everything so you don't have to.",
    octoPos: { top: '30px', right: '16px' },
    bubbleDir: 'left',
    wandAngle: -90,
    screen: DashboardScreen,
  },
  {
    id: 'syllabus',
    octoMsg: "I read your syllabus and break it into bite-sized topics.",
    octoMsg2: "Each one is tracked and prioritized automatically.",
    octoPos: { top: '60px', right: '16px' },
    bubbleDir: 'left',
    wandAngle: -60,
    screen: SyllabusScreen,
  },
  {
    id: 'priority',
    octoMsg: "Here's where the AI brain kicks in! ⚡",
    octoMsg2: "I calculate what to study FIRST based on your weakness & urgency.",
    octoPos: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' },
    bubbleDir: 'top',
    wandAngle: 0,
    screen: PriorityScreen,
  },
  {
    id: 'quiz',
    octoMsg: "Now I quiz you — every question targets a specific gap!",
    octoMsg2: "Wrong answer? I notice and adapt. 🎯",
    octoPos: { bottom: '60px', right: '16px' },
    bubbleDir: 'left',
    wandAngle: -30,
    screen: QuizScreen,
  },
  {
    id: 'replan',
    octoMsg: "After every quiz, I automatically replan your schedule! 🔄",
    octoMsg2: "Weak topics get more time. Strong ones step back.",
    octoPos: { top: '30px', left: '16px' },
    bubbleDir: 'right',
    wandAngle: 45,
    screen: ReplanScreen,
  },
  {
    id: 'done',
    octoMsg: "That's Eduvance — your AI study companion!",
    octoMsg2: "Ready to start your journey? 🚀",
    octoPos: { bottom: '50px', right: '24px' },
    bubbleDir: 'left',
    wandAngle: -20,
    screen: DoneScreen,
  },
]

const STEP_DURATION = 3500

/* ═══ SPARKLE PARTICLE COMPONENT ═══ */
function Sparkles({ color = '#818cf8', count = 6, size = 4, active = true }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 60,
      delay: Math.random() * 1.5,
      duration: 1.5 + Math.random() * 1,
      size: size * (0.5 + Math.random() * 0.8),
    })), [count, size])

  if (!active) return null

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: color,
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            boxShadow: `0 0 ${p.size * 2}px ${color}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0],
            y: [0, -20 - Math.random() * 20],
            x: [(Math.random() - 0.5) * 15],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 0.5,
          }}
        />
      ))}
    </div>
  )
}

/* ═══ MAGIC WAND TRAIL ═══ */
function WandTrail({ angle = -45, color = '#818cf8' }) {
  return (
    <motion.div
      className="pointer-events-none absolute"
      style={{
        bottom: '70%',
        left: '30%',
        width: 40,
        height: 3,
        background: `linear-gradient(90deg, transparent, ${color})`,
        borderRadius: 2,
        transformOrigin: 'left center',
        rotate: angle,
      }}
      animate={{
        opacity: [0, 0.8, 0],
        scaleX: [0.3, 1, 0.3],
        filter: [
          `blur(0px) drop-shadow(0 0 4px ${color})`,
          `blur(0px) drop-shadow(0 0 12px ${color})`,
          `blur(0px) drop-shadow(0 0 4px ${color})`,
        ],
      }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/* ═══ FLOATING MAGIC RING ═══ */
function MagicRing({ color = '#6366f1' }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full border"
      style={{
        width: 100,
        height: 100,
        left: 'calc(50% - 50px)',
        top: 'calc(50% - 50px)',
        borderColor: `${color}30`,
      }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.2, 0.5, 0.2],
        rotate: [0, 360],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ═══ CINEMATIC OCTO GUIDE ═══ */
function CinematicOcto({ step, isDark }) {
  const current = DEMO_STEPS[step]
  const [msgIndex, setMsgIndex] = useState(0)

  // Alternate between two messages
  useEffect(() => {
    setMsgIndex(0)
    const t = setTimeout(() => setMsgIndex(1), STEP_DURATION * 0.5)
    return () => clearTimeout(t)
  }, [step])

  const message = msgIndex === 0 ? current.octoMsg : current.octoMsg2
  const isRight = current.bubbleDir === 'right'
  const isTop = current.bubbleDir === 'top'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        className="absolute z-20 flex items-end gap-2"
        style={{
          ...current.octoPos,
          flexDirection: isRight ? 'row-reverse' : 'row',
        }}
        initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        exit={{ opacity: 0, scale: 0.3, rotate: 20, filter: 'blur(8px)' }}
        transition={{
          type: 'spring',
          stiffness: 150,
          damping: 12,
          mass: 0.8,
        }}
      >
        {/* Speech bubble with typewriter feel */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          className="relative max-w-[170px] rounded-2xl px-3.5 py-2.5 text-[10px] leading-relaxed shadow-xl sm:max-w-[210px] sm:text-[11px]"
          style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(17,22,49,0.95))'
              : 'linear-gradient(135deg, rgba(238,242,255,0.95), rgba(255,255,255,0.98))',
            border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
            color: isDark ? '#e2e8f0' : '#1e293b',
            boxShadow: `0 8px 32px ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.1)'}, 0 0 0 1px ${isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)'}`,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`${step}-${msgIndex}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="block"
            >
              {message}
            </motion.span>
          </AnimatePresence>
          {/* Bubble pointer */}
          <div
            className="absolute h-0 w-0"
            style={{
              [isRight ? 'right' : isTop ? 'left' : 'left']: isTop ? 'auto' : '-6px',
              [isTop ? 'bottom' : 'bottom']: isTop ? 'auto' : '-6px',
              ...(isTop
                ? { bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }
                : { bottom: '-6px' }),
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: `7px solid ${isDark ? 'rgba(17,22,49,0.95)' : 'rgba(255,255,255,0.98)'}`,
            }}
          />
        </motion.div>

        {/* Octo with magical entrance */}
        <div className="relative shrink-0">
          {/* Magic ring behind Octo */}
          <MagicRing color={DEMO_STEPS[step].octoMsg.includes('⚡') ? '#f97316' : '#6366f1'} />

          {/* Sparkle particles */}
          <Sparkles
            color="#818cf8"
            count={8}
            size={3}
            active={true}
          />

          {/* Wand trail */}
          <WandTrail angle={current.wandAngle} color="#818cf8" />

          {/* Octo image */}
          <motion.img
            src={OCTO_IMG}
            alt="Octo your guide"
            className="relative z-10 h-14 w-14 sm:h-18 sm:w-18"
            width="72" height="72"
            style={{
              filter: 'drop-shadow(0 4px 20px rgba(109,76,216,0.5)) drop-shadow(0 0 40px rgba(99,102,241,0.3))',
            }}
            animate={{
              y: [0, -8, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
          />

          {/* Glow pulse behind Octo */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
              filter: 'blur(12px)',
              zIndex: -1,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ═══ SCREEN COMPONENTS ═══ */

function WelcomeScreen({ isDark }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10, delay: 0.2 }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold shadow-lg"
          style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff' }}>
          Ev
        </div>
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="mt-4 font-serif text-xl font-semibold" style={{ color: isDark ? '#e8eaf0' : '#111827' }}>
        Welcome to Eduvance
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-2 text-xs" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
        Adaptive Exam Preparation
      </motion.p>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
        className="mt-6 flex gap-2">
        {['📚 DBMS', '🌐 CN', '💻 Java', '⚙️ OS'].map((sub, i) => (
          <motion.span key={sub} initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.4 + i * 0.15, type: 'spring', stiffness: 200 }}
            className="rounded-full px-3 py-1.5 text-[10px] font-medium shadow-sm"
            style={{ background: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)', color: '#818cf8' }}>
            {sub}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}

function DashboardScreen({ isDark }) {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ background: '#6366f1' }} />
          <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>Dashboard</span>
        </div>
        <span className="text-[9px]" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>3h / day</span>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { label: 'Exam in', value: '12 days', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Progress', value: '68%', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Streak', value: '🔥 5', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, type: 'spring', stiffness: 200 }}
            className="rounded-lg p-2 shadow-sm" style={{ background: m.bg }}>
            <div className="text-[8px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>{m.label}</div>
            <div className="mt-0.5 text-[12px] font-bold" style={{ color: m.color }}>{m.value}</div>
          </motion.div>
        ))}
      </div>
      <div className="rounded-lg p-2" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)' }}>
        <div className="mb-1.5 text-[8px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
          Today's Priority
        </div>
        {[
          { topic: 'DBMS — Normalization', time: '45 min', badge: 'HIGH', color: '#ef4444' },
          { topic: 'CN — Routing', time: '30 min', badge: 'MED', color: '#f97316' },
          { topic: 'Java — Collections', time: '25 min', badge: 'LOW', color: '#10b981' },
        ].map((t, i) => (
          <motion.div key={t.topic} initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, type: 'spring', stiffness: 200 }}
            className="mb-1 flex items-center justify-between rounded-md px-2 py-1.5"
            style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)' }}>
            <span className="text-[9px] font-medium" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{t.topic}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[8px]" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>{t.time}</span>
              <span className="rounded px-1 py-0.5 text-[7px] font-bold" style={{ background: `${t.color}20`, color: t.color }}>{t.badge}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SyllabusScreen({ isDark }) {
  const topics = [
    { name: 'Normalization', status: 'done', pct: 100 },
    { name: 'SQL Basics', status: 'done', pct: 100 },
    { name: 'Functional Dependencies', status: 'current', pct: 65 },
    { name: 'BCNF', status: 'upcoming', pct: 0 },
    { name: 'Transactions', status: 'upcoming', pct: 0 },
  ]
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px]">📚</span>
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>DBMS Syllabus</span>
      </div>
      <div className="space-y-1.5">
        {topics.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.1, type: 'spring', stiffness: 180 }}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2"
            style={{
              background: t.status === 'current'
                ? (isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)')
                : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              border: t.status === 'current' ? '1px solid rgba(99,102,241,0.2)' : '1px solid transparent',
            }}>
            <span className="text-[10px]">
              {t.status === 'done' ? '✅' : t.status === 'current' ? '📖' : '⬜'}
            </span>
            <div className="flex-1">
              <span className="text-[10px] font-medium" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{t.name}</span>
              {t.status === 'current' && (
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: '#6366f1' }}
                    initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }} />
                </div>
              )}
            </div>
            <span className="text-[9px] font-medium" style={{
              color: t.status === 'done' ? '#16a34a' : t.status === 'current' ? '#6366f1' : (isDark ? '#64748b' : '#9ca3af'),
            }}>
              {t.status === 'done' ? '100%' : t.status === 'current' ? `${t.pct}%` : '—'}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function PriorityScreen({ isDark }) {
  const items = [
    { name: 'BCNF', score: 92, reason: 'Exam in 4d · Accuracy 38%', bar: 92, color: '#ef4444' },
    { name: 'Functional Deps', score: 78, reason: 'Exam in 4d · Accuracy 52%', bar: 78, color: '#f97316' },
    { name: 'SQL Joins', score: 31, reason: 'Accuracy 94% · Recently studied', bar: 31, color: '#22c55e' },
  ]
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px]">⚡</span>
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>AI Priority Engine</span>
      </div>
      <div className="mb-2 text-[8px] uppercase tracking-wider font-semibold" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
        What you should study NOW
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div key={item.name} initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.2, type: 'spring', stiffness: 180 }}
            className="rounded-lg p-2.5 shadow-sm" style={{
              background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
            }}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{item.name}</span>
              <span className="text-[11px] font-bold" style={{ color: item.color }}>{item.score}</span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
              <motion.div className="h-full rounded-full" style={{ background: item.color }}
                initial={{ width: 0 }} animate={{ width: `${item.bar}%` }} transition={{ delay: 0.4 + i * 0.2, duration: 0.7, ease: 'easeOut' }} />
            </div>
            <p className="mt-1 text-[8px]" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>{item.reason}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function QuizScreen({ isDark }) {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSelected(2), 1000)
    const t2 = setTimeout(() => setShowResult(true), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[10px]">🎯</span>
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>Quiz — Normalization</span>
      </div>
      <div className="mb-1 text-[7px] font-medium uppercase tracking-wider" style={{ color: '#6366f1' }}>Difficulty: Medium</div>
      <div className="mt-2 rounded-lg p-3 shadow-sm" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}>
        <p className="text-[10px] font-medium leading-relaxed" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>
          A relation is in 3NF if it is in 2NF and has no transitive dependencies. Which of the following violates 3NF?
        </p>
      </div>
      <div className="mt-2 space-y-1.5">
        {['A → B, B → C (A is key)', 'All attributes are prime', 'No partial dependencies exist', 'Only candidate keys determine attributes'].map((opt, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 200 }}
            onClick={() => !showResult && setSelected(i)}
            className="flex cursor-default items-center gap-2 rounded-lg px-2.5 py-2 text-[9px] transition-all shadow-sm"
            style={{
              background: showResult && i === 0
                ? 'rgba(34,197,94,0.12)'
                : showResult && i === selected && i !== 0
                  ? 'rgba(239,68,68,0.12)'
                  : selected === i
                    ? (isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.06)')
                    : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
              border: selected === i ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              color: isDark ? '#e2e8f0' : '#111827',
            }}>
            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold"
              style={{
                background: showResult && i === 0 ? '#16a34a' : selected === i ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'),
                color: showResult && i === 0 || selected === i ? '#fff' : (isDark ? '#94a3b8' : '#6b7280'),
              }}>
              {String.fromCharCode(65 + i)}
            </span>
            <span className="text-[9px]">{opt}</span>
            {showResult && i === 0 && <span className="ml-auto text-[10px]">✅</span>}
            {showResult && i === selected && i !== 0 && <span className="ml-auto text-[10px]">❌</span>}
          </motion.div>
        ))}
      </div>
      {showResult && (
        <motion.div initial={{ opacity: 0, y: 4, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="mt-2 rounded-lg p-2 text-center text-[10px] font-medium shadow-sm"
          style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
          Score: 0/1 · Weak area detected: Transitive Dependencies
        </motion.div>
      )}
    </div>
  )
}

function ReplanScreen({ isDark }) {
  return (
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="text-[10px]">🔄</span>
        <span className="text-[10px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>Auto-Replan</span>
      </div>
      <div className="mb-2">
        <div className="mb-1 text-[8px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>Before Quiz</div>
        <div className="space-y-1">
          {[
            { name: 'SQL Joins', min: 45 },
            { name: 'Normalization', min: 20 },
            { name: 'Transactions', min: 30 },
          ].map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-[9px] shadow-sm"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', color: isDark ? '#e2e8f0' : '#111827' }}>
              <span>{t.name}</span>
              <span style={{ color: isDark ? '#64748b' : '#9ca3af' }}>{t.min} min</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, type: 'spring' }}
        className="my-2 flex justify-center">
        <div className="flex items-center gap-1 rounded-full px-3 py-1 text-[9px] font-semibold shadow-md" style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
          ⚡ Weak topic detected → Replanning
        </div>
      </motion.div>
      <div>
        <div className="mb-1 text-[8px] font-semibold uppercase tracking-wider" style={{ color: '#6366f1' }}>After Quiz</div>
        <div className="space-y-1">
          {[
            { name: 'Normalization', min: 50, highlight: true },
            { name: 'SQL Joins', min: 30, highlight: false },
            { name: 'Transactions', min: 15, highlight: false },
          ].map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.0 + i * 0.15, type: 'spring', stiffness: 200 }}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-[9px] shadow-sm"
              style={{
                background: t.highlight
                  ? (isDark ? 'rgba(239,68,68,0.08)' : 'rgba(239,68,68,0.05)')
                  : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                border: t.highlight ? '1px solid rgba(239,68,68,0.15)' : '1px solid transparent',
                color: isDark ? '#e2e8f0' : '#111827',
              }}>
              <span>
                {t.name}
                {t.highlight && <span className="ml-1 text-[8px] text-red-500">↑ increased</span>}
              </span>
              <span className="font-medium" style={{ color: t.highlight ? '#ef4444' : (isDark ? '#64748b' : '#9ca3af') }}>{t.min} min</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DoneScreen({ isDark }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 8 }}>
        <img src={OCTO_IMG} alt="Octo" className="h-20 w-20" width="80" height="80"
          style={{ filter: 'drop-shadow(0 4px 20px rgba(109,76,216,0.5))' }} />
      </motion.div>
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="mt-4 font-serif text-lg font-semibold" style={{ color: isDark ? '#e8eaf0' : '#111827' }}>
        Your AI Study Companion
      </motion.p>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-2 max-w-[200px] text-[10px] leading-relaxed" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
        Analyzes · Prioritizes · Plans · Quizzes · Evaluates · Replans
      </motion.p>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
        className="mt-5 rounded-full px-5 py-2 text-[11px] font-semibold text-white shadow-lg"
        style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)', boxShadow: '0 4px 24px rgba(99,102,241,0.4)' }}>
        Start Preparing →
      </motion.div>
    </div>
  )
}

/* ═══ MAIN PRODUCT DEMO ═══ */

export function ProductDemo() {
  const { isDark } = useTheme()
  const [step, setStep] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isInView || isPaused) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    intervalRef.current = setInterval(() => {
      setStep(prev => (prev + 1) % DEMO_STEPS.length)
    }, STEP_DURATION)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isInView, isPaused])

  const currentStep = DEMO_STEPS[step]
  const ScreenComponent = currentStep.screen

  return (
    <div ref={containerRef} className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl"
      style={{
        background: isDark ? 'rgba(17,22,49,0.6)' : '#ffffff',
        border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.08)'}`,
        boxShadow: isDark
          ? '0 8px 40px rgba(99,102,241,0.12), 0 0 80px rgba(99,102,241,0.05)'
          : '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      }}>

      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b px-4 py-2.5"
        style={{ borderColor: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.06)' }}>
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#ef4444' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#eab308' }} />
          <div className="h-2.5 w-2.5 rounded-full" style={{ background: '#22c55e' }} />
        </div>
        <div className="ml-3 flex-1 rounded-md px-3 py-1 text-[9px]" style={{
          background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
          color: isDark ? '#64748b' : '#9ca3af',
        }}>
          eduvance.app/{currentStep.id === 'welcome' ? '' : currentStep.id}
        </div>
      </div>

      {/* Demo content area */}
      <div className="relative flex" style={{ minHeight: '320px' }}>
        {/* Mini sidebar */}
        <div className="hidden w-[16%] flex-col gap-1.5 border-r p-2.5 sm:flex"
          style={{
            background: isDark ? 'rgba(10,14,40,0.4)' : 'rgba(249,250,251,0.8)',
            borderColor: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)',
          }}>
          <div className="mb-2 flex items-center gap-1.5 px-1">
            <div className="flex h-5 w-5 items-center justify-center rounded-md text-[7px] font-bold" style={{ background: '#6366f1', color: '#fff' }}>Ev</div>
            <span className="text-[8px] font-semibold" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>Eduvance</span>
          </div>
          {[
            { icon: '📊', label: 'Dashboard', active: step === 1 },
            { icon: '📚', label: 'Syllabus', active: step === 2 },
            { icon: '⚡', label: 'Priority', active: step === 3 },
            { icon: '🎯', label: 'Quiz', active: step === 4 },
            { icon: '🔄', label: 'Replan', active: step === 5 },
          ].map((item) => (
            <motion.div key={item.label}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-[8px]"
              style={{
                background: item.active ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
                color: item.active ? '#6366f1' : (isDark ? '#94a3b8' : '#6b7280'),
                fontWeight: item.active ? 600 : 400,
              }}
              animate={item.active ? { x: [0, 3, 0] } : {}}
              transition={{ duration: 0.5 }}>
              <span>{item.icon}</span>
              {item.label}
            </motion.div>
          ))}
        </div>

        {/* Screen content with cinematic transitions */}
        <div className="flex flex-1 flex-col">
          <AnimatePresence mode="wait">
            <motion.div key={currentStep.id}
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.02, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 flex-col">
              <ScreenComponent isDark={isDark} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cinematic Octo Guide */}
        <CinematicOcto step={step} isDark={isDark} />
      </div>

      {/* Progress bar + controls */}
      <div className="flex items-center justify-center gap-4 border-t px-4 py-2.5"
        style={{ borderColor: isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)' }}>
        <button onClick={() => setIsPaused(!isPaused)}
          aria-label={isPaused ? 'Play demo' : 'Pause demo'}
          className="flex h-6 w-6 items-center justify-center rounded-full text-[10px]"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }}>
          {isPaused ? '▶' : '⏸'}
        </button>
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Demo steps">
          {DEMO_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setStep(i)}
              role="tab" aria-selected={i === step} aria-label={`Step ${i + 1}: ${s.id}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === step ? '20px' : '6px',
                height: '6px',
                background: i === step ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'),
              }} />
          ))}
        </div>
        <span className="text-[9px] font-medium" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
          {step + 1} / {DEMO_STEPS.length}
        </span>
      </div>
    </div>
  )
}

export default ProductDemo
