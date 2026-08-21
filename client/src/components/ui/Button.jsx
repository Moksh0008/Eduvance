import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'

const variants = {
  primary: 'bg-ink text-canvas hover:bg-ink/90 disabled:opacity-50',
  accent: 'bg-accent text-white hover:bg-accent/90 disabled:opacity-50',
  secondary: 'bg-transparent text-ink border border-line hover:bg-canvas-2 disabled:opacity-50',
  ghost: 'bg-transparent text-ink-2 hover:bg-canvas-2 hover:text-ink',
  danger: 'bg-risk text-white hover:bg-risk/90',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-[15px]',
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
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors duration-150',
    variants[variant],
    sizes[size],
    className,
  )

  if (Tag === 'button') {
    return (
      <motion.button
        type={type || 'button'}
        className={classes}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
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
