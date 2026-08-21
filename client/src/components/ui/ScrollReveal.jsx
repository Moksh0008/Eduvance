import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const presets = {
  fadeUp: {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -32 },
    visible: { opacity: 1, x: 0 },
  },
  slideRight: {
    hidden: { opacity: 0, x: 32 },
    visible: { opacity: 1, x: 0 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
}

export function ScrollReveal({
  children,
  preset = 'fadeUp',
  delay = 0,
  duration = 0.5,
  className,
  once = true,
  amount = 0.2,
}) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const isInView = useInView(ref, { once, amount })

  const variants = presets[preset] || presets.fadeUp

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({ children, className, staggerDelay = 0.06 }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  )
}
