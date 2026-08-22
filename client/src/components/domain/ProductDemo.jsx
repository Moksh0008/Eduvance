import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const OCTO_IMG = '/mascot/octo-140.webp'

const SCENES = [
  { id: 'problem', duration: 5000, bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)', elements: SceneProblem },
  { id: 'octo-helps', duration: 5000, bg: 'linear-gradient(135deg, #1a1a2e, #1e3a8a)', elements: SceneOctoHelps },
  { id: 'analyzing', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #1e40af)', elements: SceneAnalyzing },
  { id: 'planning', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #065f46)', elements: ScenePlanning },
  { id: 'quizzing', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #581c87)', elements: SceneQuizzing },
  { id: 'adapting', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #9d174d)', elements: SceneAdapting },
  { id: 'success', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #4338ca)', elements: SceneSuccess },
]

/* ═══ WORRIED STUDENT ═══ */
function WorriedStudent({ size = 200 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 200 200" fill="none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Desk */}
      <rect x="20" y="155" width="160" height="10" rx="3" fill="#8b7355" />
      <rect x="30" y="165" width="6" height="25" rx="2" fill="#6b5b3f" />
      <rect x="164" y="165" width="6" height="25" rx="2" fill="#6b5b3f" />
      {/* Books */}
      <rect x="35" y="142" width="28" height="15" rx="2" fill="#1e40af" />
      <rect x="137" y="144" width="22" height="12" rx="2" fill="#dcfce7" />
      {/* Open book */}
      <path d="M70 148 L100 143 L130 148 L130 154 L100 149 L70 154Z" fill="#fef3c7" stroke="#d97706" strokeWidth="0.5" />
      {/* Body - white shirt */}
      <path d="M65 120 Q100 130 135 120 L140 155 Q100 160 60 155Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
      {/* Collar */}
      <path d="M80 120 L100 126 L120 120" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Head */}
      <ellipse cx="100" cy="82" rx="35" ry="38" fill="#fcd5b8" />
      {/* Hair */}
      <path d="M65 68 Q70 35 100 30 Q130 35 135 68 L132 60 Q125 42 100 38 Q75 42 68 60Z" fill="#1f2937" />
      {/* Eyes - worried */}
      <ellipse cx="87" cy="80" rx="4" ry="5" fill="#1f2937" />
      <ellipse cx="113" cy="80" rx="4" ry="5" fill="#1f2937" />
      {/* Eyebrows - worried up */}
      <path d="M78 70 Q87 65 96 70" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M104 70 Q113 65 122 70" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
      {/* Mouth - worried frown */}
      <path d="M88 100 Q100 93 112 100" fill="none" stroke="#9f1239" strokeWidth="2.5" strokeLinecap="round" />
      {/* Sweat */}
      <motion.ellipse cx="138" cy="65" rx="4" ry="6" fill="#60a5fa"
        animate={{ opacity: [0.9, 0.3, 0.9], y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {/* Confusion scribble */}
      <motion.g animate={{ rotate: [0, 8, -8, 0], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }} style={{ transformOrigin: '100px 25px' }}>
        <path d="M85 30 Q90 18 95 25 Q100 12 105 22 Q110 15 115 28" 
          fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </motion.svg>
  )
}

/* ═══ HAPPY STUDENT ═══ */
function HappyStudent({ size = 200 }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 200 200" fill="none"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      {/* Legs */}
      <path d="M75 160 L65 190" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />
      <path d="M125 160 L135 190" stroke="#1e40af" strokeWidth="10" strokeLinecap="round" />
      {/* Shoes */}
      <ellipse cx="60" cy="193" rx="12" ry="6" fill="#1f2937" />
      <ellipse cx="140" cy="193" rx="12" ry="6" fill="#1f2937" />
      {/* Body - white shirt + yellow suspenders */}
      <path d="M55 110 Q100 122 145 110 L150 160 Q100 165 50 160Z" fill="#f0f4ff" stroke="#e5e7eb" strokeWidth="1" />
      <path d="M68 110 L62 155" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      <path d="M132 110 L138 155" stroke="#fbbf24" strokeWidth="5" strokeLinecap="round" />
      <rect x="60" y="148" width="80" height="6" rx="2" fill="#1f2937" />
      {/* Arms - celebration up */}
      <path d="M55 115 Q25 90 18 65" fill="none" stroke="#f0f4ff" strokeWidth="12" strokeLinecap="round" />
      <path d="M145 115 Q175 90 182 65" fill="none" stroke="#f0f4ff" strokeWidth="12" strokeLinecap="round" />
      {/* Hands */}
      <circle cx="15" cy="62" r="8" fill="#fcd5b8" />
      <circle cx="185" cy="62" r="8" fill="#fcd5b8" />
      {/* Peace sign */}
      <path d="M185 62 L188 48 M185 62 L192 52" stroke="#fcd5b8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Head */}
      <ellipse cx="100" cy="72" rx="35" ry="38" fill="#fcd5b8" />
      {/* Hair */}
      <path d="M65 58 Q70 25 100 22 Q130 25 135 58 L132 50 Q125 35 100 32 Q75 35 68 50Z" fill="#1f2937" />
      {/* Eyes - happy crescents */}
      <path d="M83 70 Q87 64 91 70" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      <path d="M109 70 Q113 64 117 70" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      {/* Big smile */}
      <path d="M82 88 Q100 102 118 88" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="75" cy="80" rx="7" ry="5" fill="#f9a8d4" opacity="0.4" />
      <ellipse cx="125" cy="80" rx="7" ry="5" fill="#f9a8d4" opacity="0.4" />
      {/* A+ paper */}
      <motion.g animate={{ rotate: [-5, 5, -5] }} transition={{ duration: 1.5, repeat: Infinity }}
        style={{ transformOrigin: '185px 62px' }}>
        <rect x="165" y="38" width="32" height="40" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <text x="174" y="62" fontSize="16" fontWeight="bold" fill="#dc2626" fontFamily="sans-serif">A+</text>
        <line x1="170" y1="68" x2="192" y2="68" stroke="#d1d5db" strokeWidth="1" />
        <line x1="170" y1="72" x2="185" y2="72" stroke="#d1d5db" strokeWidth="1" />
      </motion.g>
    </motion.svg>
  )
}

/* ═══ OCTO MASCOT ═══ */
function OctoMascot({ size = 120, message = '', delay = 0 }) {
  return (
    <motion.div
      className="flex items-end gap-3"
      initial={{ opacity: 0, x: 100, scale: 0.3 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.3 }}
      transition={{ delay, type: 'spring', stiffness: 80, damping: 12 }}
    >
      {message && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.3 }}
          className="max-w-[180px] rounded-2xl rounded-br-sm px-4 py-3 text-sm text-white shadow-xl"
          style={{ background: 'rgba(99,102,241,0.9)', boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }}
        >
          {message}
          <div className="absolute -bottom-1.5 right-4 h-0 w-0" style={{
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderTop: '7px solid rgba(99,102,241,0.9)',
          }} />
        </motion.div>
      )}
      <motion.img src={OCTO_IMG} alt="Octo"
        style={{ width: size, height: size, filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.5))' }}
        animate={{ y: [0, -8, 0], rotate: [0, -5, 5, 0] }}
        transition={{ y: { duration: 2.5, repeat: Infinity }, rotate: { duration: 4, repeat: Infinity } }}
      />
    </motion.div>
  )
}

/* ═══ FLOATING BOOK ═══ */
function Book({ label, x, y, color, delay = 0 }) {
  return (
    <motion.div className="absolute flex flex-col items-center"
      style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
      initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 120 }}
    >
      <motion.div className="flex h-14 w-10 items-center justify-center rounded-lg text-lg shadow-xl"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 4px 20px ${color}40` }}
        animate={{ rotate: [0, -5, 5, 0], y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
      >📖</motion.div>
      <span className="mt-1 text-[10px] font-medium text-white/70">{label}</span>
    </motion.div>
  )
}

/* ═══ SCENE 1: PROBLEM - Worried student with books ═══ */
function SceneProblem() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      {/* Books floating around */}
      {[
        { label: 'DBMS', x: -220, y: -80, color: '#ef4444', delay: 0.1 },
        { label: 'OS', x: 200, y: -60, color: '#f97316', delay: 0.2 },
        { label: 'CN', x: -180, y: 40, color: '#eab308', delay: 0.3 },
        { label: 'Java', x: 220, y: 60, color: '#22c55e', delay: 0.4 },
      ].map(b => <Book key={b.label} {...b} />)}
      
      {/* Clock + skull */}
      <motion.div className="absolute left-[20%] top-[20%] text-4xl"
        animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⏰</motion.div>
      <motion.div className="absolute right-[18%] top-[22%] text-3xl"
        animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>💀</motion.div>
      
      {/* Worried student - BIG and CENTERED */}
      <WorriedStudent size={220} />
      
      <h2 className="mt-6 text-3xl font-bold text-white drop-shadow-lg">Too much to study?</h2>
      <p className="mt-2 text-white/60">So many subjects. So little time.</p>
    </div>
  )
}

/* ═══ SCENE 2: OCTO HELPS - Octo appears, student becomes happy ═══ */
function SceneOctoHelps() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      {/* Left side: worried student */}
      <motion.div className="absolute left-[10%] top-[30%]"
        animate={{ x: [-10, 0, -10] }} transition={{ duration: 3, repeat: Infinity }}>
        <WorriedStudent size={140} />
      </motion.div>
      
      {/* Arrow from Octo to student */}
      <motion.div className="absolute left-[42%] top-[45%] text-4xl"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: [1, 1.2, 1] }}
        transition={{ delay: 1, duration: 1.5, repeat: Infinity }}>✨</motion.div>
      
      {/* Right side: Octo flying in to help */}
      <motion.div className="absolute right-[8%] top-[25%]"
        initial={{ x: 200, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 60 }}>
        <OctoMascot size={140} message="Don't worry! I've got you! 🐙" delay={0.8} />
      </motion.div>
      
      {/* Bottom: Happy student appears */}
      <motion.div className="absolute bottom-[15%] left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 80 }}>
        <HappyStudent size={160} />
      </motion.div>
      
      <h2 className="absolute bottom-[3%] left-0 right-0 text-center text-3xl font-bold text-white">
        Octo analyzes & plans for you
      </h2>
    </div>
  )
}

/* ═══ SCENE 3: ANALYZING ═══ */
function SceneAnalyzing() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      {/* AI Brain */}
      <motion.div className="absolute left-1/2 top-[35%] -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <div className="relative flex items-center justify-center rounded-full"
          style={{ width: 120, height: 120, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 60px rgba(99,102,241,0.5)' }}>
          <span className="text-5xl">🧠</span>
          <motion.div className="absolute inset-0 rounded-full border-2 border-blue-400/30"
            style={{ width: 160, height: 160, left: -20, top: -20 }}
            animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
        </div>
      </motion.div>
      
      {/* Docs flying in */}
      {[
        { label: '📄 Syllabus', x: -200, y: -30, delay: 0.5 },
        { label: '📅 Exam Dates', x: 200, y: -10, delay: 0.7 },
        { label: '📊 Scores', x: -180, y: 50, delay: 0.9 },
        { label: '⏱ Time', x: 180, y: 30, delay: 1.1 },
      ].map(d => (
        <motion.div key={d.label} className="absolute rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
          style={{ left: `calc(50% + ${d.x}px)`, top: `calc(45% + ${d.y}px)` }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scale: [0, 1, 1, 0.5], x: [0, -d.x * 0.4], y: [0, -d.y * 0.4] }}
          transition={{ delay: d.delay, duration: 2, repeat: Infinity, repeatDelay: 1 }}
        >{d.label}</motion.div>
      ))}
      
      <h2 className="absolute bottom-[5%] left-0 right-0 text-center text-3xl font-bold text-white">
        Analyzes your syllabus
      </h2>
    </div>
  )
}

/* ═══ SCENE 4: PLANNING ═══ */
function ScenePlanning() {
  const blocks = [
    { label: 'DBMS → Normalization', time: '45 min', color: '#ef4444' },
    { label: 'CN → Routing', time: '30 min', color: '#f97316' },
    { label: 'Java → Collections', time: '25 min', color: '#8b5cf6' },
  ]
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      <motion.div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-green-400">🗓 Your Smart Plan</div>
        {blocks.map((b, i) => (
          <motion.div key={b.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
            className="mb-2 flex items-center gap-3 rounded-lg p-3" style={{ background: `${b.color}15`, borderLeft: `3px solid ${b.color}` }}>
            <div className="h-2 w-2 rounded-full" style={{ background: b.color }} />
            <span className="text-sm text-white">{b.label}</span>
            <span className="ml-auto text-xs text-white/60">{b.time}</span>
          </motion.div>
        ))}
      </motion.div>
      <h2 className="mt-8 text-3xl font-bold text-white">Creates your smart plan</h2>
    </div>
  )
}

/* ═══ SCENE 5: QUIZZING ═══ */
function SceneQuizzing() {
  const [sel, setSel] = useState(null)
  const [res, setRes] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setSel(1), 1200)
    const t2 = setTimeout(() => setRes(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      <motion.div className="w-[320px] rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div className="mb-2 flex items-center gap-2"><span className="text-lg">🎯</span><span className="text-xs font-semibold text-purple-400">AI Quiz</span></div>
        <p className="mb-3 text-sm text-white/90">Which normal form eliminates transitive dependencies?</p>
        {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
          <motion.div key={opt} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
            className="mb-2 flex items-center gap-2 rounded-lg p-2 text-sm" style={{
              background: res && i === 1 ? 'rgba(34,197,94,0.2)' : res && i === sel && i !== 1 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] font-bold text-white">{String.fromCharCode(65+i)}</span>
            <span className="text-white/90">{opt}</span>
            {res && i === 1 && <span className="ml-auto">✅</span>}
          </motion.div>
        ))}
      </motion.div>
      <h2 className="mt-8 text-3xl font-bold text-white">Tests your knowledge</h2>
    </div>
  )
}

/* ═══ SCENE 6: ADAPTING ═══ */
function SceneAdapting() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      <div className="flex items-center gap-8">
        <motion.div className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">Before</div>
          <div className="space-y-1 text-xs text-white/70"><div>SQL: 45 min</div><div>Normalization: 20 min</div></div>
        </motion.div>
        <motion.div className="text-4xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.div>
        <motion.div className="rounded-xl border border-pink-500/20 bg-pink-500/10 p-4 backdrop-blur-xl"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-pink-400">After</div>
          <div className="space-y-1 text-xs"><div className="text-pink-400">Normalization: 50 min ↑</div><div className="text-white/70">SQL: 30 min</div></div>
        </motion.div>
      </div>
      <motion.div className="mt-6 rounded-full bg-red-500/20 px-4 py-2 text-sm text-red-400"
        style={{ border: '1px solid rgba(239,68,68,0.3)' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        🔍 Weak topic detected → Plan updated!
      </motion.div>
      <h2 className="mt-8 text-3xl font-bold text-white">Automatically adapts</h2>
    </div>
  )
}

/* ═══ SCENE 7: SUCCESS ═══ */
function SceneSuccess() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center pt-16">
      {/* Particles */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ width: 4 + Math.random() * 5, height: 4 + Math.random() * 5, background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][i % 4], left: `${Math.random() * 100}%`, top: `${Math.random() * 80}%` }}
          animate={{ y: [0, -80 - Math.random() * 150], opacity: [1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 2, repeat: Infinity }}
        />
      ))}
      <HappyStudent size={200} />
      <motion.div className="absolute bottom-[25%] right-[12%]"
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}>
        <img src={OCTO_IMG} alt="Octo" className="h-24 w-24" style={{ filter: 'drop-shadow(0 0 40px rgba(99,102,241,0.5))' }} />
      </motion.div>
      <h2 className="mt-6 text-4xl font-bold text-white drop-shadow-lg">Stop guessing.</h2>
      <p className="mt-2 text-lg text-white/70">Start preparing with a system that adapts to you.</p>
    </div>
  )
}

/* ═══ MAIN ═══ */
export function ProductDemo() {
  const { isDark } = useTheme()
  const [scene, setScene] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible || paused) { clearInterval(timer.current); return }
    timer.current = setInterval(() => setScene(p => (p + 1) % SCENES.length), SCENES[scene].duration)
    return () => clearInterval(timer.current)
  }, [visible, paused, scene])

  const cur = SCENES[scene]
  const Comp = cur.elements

  return (
    <div ref={ref} className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl"
      style={{ boxShadow: isDark ? '0 20px 80px rgba(99,102,241,0.2)' : '0 20px 60px rgba(0,0,0,0.15)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} className="relative" style={{ background: cur.bg, minHeight: '480px' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <motion.div key={scene} className="relative h-full w-full"
            initial={{ opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, filter: 'blur(8px)' }} transition={{ duration: 0.6 }}>
            <Comp />
          </motion.div>
        </motion.div>
      </AnimatePresence>
      <div className="flex items-center justify-between px-6 py-4"
        style={{ background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)' }}>
        <button onClick={() => setPaused(!paused)} className="flex h-8 w-8 items-center justify-center rounded-full text-sm"
          style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
          {paused ? '▶' : '⏸'}
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Demo scenes">
          {SCENES.map((s, i) => (
            <button key={s.id} onClick={() => setScene(i)} role="tab" aria-selected={i === scene} aria-label={`Scene ${i+1}`}
              className="rounded-full transition-all duration-500"
              style={{ width: i === scene ? '24px' : '8px', height: '8px', background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)') }} />
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>{scene + 1}/{SCENES.length}</span>
      </div>
    </div>
  )
}

export default ProductDemo
