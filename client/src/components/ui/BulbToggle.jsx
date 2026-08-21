import { useState, useEffect } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export function BulbToggle() {
  const { theme, toggleTheme, transitioning } = useTheme()
  const isDark = theme === 'dark'
  const [pulling, setPulling] = useState(false)
  const [flickering, setFlickering] = useState(false)

  // Wire stretch
  const wireY = useSpring(0, { stiffness: 300, damping: 20 })
  // Bulb swing
  const bulbRotation = useSpring(0, { stiffness: 120, damping: 8, mass: 0.5 })
  const bulbY = useSpring(0, { stiffness: 200, damping: 15 })
  // Glow opacity
  const glowOpacity = useSpring(isDark ? 0.15 : 0.85, { stiffness: 80, damping: 20 })

  useEffect(() => {
    glowOpacity.set(isDark ? 0.15 : 0.85)
  }, [isDark, glowOpacity])

  function handleClick() {
    if (transitioning) return
    setPulling(true)

    // 1. Pull down
    wireY.set(8)
    bulbY.set(10)

    // 2. After pull, trigger flicker
    setTimeout(() => {
      setFlickering(true)
      // Flicker sequence
      let count = 0
      const flicker = setInterval(() => {
        count++
        glowOpacity.set(count % 2 === 0 ? (isDark ? 0.6 : 0.2) : (isDark ? 0.15 : 0.85))
        if (count >= 4) {
          clearInterval(flicker)
          setFlickering(false)
          // 3. Swing
          bulbRotation.set(isDark ? 8 : -8)
          setTimeout(() => bulbRotation.set(isDark ? -4 : 4), 200)
          setTimeout(() => bulbRotation.set(isDark ? 2 : -2), 400)
          setTimeout(() => bulbRotation.set(0), 600)
          // 4. Toggle theme
          toggleTheme()
        }
      }, 80)
    }, 180)

    // Reset pull
    setTimeout(() => {
      wireY.set(0)
      bulbY.set(0)
      setPulling(false)
    }, 400)
  }

  return (
    <div className="relative flex flex-col items-center" style={{ height: 48 }}>
      {/* Wire from top */}
      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        style={{
          width: 1,
          height: useTransform(wireY, (v) => 20 + v),
          background: 'currentColor',
          opacity: 0.3,
        }}
      />

      {/* Bulb */}
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={transitioning}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        data-cursor="click"
        className="absolute top-5 left-1/2 -translate-x-1/2 focus-visible:outline-accent focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{ y: bulbY, rotate: bulbRotation }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Glow behind */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{
            opacity: glowOpacity,
            background: isDark
              ? 'radial-gradient(circle, rgba(250,204,21,0.3) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(250,204,21,0.5) 0%, transparent 70%)',
            filter: 'blur(12px)',
          }}
        />

        {/* Bulb SVG */}
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none" className="relative z-10">
          {/* Bulb glass */}
          <path
            d="M10 2C6.686 2 4 4.686 4 8c0 2.17 1.12 4.08 2.8 5.18C7.22 13.8 8 15.2 8 16.72V19a2 2 0 002 2h0a2 2 0 002-2v-2.28c0-1.52.78-2.92 1.2-3.52C14.88 12.08 16 10.17 16 8c0-3.314-2.686-6-6-6z"
            fill={isDark ? 'rgba(250,204,21,0.2)' : 'rgba(250,204,21,0.9)'}
            stroke={isDark ? 'rgba(250,204,21,0.3)' : 'rgba(200,160,30,0.8)'}
            strokeWidth="1"
          />
          {/* Filament */}
          <path
            d="M8 10c0-1 .5-2 2-2s2 1 2 2"
            stroke={isDark ? 'rgba(250,204,21,0.15)' : 'rgba(200,160,30,0.6)'}
            strokeWidth="0.8"
            fill="none"
          />
          {/* Base */}
          <rect x="7" y="19" width="6" height="2" rx="0.5" fill={isDark ? 'rgba(148,163,184,0.3)' : 'rgba(148,163,184,0.5)'} />
          <rect x="7.5" y="21" width="5" height="1.5" rx="0.5" fill={isDark ? 'rgba(148,163,184,0.2)' : 'rgba(148,163,184,0.4)'} />
          <rect x="8" y="22.5" width="4" height="1" rx="0.5" fill={isDark ? 'rgba(148,163,184,0.15)' : 'rgba(148,163,184,0.3)'} />
        </svg>
      </motion.button>

      {/* Tooltip */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] text-ink-3">
        {isDark ? 'Light mode' : 'Dark mode'}
      </div>
    </div>
  )
}
