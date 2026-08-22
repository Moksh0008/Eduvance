import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { useTheme } from '../../context/ThemeContext'
import { getStreak } from '../../utils/streaks'
import { POSES, getContextMessage } from './mascotMessages'

/* ═══════════════════════════════════════════════════
   EDUVANCE MASCOT — Persistent octopus companion
   Uses actual character sheet images (no SVG redraw)
   ═══════════════════════════════════════════════════ */

const COOLDOWN_MS = 8000 // Minimum time between auto-messages
const MESSAGE_VISIBLE_MS = 6000 // How long a message stays visible

export function EduvanceMascot() {
  const location = useLocation()
  const data = useAppData()
  const { isDark } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [pose, setPose] = useState('happy')
  const [lastAutoShow, setLastAutoShow] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  // Get quiz result from session storage
  const quizScore = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('eduvance.quiz.result')
      return raw ? JSON.parse(raw).score : null
    } catch { return null }
  }, [location.pathname])

  // Get streak
  const streakCount = useMemo(() => getStreak().current, [location.pathname])

  // Determine context message
  const contextMsg = useMemo(() => {
    return getContextMessage(location.pathname, data, { quizScore, streakCount })
  }, [location.pathname, data, quizScore, streakCount])

  // Update pose and message when page changes
  useEffect(() => {
    setPose(contextMsg.pose)
    setMessage(contextMsg.message)

    // Auto-show on page change (with cooldown)
    const now = Date.now()
    if (now - lastAutoShow > COOLDOWN_MS) {
      setIsOpen(true)
      setLastAutoShow(now)

      // Auto-hide after delay
      const timer = setTimeout(() => setIsOpen(false), MESSAGE_VISIBLE_MS)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, contextMsg])

  // Entrance animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Click handler — show new contextual message
  const handleClick = useCallback(() => {
    if (isOpen) {
      setIsOpen(false)
    } else {
      const msg = getContextMessage(location.pathname, data, { quizScore, streakCount })
      setPose(msg.pose)
      setMessage(msg.message)
      setIsOpen(true)
      setLastAutoShow(Date.now())

      const timer = setTimeout(() => setIsOpen(false), MESSAGE_VISIBLE_MS)
      return () => clearTimeout(timer)
    }
  }, [isOpen, location.pathname, data, quizScore, streakCount])

  // Determine which image/position to use
  const poseConfig = POSES[pose] || POSES.happy

  // Don't show on setup page during first load
  if (location.pathname === '/setup' && !hasEntered) return null

  return (
    <motion.div
      className="fixed z-50 flex items-end gap-2"
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
        right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
      }}
      initial={{ opacity: 0, y: 40, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
    >
      {/* Speech bubble */}
      <AnimatePresence>
        {isOpen && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 12 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="max-w-[220px] rounded-2xl rounded-br-md px-4 py-3 text-xs font-medium leading-relaxed shadow-xl"
            style={{
              background: isDark ? 'rgba(17,22,49,0.92)' : 'rgba(255,255,255,0.95)',
              color: isDark ? '#e8eaf0' : '#1a1d2e',
              border: `1px solid ${isDark ? 'rgba(148,163,184,0.12)' : 'rgba(26,29,46,0.08)'}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot image */}
      <motion.button
        onClick={handleClick}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.08, y: -2 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          y: [0, -4, 0],
        }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label="Eduvance study companion"
        title="Click for a tip!"
      >
        {/* The actual octopus image from the character sheet */}
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: 72,
            height: 72,
            backgroundImage: `url(${poseConfig.image})`,
            backgroundSize: poseConfig.image.includes('turnaround') ? '400% 200%' :
                           poseConfig.image.includes('action') ? '500% 200%' :
                           poseConfig.image.includes('sticker') ? '500% 200%' : '100% 100%',
            backgroundPosition: poseConfig.bgPos,
            backgroundRepeat: 'no-repeat',
            filter: 'drop-shadow(0 3px 8px rgba(109,76,216,0.25))',
            transition: 'background-image 0.3s ease, background-position 0.3s ease',
          }}
        />

        {/* Notification dot — shows when bubble is hidden */}
        {!isOpen && (
          <motion.div
            className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2"
            style={{
              background: '#22c55e',
              borderColor: isDark ? '#111631' : '#f4f2ee',
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default EduvanceMascot
