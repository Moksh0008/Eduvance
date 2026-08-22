import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { useTheme } from '../../context/ThemeContext'
import { getStreak } from '../../utils/streaks'
import { POSES, getContextMessage } from './mascotMessages'

/* ═══════════════════════════════════════════════════
   EDUVANCE MASCOT — Octo the purple octopus
   Uses the single high-quality octopus image
   ═══════════════════════════════════════════════════ */

const COOLDOWN_MS = 8000
const MESSAGE_VISIBLE_MS = 6000
const OCTO_IMG = '/mascot/octo-main.png'

export function EduvanceMascot() {
  const location = useLocation()
  const data = useAppData()
  const { isDark } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [pose, setPose] = useState('happy')
  const [lastAutoShow, setLastAutoShow] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)

  const quizScore = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('eduvance.quiz.result')
      return raw ? JSON.parse(raw).score : null
    } catch { return null }
  }, [location.pathname])

  const streakCount = useMemo(() => getStreak().current, [location.pathname])

  const contextMsg = useMemo(() => {
    return getContextMessage(location.pathname, data, { quizScore, streakCount })
  }, [location.pathname, data, quizScore, streakCount])

  useEffect(() => {
    setPose(contextMsg.pose)
    setMessage(contextMsg.message)

    const now = Date.now()
    if (now - lastAutoShow > COOLDOWN_MS) {
      setIsOpen(true)
      setLastAutoShow(now)
      const timer = setTimeout(() => setIsOpen(false), MESSAGE_VISIBLE_MS)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, contextMsg])

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 500)
    return () => clearTimeout(timer)
  }, [])

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

  if (location.pathname === '/setup' && !hasEntered) return null

  return (
    <motion.div
      className="fixed z-50 flex items-end gap-3"
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
            className="max-w-[240px] rounded-2xl rounded-br-md px-4 py-3 text-sm font-medium leading-relaxed shadow-xl"
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

      {/* Mascot image — BIG */}
      <motion.button
        onClick={handleClick}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.92 }}
        animate={{ y: [0, -6, 0] }}
        transition={{
          y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
        }}
        aria-label="Eduvance study companion"
        title="Click for a tip!"
      >
        <img
          src={OCTO_IMG}
          alt="Octo — your study companion"
          className="object-contain"
          style={{
            width: 120,
            height: 120,
            filter: 'drop-shadow(0 4px 12px rgba(109,76,216,0.35))',
          }}
          draggable={false}
        />

        {/* Notification dot */}
        {!isOpen && (
          <motion.div
            className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full border-2"
            style={{
              background: '#22c55e',
              borderColor: isDark ? '#111631' : '#f4f2ee',
            }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default EduvanceMascot
