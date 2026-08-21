import { useEffect, useRef } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function ParticleBackground() {
  const canvasRef = useRef(null)
  const { isDark } = useTheme()
  const reduce = useReducedMotion()
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef([])
  const blobsRef = useRef([])
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Init particles
    const count = reduce ? 15 : 35
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      r: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
    }))

    // Init blobs
    blobsRef.current = Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 150 + 100,
    }))

    function onMouse(e) {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }
    window.addEventListener('mousemove', onMouse)

    let lastTime = 0
    function frame(time) {
      const dt = Math.min(time - lastTime, 50) / 16
      lastTime = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw blobs
      blobsRef.current.forEach((blob) => {
        blob.x += blob.vx * dt
        blob.y += blob.vy * dt
        if (blob.x < -blob.r) blob.x = canvas.width + blob.r
        if (blob.x > canvas.width + blob.r) blob.x = -blob.r
        if (blob.y < -blob.r) blob.y = canvas.height + blob.r
        if (blob.y > canvas.height + blob.r) blob.y = -blob.r

        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r)
        const color = isDark ? '99, 102, 241' : '120, 130, 200'
        grad.addColorStop(0, `rgba(${color}, ${isDark ? 0.025 : 0.04})`)
        grad.addColorStop(1, `rgba(${color}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(blob.x - blob.r, blob.y - blob.r, blob.r * 2, blob.r * 2)
      })

      // Draw particles
      const px = mouseRef.current.x
      const py = mouseRef.current.y
      particlesRef.current.forEach((p, i) => {
        p.x += p.vx * dt
        p.y += p.vy * dt

        // Mouse influence
        const dx = px - p.x
        const dy = py - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          p.x += (dx / dist) * 0.15 * dt
          p.y += (dy / dist) * 0.15 * dt
        }

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        const color = isDark ? '148, 163, 184' : '100, 116, 139'
        ctx.fillStyle = `rgba(${color}, ${p.opacity})`
        ctx.fill()

        // Connect nearby particles
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const q = particlesRef.current[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(${color}, ${0.06 * (1 - d / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      rafRef.current = requestAnimationFrame(frame)
    }
    rafRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [isDark, reduce])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 0.6 }}
      aria-hidden="true"
    />
  )
}
