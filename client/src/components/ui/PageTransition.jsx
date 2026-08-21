import { motion, useReducedMotion } from 'framer-motion'
import { pageFade, pageFadeReduced } from '../../animations/variants'

export function PageTransition({ children }) {
  const reduce = useReducedMotion()
  return <motion.div {...(reduce ? pageFadeReduced : pageFade)}>{children}</motion.div>
}
