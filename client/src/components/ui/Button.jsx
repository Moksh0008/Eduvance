import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion'

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] disabled:opacity-40',
  accent: 'bg-accent text-white hover:bg-accent-2 hover:shadow-[0_0_30px_rgba(99,102,241,0.25)] disabled:opacity-40',
  secondary: 'bg-surface-2 text-ink border border-line-2 hover:bg-surface hover:border-ink-3/20 hover:shadow-lg disabled:opacity-40',
  ghost: 'bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'bg-risk text-white hover:bg-risk/90 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]',
}

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-5 text-[15px] rounded-xl',
}

export function Button({
  as: Tag = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  type,
  ...props
}) {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
    variants[variant],
    sizes[size],
    className,
  )

  if (Tag === 'button') {
    return (
      <motion.button
        type={type || 'button'}
        className={classes}
        whileHover={fine && !reduce ? { y: -1, scale: 1.02 } : undefined}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        data-cursor="click"
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <Tag type={undefined} className={classes} {...props}>
      {children}
    </Tag>
  )
}
