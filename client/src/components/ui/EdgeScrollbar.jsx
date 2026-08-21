import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export function EdgeScrollbar() {
  const [visible, setVisible] = useState(false)
  const [thumbHeight, setThumbHeight] = useState(0)
  const [thumbTop, setThumbTop] = useState(0)
  const timeoutRef = useRef(null)
  const scrollY = useMotionValue(0)
  const smoothY = useSpring(scrollY, { stiffness: 300, damping: 30 })

  const updateThumb = useCallback(() => {
    const scrollEl = document.scrollingElement || document.documentElement
    const { scrollTop, scrollHeight, clientHeight } = scrollEl
    if (scrollHeight <= clientHeight) {
      setThumbHeight(0)
      return
    }
    const ratio = clientHeight / scrollHeight
    const h = Math.max(30, ratio * clientHeight)
    const top = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - h)
    setThumbHeight(h)
    setThumbTop(top)
    scrollY.set(top)
  }, [scrollY])

  useEffect(() => {
    const handleMove = (e) => {
      const nearEdge = e.clientX > window.innerWidth - 40
      if (nearEdge) {
        setVisible(true)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setVisible(false), 1500)
      }
    }

    const handleScroll = () => {
      updateThumb()
      if (!visible) return
      clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setVisible(false), 1500)
    }

    window.addEventListener('mousemove', handleMove, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateThumb, { passive: true })
    updateThumb()

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateThumb)
      clearTimeout(timeoutRef.current)
    }
  }, [updateThumb, visible])

  if (thumbHeight === 0) return null

  return (
    <motion.div
      className="fixed right-1.5 z-50 flex items-start"
      style={{ top: 0, height: '100vh', width: 8 }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full rounded-full"
        style={{
          height: thumbHeight,
          top: thumbTop,
          position: 'absolute',
          background: 'linear-gradient(180deg, var(--color-accent), var(--color-accent-2))',
          boxShadow: visible ? '0 0 8px var(--color-accent-glow)' : 'none',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </motion.div>
  )
}
