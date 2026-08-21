import { useEffect, useState } from 'react'
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
  const tx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.4 })
  const ty = useSpring(y, { stiffness: 380, damping: 32, mass: 0.4 })
  const [mode, setMode] = useState('default')
  const [down, setDown] = useState(false)

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
    function onDown() { setDown(true) }
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

  const expand = mode === 'click' || mode === 'card' || down
  const dotColor = isDark ? 'bg-accent-2' : 'bg-accent'
  const ringBorder = isDark ? 'border-accent/30 bg-accent/[0.08]' : 'border-accent/20 bg-accent/[0.06]'

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
        style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className={`rounded-full border ${ringBorder}`}
          style={{
            width: expand ? 40 : 24,
            height: expand ? 40 : 24,
            transition: 'width 160ms ease, height 160ms ease, background-color 0.5s ease, border-color 0.5s ease',
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[81] hidden md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full ${dotColor}`}
          style={{ transform: down ? 'scale(0.6)' : 'scale(1)', transition: 'transform 100ms ease, background-color 0.5s ease' }}
        />
      </motion.div>
    </>
  )
}
