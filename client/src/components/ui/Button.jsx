import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import { useFinePointer, useReducedMotion } from '../../hooks/useReducedMotion'

const variants = {
  primary: 'text-white disabled:opacity-40',
  accent: 'text-white disabled:opacity-40',
  secondary: 'bg-surface text-ink border border-line-2 hover:bg-surface-2 hover:border-ink-3/20 hover:shadow-lg disabled:opacity-40',
  ghost: 'bg-transparent text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'text-white disabled:opacity-40',
}

const sizes = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-4 text-sm rounded-lg',
  lg: 'h-12 px-5 text-[15px] rounded-xl',
}

const filledBg = {
  primary: 'var(--color-accent)',
  accent: 'var(--color-accent)',
  danger: 'var(--color-risk)',
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
  const isFilled = variant === 'primary' || variant === 'accent' || variant === 'danger'
  const classes = cn(
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 relative overflow-hidden',
    variants[variant],
    sizes[size],
    className,
  )

  const style = isFilled ? {
    backgroundColor: filledBg[variant],
    color: '#fff',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  } : undefined

  if (Tag === 'button') {
    return (
      <motion.button
        type={type || 'button'}
        className={classes}
        style={style}
        whileHover={fine && !reduce ? { y: -2, scale: 1.04, boxShadow: isFilled ? '0 6px 30px var(--color-accent-glow)' : '0 4px 16px rgba(0,0,0,0.08)' } : undefined}
        whileTap={reduce ? undefined : { scale: 0.93, y: 0 }}
        data-cursor="click"
        transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        {...props}
      >
        {isFilled && !reduce && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full hover:translate-x-full" style={{ pointerEvents: 'none' }} />}
        {children}
      </motion.button>
    )
  }

  return (
    <Tag
      type={undefined}
      className={classes}
      style={style}
      {...props}
    >
      {isFilled && <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ pointerEvents: 'none' }} />}
      {children}
    </Tag>
  )
}
