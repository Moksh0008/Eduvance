import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export function Logo({ className, to = '/' }) {
  const reduce = useReducedMotion()
  return (
    <Link to={to} className={cn('flex items-center gap-2.5 group', className)} aria-label="Eduvance home">
      <motion.img
        src="/logo.webp"
        alt="Eduvance logo"
        className="h-8 w-8 rounded-lg object-contain shadow-md"
        whileHover={reduce ? undefined : { scale: 1.08, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      />
      <span className="text-[15px] font-semibold tracking-tight text-ink transition-colors group-hover:text-accent-2">
        Eduvance
      </span>
    </Link>
  )
}
