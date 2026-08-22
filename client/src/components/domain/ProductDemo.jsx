import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const OCTO_IMG = '/mascot/octo-140.webp'

const SCENES = [
  { id: 'problem', duration: 5000, bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)' },
  { id: 'octo-helps', duration: 5000, bg: 'linear-gradient(135deg, #1a1a2e, #1e3a8a)' },
  { id: 'analyzing', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #1e40af)' },
  { id: 'planning', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #065f46)' },
  { id: 'quizzing', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #581c87)' },
  { id: 'adapting', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #9d174d)' },
  { id: 'success', duration: 5000, bg: 'linear-gradient(135deg, #0f172a, #4338ca)' },
]

/* ═══ SIMPLE ILLUSTRATED CHARACTERS ═══ */

function WorriedStudent() {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="160" height="180" viewBox="0 0 160 180">
        {/* Desk */}
        <rect x="10" y="140" width="140" height="8" rx="3" fill="#8b7355" />
        <rect x="20" y="148" width="5" height="22" rx="1" fill="#6b5b3f" />
        <rect x="135" y="148" width="5" height="22" rx="1" fill="#6b5b3f" />
        {/* Books */}
        <rect x="25" y="128" width="22" height="14" rx="2" fill="#1e40af" />
        <rect x="115" y="130" width="18" height="12" rx="2" fill="#dcfce7" />
        {/* Body */}
        <path d="M50 100 Q80 110 110 100 L115 140 Q80 145 45 140Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
        {/* Head */}
        <circle cx="80" cy="65" r="30" fill="#fcd5b8" />
        {/* Hair */}
        <path d="M50 55 Q55 28 80 25 Q105 28 110 55 L108 48 Q100 35 80 32 Q60 35 52 48Z" fill="#1f2937" />
        {/* Eyes */}
        <circle cx="70" cy="62" r="3" fill="#1f2937" />
        <circle cx="90" cy="62" r="3" fill="#1f2937" />
        {/* Worried eyebrows */}
        <path d="M62 54 Q70 50 78 54" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        <path d="M82 54 Q90 50 98 54" fill="none" stroke="#1f2937" strokeWidth="2" strokeLinecap="round" />
        {/* Worried mouth */}
        <path d="M70 78 Q80 72 90 78" fill="none" stroke="#9f1239" strokeWidth="2" strokeLinecap="round" />
        {/* Sweat */}
        <ellipse cx="112" cy="50" rx="3" ry="5" fill="#60a5fa" opacity="0.8" />
      </svg>
    </div>
  )
}

function HappyStudent() {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg width="160" height="180" viewBox="0 0 160 180">
        {/* Legs */}
        <line x1="60" y1="145" x2="50" y2="175" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
        <line x1="100" y1="145" x2="110" y2="175" stroke="#1e40af" strokeWidth="8" strokeLinecap="round" />
        {/* Shoes */}
        <ellipse cx="45" cy="178" rx="10" ry="5" fill="#1f2937" />
        <ellipse cx="115" cy="178" rx="10" ry="5" fill="#1f2937" />
        {/* Body */}
        <path d="M40 95 Q80 108 120 95 L125 145 Q80 150 35 145Z" fill="#f0f4ff" stroke="#e5e7eb" strokeWidth="1" />
        {/* Suspenders */}
        <line x1="55" y1="95" x2="50" y2="140" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        <line x1="105" y1="95" x2="110" y2="140" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
        {/* Arms up */}
        <line x1="40" y1="100" x2="15" y2="70" stroke="#f0f4ff" strokeWidth="10" strokeLinecap="round" />
        <line x1="120" y1="100" x2="145" y2="70" stroke="#f0f4ff" strokeWidth="10" strokeLinecap="round" />
        {/* Hands */}
        <circle cx="12" cy="68" r="6" fill="#fcd5b8" />
        <circle cx="148" cy="68" r="6" fill="#fcd5b8" />
        {/* Head */}
        <circle cx="80" cy="55" r="30" fill="#fcd5b8" />
        {/* Hair */}
        <path d="M50 45 Q55 18 80 15 Q105 18 110 45 L108 38 Q100 25 80 22 Q60 25 52 38Z" fill="#1f2937" />
        {/* Happy eyes */}
        <path d="M66 52 Q70 46 74 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M86 52 Q90 46 94 52" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        {/* Big smile */}
        <path d="M65 68 Q80 80 95 68" fill="none" stroke="#1f2937" strokeWidth="2.5" strokeLinecap="round" />
        {/* Blush */}
        <circle cx="58" cy="60" r="5" fill="#f9a8d4" opacity="0.4" />
        <circle cx="102" cy="60" r="5" fill="#f9a8d4" opacity="0.4" />
        {/* A+ paper */}
        <rect x="130" y="40" width="25" height="30" rx="2" fill="white" stroke="#e5e7eb" strokeWidth="1" />
        <text x="136" y="60" fontSize="12" fontWeight="bold" fill="#dc2626">A+</text>
      </svg>
    </div>
  )
}

/* ═══ SCENES ═══ */

function SceneProblem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      {/* Floating books */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '500px', marginBottom: '20px' }}>
        {[
          { label: 'DBMS', x: -180, y: -20, color: '#ef4444' },
          { label: 'OS', x: 180, y: -10, color: '#f97316' },
          { label: 'CN', x: -140, y: 30, color: '#eab308' },
          { label: 'Java', x: 160, y: 20, color: '#22c55e' },
        ].map((b, i) => (
          <motion.div key={b.label}
            style={{ position: 'absolute', left: `calc(50% + ${b.x}px)`, top: `${b.y}px`, textAlign: 'center' }}
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}
          >
            <div style={{ width: 36, height: 44, borderRadius: 6, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: `0 4px 12px ${b.color}40` }}>📖</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{b.label}</div>
          </motion.div>
        ))}
      </div>
      
      <WorriedStudent />
      
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        Too much to study?
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>So many subjects. So little time.</p>
    </div>
  )
}

function SceneOctoHelps() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Worried student left */}
        <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <WorriedStudent />
        </motion.div>
        
        {/* Octo flying in center */}
        <motion.div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
          <motion.div style={{ background: 'rgba(99,102,241,0.9)', borderRadius: 16, padding: '10px 16px', marginBottom: 8, color: 'white', fontSize: 13, maxWidth: 160, textAlign: 'center' }}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}>
            Don't worry! I've got you! 🐙
          </motion.div>
          <motion.img src={OCTO_IMG} alt="Octo" style={{ width: 100, height: 100, filter: 'drop-shadow(0 0 20px rgba(99,102,241,0.5))' }}
            animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </motion.div>
      </div>
      
      {/* Happy student appears below */}
      <motion.div style={{ marginTop: 20 }}
        initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, type: 'spring' }}>
        <HappyStudent />
      </motion.div>
      
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 16 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Octo analyzes & plans for you
      </motion.h2>
    </div>
  )
}

function SceneAnalyzing() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      {/* AI Brain */}
      <motion.div style={{ position: 'relative', marginBottom: 24 }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(99,102,241,0.5)', fontSize: 40 }}>🧠</div>
        <motion.div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid rgba(96,165,250,0.3)' }}
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
      </motion.div>
      
      {/* Documents */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 500 }}>
        {['📄 Syllabus', '📅 Exam Dates', '📊 Scores', '⏱ Time'].map((d, i) => (
          <motion.div key={d} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 16px', color: 'white', fontSize: 13, backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2 }}>
            {d}
          </motion.div>
        ))}
      </div>
      
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 32 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Analyzes your syllabus
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>Every topic. Every concept. Every gap.</p>
    </div>
  )
}

function ScenePlanning() {
  const blocks = [
    { label: 'DBMS → Normalization', time: '45 min', color: '#ef4444' },
    { label: 'CN → Routing', time: '30 min', color: '#f97316' },
    { label: 'Java → Collections', time: '25 min', color: '#8b5cf6' },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      <motion.div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 24, backdropFilter: 'blur(12px)', width: '100%', maxWidth: 300 }}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399', marginBottom: 12 }}>🗓 Your Smart Plan</div>
        {blocks.map((b, i) => (
          <motion.div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', marginBottom: 8, borderRadius: 8, background: `${b.color}15`, borderLeft: `3px solid ${b.color}` }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: b.color }} />
            <span style={{ color: 'white', fontSize: 13 }}>{b.label}</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{b.time}</span>
          </motion.div>
        ))}
      </motion.div>
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 24 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Creates your smart plan
      </motion.h2>
    </div>
  )
}

function SceneQuizzing() {
  const [sel, setSel] = useState(null)
  const [res, setRes] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setSel(1), 1200)
    const t2 = setTimeout(() => setRes(true), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      <motion.div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', width: '100%', maxWidth: 340 }}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><span style={{ fontSize: 18 }}>🎯</span><span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>AI Quiz</span></div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 12 }}>Which normal form eliminates transitive dependencies?</p>
        {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
          <motion.div key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', marginBottom: 6, borderRadius: 8, background: res && i === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{String.fromCharCode(65+i)}</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>{opt}</span>
            {res && i === 1 && <span style={{ marginLeft: 'auto' }}>✅</span>}
          </motion.div>
        ))}
      </motion.div>
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 24 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Tests your knowledge
      </motion.h2>
    </div>
  )
}

function SceneAdapting() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        <motion.div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 16, backdropFilter: 'blur(8px)', minWidth: 140 }}
          initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>Before</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>SQL: 45 min</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Normalization: 20 min</div>
        </motion.div>
        <motion.div style={{ fontSize: 36 }}
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.div>
        <motion.div style={{ background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 12, padding: 16, backdropFilter: 'blur(8px)', minWidth: 140 }}
          initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#f472b6', marginBottom: 8 }}>After Quiz</div>
          <div style={{ color: '#f472b6', fontSize: 12 }}>Normalization: 50 min ↑</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>SQL: 30 min</div>
        </motion.div>
      </div>
      <motion.div style={{ marginTop: 20, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '8px 16px', color: '#f87171', fontSize: 13 }}
        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
        🔍 Weak topic detected → Plan updated!
      </motion.div>
      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 24 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Automatically adapts
      </motion.h2>
    </div>
  )
}

function SceneSuccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: '400px', position: 'relative' }}>
      {/* Confetti */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div key={i} style={{ position: 'absolute', width: 5, height: 5, borderRadius: '50%', background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][i % 4], left: `${10 + (i * 7)}%`, top: `${10 + (i * 5)}%` }}
          animate={{ y: [0, -60], opacity: [1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }} />
      ))}
      
      <HappyStudent />
      
      <motion.div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 16 }}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
        <img src={OCTO_IMG} alt="Octo" style={{ width: 80, height: 80, filter: 'drop-shadow(0 0 30px rgba(99,102,241,0.5))' }} />
      </motion.div>
      
      <motion.h2 style={{ color: 'white', fontSize: 36, fontWeight: 'bold', marginTop: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        Stop guessing.
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, marginTop: 8 }}>
        Start preparing with a system that adapts to you.
      </p>
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

  const scenes = [SceneProblem, SceneOctoHelps, SceneAnalyzing, ScenePlanning, SceneQuizzing, SceneAdapting, SceneSuccess]
  const Comp = scenes[scene]
  const cur = SCENES[scene]

  return (
    <div ref={ref} style={{ maxWidth: 900, margin: '0 auto', borderRadius: 24, overflow: 'hidden', boxShadow: isDark ? '0 20px 80px rgba(99,102,241,0.2)' : '0 20px 60px rgba(0,0,0,0.15)' }}>
      <AnimatePresence mode="wait">
        <motion.div key={scene} style={{ background: cur.bg, minHeight: 480 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
          <Comp />
        </motion.div>
      </AnimatePresence>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)' }}>
        <button onClick={() => setPaused(!paused)} style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: 14 }}>
          {paused ? '▶' : '⏸'}
        </button>
        <div style={{ display: 'flex', gap: 6 }}>
          {SCENES.map((_, i) => (
            <button key={i} onClick={() => setScene(i)}
              style={{ width: i === scene ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'), cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: isDark ? '#64748b' : '#9ca3af' }}>{scene + 1}/{SCENES.length}</span>
      </div>
    </div>
  )
}

export default ProductDemo
