import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion'

export function Cursor() {
  const fine = useFinePointer()
  const reduced = useReducedMotion()
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
    function onDown() {
      setDown(true)
    }
    function onUp() {
      setDown(false)
    }

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
  const pen = mode === 'pen' || mode === 'topic'

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden md:block"
        style={{ x: tx, y: ty, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="rounded-full border border-ink/25 bg-accent/10"
          style={{
            width: expand ? 36 : 22,
            height: expand ? 36 : 22,
            transition: 'width 160ms ease, height 160ms ease',
          }}
        />
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[81] hidden md:block"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="h-1.5 w-1.5 rounded-full bg-ink"
          style={{ transform: down ? 'scale(0.7)' : 'scale(1)' }}
        />
        {pen ? (
          <svg className="-mt-1 ml-1.5 h-3.5 w-3.5 text-ink/70" viewBox="0 0 16 16" fill="none">
            <path d="M3 13l.8-2.4L11.2 3.2a1.2 1.2 0 0 1 1.7 1.7L5.4 12.2 3 13z" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        ) : null}
      </motion.div>
    </>
  )
}
