import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

const OCTO_IMG = '/mascot/octo-140.webp'

/* ═══ CHARACTER IMAGES ═══ */
const CHARS = {
  worried: '/characters/worried-desk.png',
  thinking: '/characters/thinking.png',
  happy: '/characters/happy.png',
  studying: '/characters/studying.png',
  celebrating: '/characters/celebrating.png',
}

const SCENES = [
  { id: 'problem', duration: 5500, bg: 'linear-gradient(135deg, #1a1a2e, #0f3460)' },
  { id: 'octo-helps', duration: 5500, bg: 'linear-gradient(135deg, #1a1a2e, #1e3a8a)' },
  { id: 'analyzing', duration: 5500, bg: 'linear-gradient(135deg, #0f172a, #1e40af)' },
  { id: 'planning', duration: 5500, bg: 'linear-gradient(135deg, #0f172a, #065f46)' },
  { id: 'quizzing', duration: 5500, bg: 'linear-gradient(135deg, #0f172a, #581c87)' },
  { id: 'adapting', duration: 5500, bg: 'linear-gradient(135deg, #0f172a, #9d174d)' },
  { id: 'success', duration: 6000, bg: 'linear-gradient(135deg, #0f172a, #4338ca)' },
]

/* ═══ OCTO GUIDE COMPONENT ═══ */
function OctoGuide({ message, position = 'right', delay = 0.5 }) {
  const posStyles = {
    right: { right: 20, top: 20, left: 'auto' },
    left: { left: 20, top: 20, right: 'auto' },
    bottom: { bottom: 100, left: '50%', transform: 'translateX(-50%)' },
    top: { top: 10, left: '50%', transform: 'translateX(-50%)' },
  }

  return (
    <motion.div
      style={{
        position: 'absolute',
        ...posStyles[position],
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: position === 'left' ? 'flex-start' : 'flex-end',
        gap: 6,
      }}
      initial={{ opacity: 0, x: position === 'right' ? 40 : -40, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 200, damping: 15 }}
    >
      {/* Speech bubble */}
      <motion.div
        style={{
          background: 'rgba(99,102,241,0.95)',
          borderRadius: 14,
          padding: '10px 16px',
          color: 'white',
          fontSize: 13,
          maxWidth: 200,
          textAlign: position === 'left' ? 'left' : 'right',
          lineHeight: 1.4,
          boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
          backdropFilter: 'blur(8px)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.3, type: 'spring', stiffness: 300 }}
      >
        {message}
      </motion.div>
      {/* Octo */}
      <motion.img
        src={OCTO_IMG}
        alt="Octo your study guide"
        style={{
          width: 70,
          height: 70,
          filter: 'drop-shadow(0 0 15px rgba(99,102,241,0.5))',
        }}
        animate={{ y: [0, -5, 0], rotate: [-2, 2, -2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  )
}

/* ═══ CHARACTER COMPONENT (uses real images) ═══ */
function CharacterImage({ src, size = 180, style = {}, animate: animProps = {} }) {
  return (
    <motion.img
      src={src}
      alt="Student"
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.3))',
        ...style,
      }}
      initial={{ opacity: 0, scale: 0.7, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, ...animProps }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    />
  )
}

/* ═══ SCENE 1: PROBLEM ═══ */
function SceneProblem() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      {/* Floating subject books */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 500, height: 80, marginBottom: 10 }}>
        {[
          { label: 'DBMS', x: -180, color: '#ef4444' },
          { label: 'OS', x: -60, color: '#f97316' },
          { label: 'CN', x: 60, color: '#eab308' },
          { label: 'Java', x: 180, color: '#22c55e' },
        ].map((b, i) => (
          <motion.div key={b.label}
            style={{ position: 'absolute', left: `calc(50% + ${b.x}px - 18px)`, top: 0, textAlign: 'center' }}
            initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{ delay: i * 0.12, y: { duration: 3, repeat: Infinity, delay: i * 0.3 } }}
          >
            <div style={{ width: 36, height: 44, borderRadius: 6, background: b.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, boxShadow: `0 4px 12px ${b.color}40` }}>📖</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>{b.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Worried student at desk */}
      <CharacterImage src={CHARS.worried} size={200} />

      <motion.h2 style={{ color: 'white', fontSize: 28, fontWeight: 'bold', marginTop: 12, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        Too much to study?
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4, fontSize: 14 }}>So many subjects. So little time.</p>
    </div>
  )
}

/* ═══ SCENE 2: OCTO HELPS ═══ */
function SceneOctoHelps() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      <OctoGuide message="Hey! Don't worry — I'm Octo, your AI study buddy! 🐙" position="right" delay={0.3} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 30, flexWrap: 'wrap', justifyContent: 'center', marginTop: 30 }}>
        {/* Worried student */}
        <motion.div initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <CharacterImage src={CHARS.worried} size={160} />
        </motion.div>

        {/* Arrow */}
        <motion.div style={{ fontSize: 40, color: '#6366f1' }}
          animate={{ scale: [1, 1.3, 1], x: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}>
          →
        </motion.div>

        {/* Happy student appears */}
        <motion.div initial={{ x: 40, opacity: 0, scale: 0.5 }} animate={{ x: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}>
          <CharacterImage src={CHARS.happy} size={160} />
        </motion.div>
      </div>

      <motion.h2 style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 16 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        I'll analyze, plan & quiz you
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4, fontSize: 14 }}>Let's turn stress into success!</p>
    </div>
  )
}

/* ═══ SCENE 3: ANALYZING ═══ */
function SceneAnalyzing() {
  const docs = ['📄 Your Syllabus', '📅 Exam Dates', '📊 Past Scores', '⏱ Available Time']
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      <OctoGuide message="I read your syllabus & notes — every topic, every gap!" position="right" delay={0.4} />

      {/* Scanning beam animation */}
      <motion.div style={{ position: 'relative', marginBottom: 16, marginTop: 20 }}>
        <div style={{ width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(99,102,241,0.5)' }}>
          <span style={{ fontSize: 48 }}>🧠</span>
        </div>
        <motion.div style={{ position: 'absolute', inset: -20, borderRadius: '50%', border: '2px solid rgba(96,165,250,0.3)' }}
          animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }} />
      </motion.div>

      {/* Documents flowing into brain */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480 }}>
        {docs.map((d, i) => (
          <motion.div key={d} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 12, backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2 }}>
            {d}
          </motion.div>
        ))}
      </div>

      <motion.h2 style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 24 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Analyzes your materials
      </motion.h2>
    </div>
  )
}

/* ═══ SCENE 4: PLANNING ═══ */
function ScenePlanning() {
  const blocks = [
    { label: 'DBMS → Normalization', time: '45 min', color: '#ef4444', icon: '🔴' },
    { label: 'CN → Routing', time: '30 min', color: '#f97316', icon: '🟠' },
    { label: 'Java → Collections', time: '25 min', color: '#8b5cf6', icon: '🟣' },
  ]
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      <OctoGuide message="Here's your personalized study plan — optimized just for you! 📅" position="left" delay={0.4} />

      {/* Study character */}
      <div style={{ position: 'absolute', bottom: 20, right: 20, opacity: 0.6 }}>
        <CharacterImage src={CHARS.studying} size={120} style={{ opacity: 0.5 }} />
      </div>

      <motion.div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', width: '100%', maxWidth: 320, marginTop: 20
      }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#34d399', marginBottom: 12 }}>🗓 Your Smart Plan</div>
        {blocks.map((b, i) => (
          <motion.div key={b.label} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 8, borderRadius: 10,
            background: `${b.color}15`, borderLeft: `3px solid ${b.color}`
          }} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.2 }}>
            <span>{b.icon}</span>
            <span style={{ color: 'white', fontSize: 13 }}>{b.label}</span>
            <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{b.time}</span>
          </motion.div>
        ))}
      </motion.div>

      <motion.h2 style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 20 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Creates your smart plan
      </motion.h2>
    </div>
  )
}

/* ═══ SCENE 5: QUIZZING ═══ */
function SceneQuizzing() {
  const [sel, setSel] = useState(null)
  const [res, setRes] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setSel(1), 1500)
    const t2 = setTimeout(() => setRes(true), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      <OctoGuide message="I pick questions from YOUR notes — not random stuff! 🎯" position="right" delay={0.4} />

      <motion.div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16, padding: 20, backdropFilter: 'blur(12px)', width: '100%', maxWidth: 360, marginTop: 20
      }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#a78bfa' }}>AI Quiz from your material</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 12 }}>Which normal form eliminates transitive dependencies?</p>
        {['1NF', '2NF', '3NF', 'BCNF'].map((opt, i) => (
          <motion.div key={opt} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', marginBottom: 6, borderRadius: 10,
            background: res && i === 1 ? 'rgba(34,197,94,0.2)' : (sel === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)'),
            border: `1px solid ${res && i === 1 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: res && i === 1 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white' }}>{String.fromCharCode(65 + i)}</span>
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13 }}>{opt}</span>
            {res && i === 1 && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✅</span>}
          </motion.div>
        ))}
      </motion.div>

      <motion.h2 style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 20 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        Tests your knowledge
      </motion.h2>
    </div>
  )
}

/* ═══ SCENE 6: ADAPTING ═══ */
function SceneAdapting() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      <OctoGuide message="Oops — Normalization is weak? I'm adjusting your plan now! ⚡" position="left" delay={0.4} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'center', marginTop: 20 }}>
        {/* Before */}
        <motion.div style={{
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12, padding: 16, backdropFilter: 'blur(8px)', minWidth: 150
        }} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#9ca3af', marginBottom: 8 }}>Before</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>SQL: 45 min</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>Normalization: 20 min</div>
        </motion.div>

        {/* Arrow */}
        <motion.div style={{ fontSize: 36, color: '#eab308' }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}>⚡</motion.div>

        {/* After */}
        <motion.div style={{
          background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)',
          borderRadius: 12, padding: 16, backdropFilter: 'blur(8px)', minWidth: 150
        }} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', color: '#f472b6', marginBottom: 8 }}>After Quiz</div>
          <div style={{ color: '#f472b6', fontSize: 12, marginBottom: 4 }}>Normalization: 50 min ↑</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>SQL: 30 min</div>
        </motion.div>
      </div>

      {/* Thinking character */}
      <div style={{ marginTop: 16 }}>
        <CharacterImage src={CHARS.thinking} size={140} />
      </div>

      <motion.div style={{
        marginTop: 12, background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)',
        borderRadius: 20, padding: '8px 16px', color: '#f87171', fontSize: 13
      }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
        🔍 Weak topic detected → Plan updated!
      </motion.div>

      <motion.h2 style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginTop: 12 }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        Automatically adapts
      </motion.h2>
    </div>
  )
}

/* ═══ SCENE 7: SUCCESS ═══ */
function SceneSuccess() {
  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', minHeight: 450 }}>
      {/* Confetti */}
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.div key={i} style={{
          position: 'absolute', width: 6, height: 6, borderRadius: i % 2 === 0 ? '50%' : 2,
          background: ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][i % 6],
          left: `${5 + (i * 6)}%`, top: `${5 + (i * 4)}%`,
        }} animate={{ y: [0, -50], opacity: [1, 0], rotate: [0, 180] }}
          transition={{ duration: 2.5, delay: i * 0.12, repeat: Infinity }} />
      ))}

      <OctoGuide message="You did it! I'm so proud of you! 🎉🐙" position="right" delay={0.3} />

      <CharacterImage src={CHARS.celebrating} size={200} />

      <motion.h2 style={{ color: 'white', fontSize: 32, fontWeight: 'bold', marginTop: 16, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        Stop guessing.
      </motion.h2>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 }}>
        Start preparing with a system that adapts to you.
      </p>

      <motion.div style={{
        marginTop: 20, background: 'rgba(99,102,241,0.9)', borderRadius: 12, padding: '12px 28px',
        color: 'white', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)'
      }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
        Start Preparing →
      </motion.div>
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
        <motion.div key={scene} style={{ background: cur.bg, minHeight: 480, position: 'relative' }}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ duration: 0.5 }}>
          <Comp />
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: isDark ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.95)' }}>
        <button onClick={() => setPaused(!paused)} aria-label={paused ? 'Play demo' : 'Pause demo'}
          style={{ width: 32, height: 32, borderRadius: '50%', border: 'none', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', cursor: 'pointer', fontSize: 14 }}>
          {paused ? '▶' : '⏸'}
        </button>
        <div style={{ display: 'flex', gap: 6 }} role="tablist" aria-label="Demo scenes">
          {SCENES.map((s, i) => (
            <button key={i} onClick={() => setScene(i)} role="tab" aria-selected={i === scene} aria-label={`Scene ${i + 1}: ${s.id}`}
              style={{ width: i === scene ? 24 : 8, height: 8, borderRadius: 4, border: 'none', background: i === scene ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'), cursor: 'pointer', transition: 'all 0.3s' }} />
          ))}
        </div>
        <span style={{ fontSize: 12, color: isDark ? '#64748b' : '#9ca3af' }}>{scene + 1}/{SCENES.length}</span>
      </div>
    </div>
  )
}

export default ProductDemo
