import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════
   CINEMATIC EXPLAINER — Animated Motion Graphics
   NOT actual app screens — illustrated concepts
   ═══════════════════════════════════════════════════ */

const OCTO_IMG = '/mascot/octo-140.webp'

const SCENES = [
  {
    id: 'problem',
    duration: 5000,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    elements: SceneProblem,
  },
  {
    id: 'confused',
    duration: 5000,
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 50%, #11001c 100%)',
    elements: SceneConfused,
  },
  {
    id: 'ai-arrives',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0ea5e9 100%)',
    elements: SceneAIArrives,
  },
  {
    id: 'analyzing',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)',
    elements: SceneAnalyzing,
  },
  {
    id: 'planning',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #065f46 50%, #10b981 100%)',
    elements: ScenePlanning,
  },
  {
    id: 'quizzing',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #a855f7 100%)',
    elements: SceneQuizzing,
  },
  {
    id: 'adapting',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #9d174d 50%, #ec4899 100%)',
    elements: SceneAdapting,
  },
  {
    id: 'success',
    duration: 5000,
    bg: 'linear-gradient(135deg, #0f172a 0%, #4338ca 50%, #6366f1 100%)',
    elements: SceneSuccess,
  },
]

/* ═══ ILLUSTRATED STUDENT CHARACTER ═══ */
function StudentCharacter({ mood = 'neutral', x = 0, y = 0, scale = 1, delay = 0 }) {
  const face = {
    happy: '😊',
    stressed: '😰',
    confused: '😵',
    thinking: '🤔',
    excited: '🤩',
    neutral: '😐',
  }[mood] || '😐'

  return (
    <motion.div
      className="absolute"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, y: 30 }}
      animate={{ opacity: 1, scale, y: 0 }}
      exit={{ opacity: 0, scale: 0, y: -30 }}
      transition={{ delay, type: 'spring', stiffness: 100, damping: 10 }}
    >
      {/* Body */}
      <div className="relative flex flex-col items-center">
        {/* Head */}
        <motion.div
          className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            boxShadow: '0 4px 20px rgba(251,191,36,0.3)',
          }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {face}
        </motion.div>
        {/* Body */}
        <div className="mt-1 flex h-12 w-20 items-center justify-center rounded-t-3xl"
          style={{ background: 'linear-gradient(180deg, #6366f1, #4f46e5)' }}>
          <div className="text-xl">👕</div>
        </div>
      </div>
    </motion.div>
  )
}

/* ═══ FLOATING BOOK ═══ */
function FloatingBook({ label, delay = 0, x = 0, y = 0, color = '#ef4444' }) {
  return (
    <motion.div
      className="absolute flex flex-col items-center"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: 'translate(-50%, -50%)' }}
      initial={{ opacity: 0, scale: 0, rotate: -20 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
    >
      <motion.div
        className="flex h-14 w-10 items-center justify-center rounded-lg text-lg shadow-xl"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 4px 20px ${color}40`,
        }}
        animate={{ rotate: [0, -5, 5, 0], y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      >
        📖
      </motion.div>
      <span className="mt-1 text-[10px] font-medium text-white/70">{label}</span>
    </motion.div>
  )
}

/* ═══ AI BRAIN ═══ */
function AIBrain({ size = 120, delay = 0 }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ delay, type: 'spring', stiffness: 80, damping: 8 }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute rounded-full border-2 border-blue-400/30"
        style={{ width: size + 40, height: size + 40 }}
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
      />
      {/* Inner ring */}
      <motion.div
        className="absolute rounded-full border-2 border-purple-400/20"
        style={{ width: size + 20, height: size + 20 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      />
      {/* Brain circle */}
      <motion.div
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          boxShadow: '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
        }}
        animate={{
          boxShadow: [
            '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
            '0 0 80px rgba(99,102,241,0.6), 0 0 160px rgba(99,102,241,0.3)',
            '0 0 60px rgba(99,102,241,0.4), 0 0 120px rgba(99,102,241,0.2)',
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-4xl">🧠</span>
      </motion.div>
      {/* Orbiting dots */}
      {[0, 1, 2, 3, 4, 5].map(i => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-400"
          style={{
            width: 6,
            height: 6,
            background: ['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][i],
            boxShadow: `0 0 8px ${['#60a5fa', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#f87171'][i]}`,
          }}
          animate={{
            rotate: [i * 60, i * 60 + 360],
            x: [Math.cos(i * 60 * Math.PI / 180) * (size / 2 + 30), Math.cos((i * 60 + 360) * Math.PI / 180) * (size / 2 + 30)],
            y: [Math.sin(i * 60 * Math.PI / 180) * (size / 2 + 30), Math.sin((i * 60 + 360) * Math.PI / 180) * (size / 2 + 30)],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
        />
      ))}
    </motion.div>
  )
}

/* ═══ SCENE 1: PROBLEM ═══ */
function SceneProblem() {
  return (
    <div className="relative h-full w-full">
      {/* Scattered books flying around */}
      {[
        { label: 'DBMS', x: -200, y: -80, color: '#ef4444', delay: 0.1 },
        { label: 'OS', x: 180, y: -60, color: '#f97316', delay: 0.2 },
        { label: 'CN', x: -150, y: 80, color: '#eab308', delay: 0.3 },
        { label: 'Java', x: 200, y: 60, color: '#22c55e', delay: 0.4 },
        { label: 'SE', x: -80, y: -120, color: '#3b82f6', delay: 0.5 },
        { label: 'AI', x: 100, y: 120, color: '#8b5cf6', delay: 0.6 },
      ].map(book => (
        <FloatingBook key={book.label} {...book} />
      ))}

      {/* Stressed student in center */}
      <StudentCharacter mood="stressed" scale={1.2} delay={0.3} />

      {/* Title */}
      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">
          Too much to study?
        </h2>
        <p className="mt-2 text-white/60">So many subjects. So little time.</p>
      </motion.div>

      {/* Panic indicators */}
      <motion.div
        className="absolute left-[15%] top-[20%] text-4xl"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⏰
      </motion.div>
      <motion.div
        className="absolute right-[15%] top-[25%] text-3xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        💀
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 2: CONFUSED ═══ */
function SceneConfused() {
  return (
    <div className="relative h-full w-full">
      <StudentCharacter mood="confused" scale={1.3} delay={0.2} />

      {/* Floating question marks */}
      {[
        { x: -120, y: -60, delay: 0.3, size: 'text-4xl' },
        { x: 140, y: -40, delay: 0.5, size: 'text-3xl' },
        { x: -80, y: 70, delay: 0.7, size: 'text-2xl' },
        { x: 100, y: 90, delay: 0.9, size: 'text-5xl' },
      ].map((q, i) => (
        <motion.div
          key={i}
          className={`absolute ${q.size} font-bold text-yellow-400/30`}
          style={{ left: `calc(50% + ${q.x}px)`, top: `calc(50% + ${q.y}px)` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: q.delay }}
        >
          ?
        </motion.div>
      ))}

      {/* Thought bubbles */}
      {['What to study first?', 'How much time left?', 'Am I even ready?'].map((text, i) => (
        <motion.div
          key={text}
          className="absolute rounded-full bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-sm"
          style={{
            left: `${20 + i * 25}%`,
            top: `${15 + i * 10}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.3, type: 'spring' }}
        >
          {text}
        </motion.div>
      ))}

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          No idea where to start?
        </h2>
        <p className="mt-2 text-white/60">You're not alone.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 3: AI ARRIVES ═══ */
function SceneAIArrives() {
  return (
    <div className="relative h-full w-full">
      <StudentCharacter mood="thinking" x={-160} y={20} scale={1} delay={0.3} />

      {/* AI Brain flying in */}
      <motion.div
        className="absolute"
        style={{ left: 'calc(50% + 120px)', top: 'calc(50% + 20px)', transform: 'translate(-50%, -50%)' }}
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 60 }}
      >
        <AIBrain size={100} delay={0.8} />
      </motion.div>

      {/* Connection line */}
      <motion.div
        className="absolute"
        style={{
          left: 'calc(50% - 40px)',
          top: 'calc(50% + 20px)',
          width: '100px',
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #6366f1, transparent)',
          transformOrigin: 'left center',
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      />

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Meet your AI study companion
        </h2>
        <p className="mt-2 text-white/60">Eduvance analyzes everything for you.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 4: ANALYZING ═══ */
function SceneAnalyzing() {
  return (
    <div className="relative h-full w-full">
      <AIBrain size={90} delay={0.2} />

      {/* Documents flying into brain */}
      {[
        { label: '📄 Syllabus', x: -200, y: -60, delay: 0.5 },
        { label: '📅 Exam Dates', x: 200, y: -40, delay: 0.7 },
        { label: '📊 Past Scores', x: -180, y: 80, delay: 0.9 },
        { label: '⏱ Study Time', x: 180, y: 60, delay: 1.1 },
      ].map((doc, i) => (
        <motion.div
          key={doc.label}
          className="absolute rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          style={{ left: `calc(50% + ${doc.x}px)`, top: `calc(50% + ${doc.y}px)` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0.5],
            x: [0, -doc.x * 0.4],
            y: [0, -doc.y * 0.4],
          }}
          transition={{ delay: doc.delay, duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >
          {doc.label}
        </motion.div>
      ))}

      {/* Scanning lines */}
      <motion.div
        className="absolute left-[20%] right-[20%] h-[1px]"
        style={{
          top: '50%',
          background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)',
          boxShadow: '0 0 20px #3b82f6',
        }}
        animate={{
          top: ['30%', '70%', '30%'],
          opacity: [0, 0.8, 0],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Analyzes your syllabus
        </h2>
        <p className="mt-2 text-white/60">Every topic. Every concept. Every gap.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 5: PLANNING ═══ */
function ScenePlanning() {
  const blocks = [
    { label: 'DBMS', time: '45 min', color: '#ef4444', x: -100, y: -50 },
    { label: 'CN', time: '30 min', color: '#f97316', x: 0, y: 0 },
    { label: 'Java', time: '25 min', color: '#8b5cf6', x: 100, y: 50 },
  ]

  return (
    <div className="relative h-full w-full">
      {/* Calendar visualization */}
      <motion.div
        className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: 'spring' }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-green-400">Today's Plan</div>
          {blocks.map((block, i) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.2, type: 'spring' }}
              className="mb-2 flex items-center gap-3 rounded-lg p-2"
              style={{ background: `${block.color}15`, borderLeft: `3px solid ${block.color}` }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: block.color }} />
              <span className="text-sm text-white">{block.label}</span>
              <span className="ml-auto text-xs text-white/60">{block.time}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Floating student excited */}
      <StudentCharacter mood="excited" x={-200} y={80} scale={0.9} delay={0.5} />

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Creates your smart plan
        </h2>
        <p className="mt-2 text-white/60">Personalized. Optimized. Adaptive.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 6: QUIZZING ═══ */
function SceneQuizzing() {
  const [selected, setSelected] = useState(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSelected(1), 1500)
    const t2 = setTimeout(() => setShowResult(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div className="relative h-full w-full">
      {/* Quiz card floating in space */}
      <motion.div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
      >
        <div className="w-[320px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            <span className="text-xs font-semibold text-purple-400">AI-Generated Question</span>
          </div>
          <p className="mb-4 text-sm text-white/90">
            Which normal form eliminates transitive dependencies?
          </p>
          {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
            <motion.div
              key={opt}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.15 }}
              onClick={() => !showResult && setSelected(i)}
              className="mb-2 flex cursor-pointer items-center gap-2 rounded-lg p-2 text-sm transition-all"
              style={{
                background: showResult && i === 2 ? 'rgba(34,197,94,0.2)' : showResult && i === selected && i !== 2 ? 'rgba(239,68,68,0.2)' : selected === i ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${selected === i ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-white/90">{opt}</span>
              {showResult && i === 2 && <span className="ml-auto">✅</span>}
              {showResult && i === selected && i !== 2 && <span className="ml-auto">❌</span>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <StudentCharacter mood="thinking" x={-220} y={60} scale={0.8} delay={0.5} />

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Tests your knowledge
        </h2>
        <p className="mt-2 text-white/60">Every question targets YOUR weak areas.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 7: ADAPTING ═══ */
function SceneAdapting() {
  return (
    <div className="relative h-full w-full">
      {/* Before → After transformation */}
      <motion.div
        className="absolute left-[15%] top-[35%]"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Before</div>
          <div className="space-y-1 text-xs text-white/70">
            <div>SQL: 45 min</div>
            <div>Normalization: 20 min</div>
            <div>Transactions: 30 min</div>
          </div>
        </div>
      </motion.div>

      {/* Animated arrow */}
      <motion.div
        className="absolute left-1/2 top-[40%] -translate-x-1/2 text-5xl"
        animate={{ x: [0, 20, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ⚡
      </motion.div>

      <motion.div
        className="absolute right-[15%] top-[35%]"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 backdrop-blur-xl">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-pink-400">After Quiz</div>
          <div className="space-y-1 text-xs">
            <div className="text-pink-400">Normalization: 50 min ↑</div>
            <div className="text-white/70">SQL: 30 min</div>
            <div className="text-white/70">Transactions: 15 min</div>
          </div>
        </div>
      </motion.div>

      {/* Detected badge */}
      <motion.div
        className="absolute left-1/2 top-[55%] -translate-x-1/2 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-400"
        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        🔍 Weak topic detected → Plan updated!
      </motion.div>

      <motion.div
        className="absolute bottom-[12%] left-0 right-0 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Automatically adapts
        </h2>
        <p className="mt-2 text-white/60">The more you quiz, the smarter it gets.</p>
      </motion.div>
    </div>
  )
}

/* ═══ SCENE 8: SUCCESS ═══ */
function SceneSuccess() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* Celebration particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'][i % 5],
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100 - Math.random() * 200],
            x: [(Math.random() - 0.5) * 100],
            opacity: [1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 2,
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}

      {/* Octo big and happy */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 60, damping: 8, delay: 0.3 }}
      >
        <img src={OCTO_IMG} alt="Octo" className="h-32 w-32" width="128" height="128"
          style={{ filter: 'drop-shadow(0 0 60px rgba(99,102,241,0.5))' }} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <h2 className="text-5xl font-bold text-white drop-shadow-lg">
          Stop guessing.
        </h2>
        <p className="mt-3 text-xl text-white/70">
          Start preparing with a system that adapts to you.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="mt-10 rounded-full px-10 py-4 text-lg font-bold text-white shadow-2xl"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
          boxShadow: '0 8px 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.2)',
        }}
      >
        Start Preparing →
      </motion.div>
    </div>
  )
}

/* ═══ MAIN CINEMATIC EXPLAINER ═══ */

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
    }, SCENES[scene].duration)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isInView, isPaused, scene])

  const current = SCENES[scene]
  const SceneComponent = current.elements

  return (
    <div ref={containerRef} className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      style={{
        boxShadow: isDark
          ? '0 20px 80px rgba(99,102,241,0.2), 0 0 120px rgba(99,102,241,0.08)'
          : '0 20px 60px rgba(0,0,0,0.15)',
      }}>

      <AnimatePresence mode="wait">
        <motion.div
          key={scene}
          className="relative"
          style={{ background: current.bg, minHeight: '450px' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={scene}
              className="relative h-full w-full"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <SceneComponent />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)' }}>
        <button onClick={() => setIsPaused(!isPaused)}
          className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          {isPaused ? '▶' : '⏸'}
        </button>

        <div className="flex items-center gap-2" role="tablist" aria-label="Demo scenes">
          {SCENES.map((s, i) => (
            <button key={s.id} onClick={() => setScene(i)}
              role="tab"
              aria-selected={i === scene}
              aria-label={`Scene ${i + 1}: ${s.id}`}
              className="rounded-full transition-all duration-500"
              style={{
                width: i === scene ? '24px' : '8px',
                height: '8px',
                background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'),
              }} />
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
