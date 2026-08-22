import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════
   PRODUCT DEMO — Duolingo-Style Cinematic Experience
   Full-screen animated scenes with floating UI
   ═══════════════════════════════════════════════════ */

const OCTO_IMG = '/mascot/octo-140.webp'

const SCENES = [
  {
    id: 'problem',
    title: 'Too much to study?',
    subtitle: 'Exams creeping closer. Panic setting in.',
    octoMsg: "Don't worry — I've got you! 🐙",
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)',
    elements: ProblemScene,
  },
  {
    id: 'analyze',
    title: 'Eduvance analyzes',
    subtitle: 'Your syllabus, exam dates, and what you already know.',
    octoMsg: "I read your syllabus and understand every topic.",
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%)',
    elements: AnalyzeScene,
  },
  {
    id: 'prioritize',
    title: 'AI prioritizes',
    subtitle: 'Weak topics rise. Mastered ones step back.',
    octoMsg: "I calculate what to study FIRST!",
    bg: 'linear-gradient(135deg, #0f172a 0%, #7c2d12 50%, #b45309 100%)',
    elements: PrioritizeScene,
  },
  {
    id: 'plan',
    title: 'Smart plan appears',
    subtitle: 'A personalized schedule that adapts to you.',
    octoMsg: "Your plan changes as you improve!",
    bg: 'linear-gradient(135deg, #0f172a 0%, #064e3b 50%, #047857 100%)',
    elements: PlanScene,
  },
  {
    id: 'quiz',
    title: 'Test your knowledge',
    subtitle: 'Every question targets a gap.',
    octoMsg: "I quiz you on YOUR weak areas.",
    bg: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #7c3aed 100%)',
    elements: QuizScene,
  },
  {
    id: 'replan',
    title: 'Strategy adapts',
    subtitle: 'Weaknesses detected. Plan automatically replanned.',
    octoMsg: "I keep adapting until your exam! 🔄",
    bg: 'linear-gradient(135deg, #0f172a 0%, #831843 50%, #be185d 100%)',
    elements: ReplanScene,
  },
  {
    id: 'done',
    title: 'Stop guessing.',
    subtitle: 'Start preparing with a system that adapts to you.',
    octoMsg: "Ready to start your journey? 🚀",
    bg: 'linear-gradient(135deg, #0f172a 0%, #312e81 50%, #4f46e5 100%)',
    elements: DoneScene,
  },
]

const SCENE_DURATION = 4000

/* ═══ SPARKLE PARTICLES ═══ */
function Sparkles({ count = 12, color = '#818cf8', spread = 150 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * spread,
      y: (Math.random() - 0.5) * spread,
      size: 2 + Math.random() * 4,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 1.5,
    })), [count, spread])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
            boxShadow: `0 0 ${p.size * 3}px ${color}`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -30 - Math.random() * 30],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

/* ═══ FLOATING ORB ═══ */
function FloatingOrb({ size = 200, color = '#6366f1', x = '50%', y = '50%', delay = 0 }) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        background: `radial-gradient(circle, ${color}30 0%, transparent 70%)`,
        filter: 'blur(40px)',
      }}
      animate={{
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ═══ FLOATING UI CARD ═══ */
function FloatingCard({ children, delay = 0, x = 0, y = 0, rotate = 0, scale = 1 }) {
  return (
    <motion.div
      className="absolute rounded-2xl px-4 py-3 shadow-2xl backdrop-blur-xl"
      style={{
        left: `calc(50% + ${x}px)`,
        top: `calc(50% + ${y}px)`,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: '#e2e8f0',
      }}
      initial={{ opacity: 0, scale: 0.3, y: 30 }}
      animate={{ opacity: 1, scale, y: 0 }}
      exit={{ opacity: 0, scale: 0.3, y: -30 }}
      transition={{ delay, type: 'spring', stiffness: 120, damping: 12 }}
    >
      {children}
    </motion.div>
  )
}

/* ═══ OCTO GUIDE ═══ */
function OctoGuide({ scene, isDark }) {
  const current = SCENES[scene]

  return (
    <motion.div
      className="absolute bottom-8 right-8 z-30 flex items-end gap-3"
      initial={{ opacity: 0, x: 100, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.5 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12, delay: 0.5 }}
    >
      {/* Speech bubble */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 150 }}
        className="relative max-w-[220px] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(17,22,49,0.95))',
          border: '1px solid rgba(99,102,241,0.25)',
          color: '#e2e8f0',
          boxShadow: '0 8px 40px rgba(99,102,241,0.3), 0 0 80px rgba(99,102,241,0.1)',
        }}
      >
        {current.octoMsg}
        <div className="absolute -bottom-1.5 right-4 h-0 w-0" style={{
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '7px solid rgba(17,22,49,0.95)',
        }} />
      </motion.div>

      {/* Octo with magic effects */}
      <div className="relative">
        <Sparkles count={10} color="#818cf8" spread={80} />
        <motion.img
          src={OCTO_IMG}
          alt="Octo"
          className="relative z-10 h-20 w-20 sm:h-24 sm:w-24"
          width="96" height="96"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.5)) drop-shadow(0 0 60px rgba(99,102,241,0.3))',
          }}
          animate={{
            y: [0, -12, 0],
            rotate: [0, -8, 8, 0],
          }}
          transition={{
            y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            rotate: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
          }}
        />
        {/* Glow behind Octo */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(20px)',
            zIndex: -1,
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    </motion.div>
  )
}

/* ═══ SCENE: PROBLEM ═══ */
function ProblemScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={300} color="#ef4444" x="30%" y="40%" />
      <FloatingOrb size={200} color="#f97316" x="70%" y="60%" delay={1} />

      {/* Floating problem cards */}
      <FloatingCard delay={0.2} x={-180} y={-60} rotate={-8} scale={0.9}>
        <div className="text-xs opacity-80">📚 Too much to study</div>
        <div className="mt-1 text-lg font-bold">DBMS, OS, CN, Java...</div>
      </FloatingCard>

      <FloatingCard delay={0.4} x={160} y={-40} rotate={6} scale={0.85}>
        <div className="text-xs opacity-80">⏰ Exam in 5 days</div>
        <div className="mt-1 text-lg font-bold text-red-400">Panic mode ON</div>
      </FloatingCard>

      <FloatingCard delay={0.6} x={0} y={80} rotate={-3} scale={0.8}>
        <div className="text-xs opacity-80">🤷 What should I study?</div>
        <div className="mt-1 text-lg font-bold text-orange-400">No idea where to start</div>
      </FloatingCard>

      {/* Central question mark */}
      <motion.div
        className="absolute text-[120px] font-bold opacity-10"
        style={{ color: '#ef4444' }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ?
      </motion.div>
    </div>
  )
}

/* ═══ SCENE: ANALYZE ═══ */
function AnalyzeScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={350} color="#3b82f6" x="50%" y="50%" />

      {/* Scanning effect */}
      <motion.div
        className="absolute h-[2px] w-[80%]"
        style={{
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
          boxShadow: '0 0 20px #3b82f6',
        }}
        animate={{
          top: ['20%', '80%', '20%'],
          opacity: [0, 1, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating syllabus document */}
      <FloatingCard delay={0.2} x={0} y={-20} scale={1.1}>
        <div className="min-w-[200px]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-blue-400">📄 Analyzing Syllabus</div>
          {['DBMS', 'Normalization', 'SQL', 'Transactions'].map((topic, i) => (
            <motion.div
              key={topic}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.2 }}
              className="flex items-center gap-2 py-1"
            >
              <motion.span
                className="text-green-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.2, type: 'spring' }}
              >
                ✓
              </motion.span>
              <span className="text-sm">{topic}</span>
            </motion.div>
          ))}
        </div>
      </FloatingCard>

      {/* Side icons */}
      <FloatingCard delay={0.3} x={-250} y={20} rotate={-10} scale={0.7}>
        <div className="text-2xl">📊</div>
        <div className="mt-1 text-[10px] opacity-70">Performance</div>
      </FloatingCard>

      <FloatingCard delay={0.5} x={250} y={-10} rotate={8} scale={0.7}>
        <div className="text-2xl">📅</div>
        <div className="mt-1 text-[10px] opacity-70">Exam Dates</div>
      </FloatingCard>
    </div>
  )
}

/* ═══ SCENE: PRIORITIZE ═══ */
function PrioritizeScene() {
  const items = [
    { name: 'BCNF', score: 92, color: '#ef4444', reason: 'Exam soon + low accuracy' },
    { name: 'Normalization', score: 78, color: '#f97316', reason: 'Medium priority' },
    { name: 'SQL Basics', score: 25, color: '#22c55e', reason: 'Already mastered' },
  ]

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={300} color="#f97316" x="50%" y="50%" />

      <FloatingCard delay={0.2} x={0} y={0} scale={1.1}>
        <div className="min-w-[280px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-orange-400">⚡ AI Priority Engine</div>
          {items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.3, type: 'spring', stiffness: 150 }}
              className="mb-3 rounded-xl p-3"
              style={{
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">{item.name}</span>
                <motion.span
                  className="text-lg font-bold"
                  style={{ color: item.color }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.3, type: 'spring' }}
                >
                  {item.score}
                </motion.span>
              </div>
              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: item.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.score}%` }}
                  transition={{ delay: 0.7 + i * 0.3, duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="mt-1 text-[10px] opacity-60">{item.reason}</p>
            </motion.div>
          ))}
        </div>
      </FloatingCard>

      {/* Arrow pointing to top */}
      <motion.div
        className="absolute top-[20%] text-4xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        🎯
      </motion.div>
    </div>
  )
}

/* ═══ SCENE: PLAN ═══ */
function PlanScene() {
  const blocks = [
    { subject: 'DBMS → Normalization', time: '45 min', color: '#ef4444', start: '09:00' },
    { subject: 'CN → Routing', time: '30 min', color: '#f97316', start: '09:45' },
    { subject: 'Java → Collections', time: '25 min', color: '#8b5cf6', start: '10:15' },
  ]

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={300} color="#10b981" x="50%" y="50%" />

      <FloatingCard delay={0.2} x={0} y={0} scale={1.05}>
        <div className="min-w-[260px]">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-400">🗓 Your Smart Plan</div>
          {blocks.map((block, i) => (
            <motion.div
              key={block.subject}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.25, type: 'spring', stiffness: 150 }}
              className="mb-2 flex items-center gap-3 rounded-xl p-3"
              style={{
                background: `${block.color}12`,
                borderLeft: `3px solid ${block.color}`,
              }}
            >
              <div className="text-xs font-mono opacity-60">{block.start}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{block.subject}</div>
                <div className="text-[10px] opacity-60">{block.time}</div>
              </div>
              <motion.div
                className="text-lg"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
              >
                {i === 0 ? '🔴' : i === 1 ? '🟡' : '🟢'}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </FloatingCard>
    </div>
  )
}

/* ═══ SCENE: QUIZ ═══ */
function QuizScene() {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSelected(2), 1200)
    const t2 = setTimeout(() => setShowResult(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={300} color="#8b5cf6" x="50%" y="50%" />

      <FloatingCard delay={0.2} x={0} y={0} scale={1.1}>
        <div className="min-w-[300px]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-purple-400">🎯 Quiz — Normalization</div>
          <div className="mb-3 rounded-xl bg-white/5 p-3 text-sm">
            Which normal form eliminates transitive dependencies?
          </div>
          {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
            <motion.div
              key={opt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              className="mb-2 flex items-center gap-2 rounded-lg p-2 text-sm transition-all"
              style={{
                background: showResult && i === 2
                  ? 'rgba(34,197,94,0.2)'
                  : showResult && i === selected && i !== 2
                    ? 'rgba(239,68,68,0.2)'
                    : selected === i
                      ? 'rgba(139,92,246,0.15)'
                      : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected === i ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              {opt}
              {showResult && i === 2 && <span className="ml-auto">✅</span>}
              {showResult && i === selected && i !== 2 && <span className="ml-auto">❌</span>}
            </motion.div>
          ))}
        </div>
      </FloatingCard>
    </div>
  )
}

/* ═══ SCENE: REPLAN ═══ */
function ReplanScene() {
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <FloatingOrb size={300} color="#ec4899" x="50%" y="50%" />

      {/* Before card */}
      <FloatingCard delay={0.2} x={-160} y={0} rotate={-5} scale={0.85}>
        <div className="min-w-[140px]">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Before</div>
          <div className="space-y-1 text-xs">
            <div>SQL: 45 min</div>
            <div>Normalization: 20 min</div>
            <div>Transactions: 30 min</div>
          </div>
        </div>
      </FloatingCard>

      {/* Arrow */}
      <motion.div
        className="absolute text-4xl"
        animate={{ x: [0, 15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⚡
      </motion.div>

      {/* After card */}
      <FloatingCard delay={0.5} x={160} y={0} rotate={5} scale={0.85}>
        <div className="min-w-[140px]">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-pink-400">After Quiz</div>
          <div className="space-y-1 text-xs">
            <div className="text-red-400">Normalization: 50 min ↑</div>
            <div>SQL: 30 min</div>
            <div>Transactions: 15 min</div>
          </div>
        </div>
      </FloatingCard>

      {/* Weak topic detected badge */}
      <motion.div
        className="absolute bottom-[25%] rounded-full bg-red-500/20 px-4 py-2 text-sm font-semibold text-red-400"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
      >
        ⚠️ Weak topic detected — Plan updated!
      </motion.div>
    </div>
  )
}

/* ═══ SCENE: DONE ═══ */
function DoneScene() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      <FloatingOrb size={400} color="#6366f1" x="50%" y="50%" />
      <Sparkles count={20} color="#818cf8" spread={250} />

      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 80, damping: 8, delay: 0.3 }}
      >
        <img src={OCTO_IMG} alt="Octo" className="h-28 w-28" width="112" height="112"
          style={{ filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.5))' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center"
      >
        <h2 className="text-3xl font-bold text-white">Eduvance</h2>
        <p className="mt-2 max-w-sm text-sm text-white/70">
          Your AI study companion that adapts to you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="mt-8 rounded-full px-8 py-3 text-lg font-bold text-white shadow-xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          boxShadow: '0 8px 40px rgba(99,102,241,0.5)',
        }}
      >
        Start Preparing →
      </motion.div>
    </div>
  )
}

/* ═══ MAIN PRODUCT DEMO ═══ */

export function ProductDemo() {
  const { isDark } = useTheme()
  const [scene, setScene] = useState(0)
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
      setScene(prev => (prev + 1) % SCENES.length)
    }, SCENE_DURATION)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isInView, isPaused])

  const current = SCENES[scene]
  const SceneComponent = current.elements

  return (
    <div ref={containerRef} className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      style={{
        boxShadow: isDark
          ? '0 20px 80px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.08)'
          : '0 20px 60px rgba(0,0,0,0.15)',
      }}>

      {/* Scene background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="relative"
          style={{
            background: current.bg,
            minHeight: '420px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Scene content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <SceneComponent />
            </motion.div>
          </AnimatePresence>

          {/* Title overlay */}
          <motion.div
            className="absolute left-0 right-0 top-8 z-20 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 150 }}
          >
            <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
              {current.title}
            </h2>
            <p className="mt-2 text-sm text-white/70 drop-shadow sm:text-base">
              {current.subtitle}
            </p>
          </motion.div>

          {/* Octo Guide */}
          <OctoGuide scene={scene} isDark={isDark} />
        </motion.div>
      </AnimatePresence>

      {/* Progress bar */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{
          background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)',
        }}>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
          }}
        >
          {isPaused ? '▶' : '⏸'}
        </button>

        {/* Scene dots */}
        <div className="flex items-center gap-2">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setScene(i)}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === scene ? '24px' : '8px',
                height: '8px',
                background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
              }}
            />
          ))}
        </div>

        <span className="text-xs font-medium" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>
          {scene + 1}/{SCENES.length}
        </span>
      </div>
    </div>
  )
}

export default ProductDemo
