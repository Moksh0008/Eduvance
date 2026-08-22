import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { useTheme } from '../../context/ThemeContext'
import { getStreak } from '../../utils/streaks'
import { getContextMessage } from './mascotMessages'

/* ═══════════════════════════════════════════════════
   EDUVANCE MASCOT — Octo the purple octopus
   Idle animations via CSS: blink, breathe, float
   ═══════════════════════════════════════════════════ */

const COOLDOWN_MS = 10000
const MESSAGE_VISIBLE_MS = 7000
const OCTO_IMG = '/mascot/octo-main.png'

/* CSS keyframes injected once */
const STYLES = `
@keyframes octo-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes octo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes octo-blink {
  0%, 92%, 100% { clip-path: inset(0 0 0 0 round 50%); }
  94% { clip-path: inset(35% 0 55% 0 round 50%); }
}
@keyframes octo-blink-line {
  0%, 92%, 100% { opacity: 0; }
  94% { opacity: 1; }
}
@keyframes octo-glow-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(109,76,216,0.2); }
  50% { box-shadow: 0 0 35px rgba(109,76,216,0.4); }
}
@keyframes octo-bubble-in {
  0% { opacity: 0; transform: scale(0.85) translateY(6px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes octo-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const s = document.createElement('style')
  s.textContent = STYLES
  document.head.appendChild(s)
  stylesInjected = true
}

export function EduvanceMascot() {
  const location = useLocation()
  const data = useAppData()
  const { isDark } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [lastAutoShow, setLastAutoShow] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  injectStyles()

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
      className="fixed z-50 flex items-end gap-2 sm:gap-3"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
      }}
      initial={{ opacity: 0, y: 50, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.2 }}
    >
      {/* Speech bubble with pointer */}
      <AnimatePresence>
        {isOpen && message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 16, y: 8 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 16, y: 8 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative max-w-[230px] rounded-2xl rounded-br-sm px-4 py-3 text-[13px] font-medium leading-relaxed shadow-2xl"
            style={{
              background: isDark ? 'rgba(17,22,49,0.94)' : 'rgba(255,255,255,0.97)',
              color: isDark ? '#e8eaf0' : '#1a1d2e',
              border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(26,29,46,0.06)'}`,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              animation: 'octo-bubble-in 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {message}
            {/* Pointer triangle pointing right → toward mascot */}
            <div
              className="absolute -bottom-2 right-4 h-0 w-0"
              style={{
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `8px solid ${isDark ? 'rgba(17,22,49,0.94)' : 'rgba(255,255,255,0.97)'}`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot button with idle animations */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Eduvance study companion — click for a tip"
        title="Click for a tip!"
        style={{
          animation: 'octo-float 3.5s ease-in-out infinite',
        }}
      >
        {/* Hover glow ring */}
        <div
          className="absolute -inset-2 rounded-full transition-all duration-500"
          style={{
            background: isHovering
              ? 'radial-gradient(circle, rgba(109,76,216,0.25) 0%, transparent 70%)'
              : 'transparent',
            filter: isHovering ? 'blur(8px)' : 'blur(0px)',
          }}
        />

        {/* Octo image with breathing animation */}
        <div
          className="relative"
          style={{
            animation: 'octo-breathe 4s ease-in-out infinite',
          }}
        >
          <img
            src={OCTO_IMG}
            alt="Octo — your study companion"
            className="object-contain select-none"
            style={{
              width: 'clamp(80px, 12vw, 130px)',
              height: 'clamp(80px, 12vw, 130px)',
              filter: `drop-shadow(0 4px 16px rgba(109,76,216,0.35))`,
              transition: 'filter 0.4s ease',
              ...(isHovering ? { filter: 'drop-shadow(0 6px 24px rgba(109,76,216,0.5))' } : {}),
            }}
            draggable={false}
          />

          {/* Blink overlay — subtle eyelid flash every ~4s */}
          <div
            className="absolute rounded-full"
            style={{
              top: '22%',
              left: '25%',
              width: '50%',
              height: '12%',
              background: isDark ? 'rgba(109,76,216,0.6)' : 'rgba(109,76,216,0.5)',
              borderRadius: '50%',
              animation: 'octo-blink-line 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Notification dot */}
        {!isOpen && (
          <div
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2"
            style={{
              background: '#22c55e',
              borderColor: isDark ? '#111631' : '#f4f2ee',
              animation: 'octo-dot-pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default EduvanceMascot
