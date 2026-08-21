import { motion, useReducedMotion } from 'framer-motion'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 8,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -4,
    filter: 'blur(2px)',
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const pageReduced = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: { opacity: 1 },
}

export function PageTransition({ children }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      {...(reduce ? pageReduced : pageVariants)}
    >
      {children}
    </motion.div>
  )
}
