import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../context/ThemeContext'

export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
  const { isDark } = useTheme()
  const enabled = fine && !reduced
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const tx = useSpring(x, { stiffness: 300, damping: 28, mass: 0.5 })
  const ty = useSpring(y, { stiffness: 300, damping: 28, mass: 0.5 })
  const [mode, setMode] = useState('default')
  const [down, setDown] = useState(false)
  const [ripples, setRipples] = useState([])
  const rippleId = useRef(0)

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('has-edu-cursor')
      return undefined
    }
    document.documentElement.classList.add('has-edu-cursor')

    function onMove(e) {
      x.set(e.clientX)
      y.set(e.clientY)
      const form = e.target?.closest?.('input, textarea, select, [contenteditable="true"]')
      if (form) {
        setMode('form')
        return
      }
      const t = e.target?.closest?.('[data-cursor]')
      setMode(t?.getAttribute('data-cursor') || (e.target?.closest?.('a,button') ? 'click' : 'default'))
    }
    function onDown(e) {
      setDown(true)
      // Create ink ripple on click
      rippleId.current += 1
      const id = rippleId.current
      setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }])
      setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
    }
    function onUp() { setDown(false) }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    return () => {
      document.documentElement.classList.remove('has-edu-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  if (mode === 'form') return null

  const isHover = mode === 'click' || mode === 'card'
  const accent = isDark ? '#818cf8' : '#5558e6'
  const accentSoft = isDark ? 'rgba(129,140,248,0.12)' : 'rgba(85,88,230,0.1)'

  return (
    <>
      {/* Trailing ring — follows with spring delay */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
        style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          style={{
            width: isHover ? 44 : down ? 20 : 28,
            height: isHover ? 44 : down ? 20 : 28,
            borderRadius: '50%',
            border: `1.5px solid ${accentSoft}`,
            background: isHover ? accentSoft : 'transparent',
            transition: 'width 200ms cubic-bezier(0.22,1,0.36,1), height 200ms cubic-bezier(0.22,1,0.36,1), background 0.3s ease, border-color 0.3s ease',
            boxShadow: isHover ? `0 0 20px ${accentSoft}` : 'none',
          }}
        />
      </motion.div>

      {/* Center pen-nib cursor image — tracks exact cursor */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[81] hidden md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <img
          src="/cursors/pen-32.png"
          alt=""
          draggable={false}
          style={{
            width: isHover ? 36 : 28,
            height: isHover ? 36 : 28,
            objectFit: 'contain',
            transform: down ? 'scale(0.75)' : 'scale(1)',
            transition: 'transform 80ms ease, width 150ms ease, height 150ms ease',
            filter: isHover ? `drop-shadow(0 0 8px ${accentSoft})` : 'none',
          }}
        />
      </motion.div>

      {/* Click ripples — ink-like effect */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="pointer-events-none fixed z-[79] hidden md:block"
          style={{
            left: r.x,
            top: r.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderRadius: '50%',
              border: `1px solid ${accentSoft}`,
              animation: 'cursor-ripple 600ms ease-out forwards',
            }}
          />
        </div>
      ))}

      <style>{`
        @keyframes cursor-ripple {
          0% { width: 0; height: 0; opacity: 1; }
          100% { width: 60px; height: 60px; opacity: 0; margin: -30px; }
        }
      `}</style>
    </>
  )
}
