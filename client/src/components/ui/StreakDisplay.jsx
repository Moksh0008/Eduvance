import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStreak, getStreakMilestone, getStreakColor, isNewMilestone, recordStudyDay } from '../../utils/streaks'
import { OctoSVG } from './OctoMascot'

/* ═══ STREAK DISPLAY — Shows fire streaks with Octo ═══ */

export function StreakDisplay({ compact = false, className = '' }) {
  const [streak, setStreak] = useState(() => getStreak())
  const [showMilestone, setShowMilestone] = useState(false)
  const [milestone, setMilestone] = useState(null)

  useEffect(() => {
    setStreak(getStreak())
  }, [])

  // Check for milestone on mount
  useEffect(() => {
    if (streak.current > 0 && isNewMilestone(streak.current)) {
      const m = getStreakMilestone(streak.current)
      if (m) {
        setMilestone(m)
        setShowMilestone(true)
        // Auto-dismiss after 5 seconds
        const timer = setTimeout(() => setShowMilestone(false), 5000)
        return () => clearTimeout(timer)
      }
    }
  }, [streak.current])

  if (compact) {
    return <CompactStreak streak={streak} />
  }

  return (
    <div className={`relative ${className}`}>
      <CompactStreak streak={streak} />

      {/* Milestone celebration overlay */}
      <AnimatePresence>
        {showMilestone && milestone && (
          <MilestonePopup milestone={milestone} streak={streak} onClose={() => setShowMilestone(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CompactStreak({ streak }) {
  const fireCount = Math.min(streak.current, 7) // Max 7 fire emojis
  const tier = streak.current >= 21 ? 'platinum' : streak.current >= 14 ? 'gold' : streak.current >= 7 ? 'silver' : 'bronze'
  const colors = getStreakColor(tier)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2"
      style={{ background: colors.bg, border: `1px solid ${colors.border}30` }}
    >
      {/* Fire emojis */}
      <div className="flex">
        {Array.from({ length: fireCount }).map((_, i) => (
          <motion.span key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, type: 'spring', stiffness: 500 }}
            className="text-sm"
            style={{ marginLeft: i > 0 ? '-4px' : 0 }}
          >
            🔥
          </motion.span>
        ))}
      </div>

      {/* Streak number */}
      <div className="flex flex-col">
        <motion.span key={streak.current}
          initial={{ scale: 1.3, color: colors.text }}
          animate={{ scale: 1, color: colors.text }}
          className="text-sm font-bold leading-none"
        >
          {streak.current} day{streak.current !== 1 ? 's' : ''}
        </motion.span>
        <span className="text-[9px] text-ink-3 leading-none mt-0.5">
          {streak.current === 0 ? 'Start studying!' : 'streak'}
        </span>
      </div>

      {/* Best streak */}
      {streak.best > 0 && (
        <span className="text-[9px] text-ink-3 ml-1">
          🏆 {streak.best}
        </span>
      )}
    </motion.div>
  )
}

/* ═══ MILESTONE CELEBRATION POPUP ═══ */
function MilestonePopup({ milestone, streak, onClose }) {
  const [confetti, setConfetti] = useState([])

  useEffect(() => {
    // Generate confetti particles
    const particles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'][i % 7],
      size: 4 + Math.random() * 6,
    }))
    setConfetti(particles)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-canvas/60 backdrop-blur-sm" onClick={onClose} />

      {/* Confetti */}
      {confetti.map(p => (
        <motion.div key={p.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
          }}
          initial={{ top: '-5%', opacity: 1, rotate: 0 }}
          animate={{
            top: '110%',
            opacity: [1, 1, 0],
            rotate: 360 + Math.random() * 360,
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 2 + Math.random(),
            delay: p.delay,
            ease: 'easeIn',
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.5, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.5, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="relative rounded-2xl p-8 text-center max-w-sm w-full"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)', boxShadow: '0 24px 64px rgba(0,0,0,0.3)' }}
      >
        {/* Octo celebrating */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 0.6, repeat: 2 }}
        >
          <OctoSVG expression="excited" size={100} enable3D={false} />
        </motion.div>

        {/* Milestone emoji */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.3, 1] }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-5xl mt-2"
        >
          {milestone.emoji}
        </motion.div>

        {/* Streak count */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-3 font-serif text-3xl"
          style={{ color: getStreakColor(milestone.tier).text }}
        >
          {streak.current} Day Streak!
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-2 text-sm text-ink-2"
        >
          {milestone.message}
        </motion.p>

        {/* Fire row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex justify-center gap-1"
        >
          {Array.from({ length: Math.min(streak.current, 7) }).map((_, i) => (
            <motion.span key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: 0.7 + i * 0.1, repeat: Infinity, repeatDelay: 2 }}
              className="text-xl"
            >
              🔥
            </motion.span>
          ))}
        </motion.div>

        <button onClick={onClose}
          className="mt-6 rounded-xl px-6 py-2 text-sm font-medium text-ink transition-all hover:scale-105"
          style={{ background: getStreakColor(milestone.tier).bg, border: `1px solid ${getStreakColor(milestone.tier).border}40`, color: getStreakColor(milestone.tier).text }}>
          Keep it going! 💪
        </button>
      </motion.div>
    </motion.div>
  )
}

/* ═══ STREAK REMINDER — Octo reminds to study ═══ */
export function StreakReminder() {
  const streak = getStreak()

  if (streak.todayRecorded || streak.current === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 rounded-xl px-4 py-3"
      style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.15)' }}
    >
      <motion.span
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="text-xl"
      >
        ⚠️
      </motion.span>
      <div className="flex-1">
        <p className="text-xs font-medium text-high">
          Your {streak.current}-day streak is at risk!
        </p>
        <p className="text-[10px] text-ink-3">
          Study today to keep the streak alive 🔥
        </p>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => recordStudyDay()}
        className="rounded-lg px-3 py-1.5 text-xs font-medium"
        style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}
      >
        Study now 🔥
      </motion.button>
    </motion.div>
  )
}

export { recordStudyDay }
