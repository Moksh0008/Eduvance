import { useCountUp } from '../../hooks/useCountUp'
import { cn } from '../../utils/cn'

export function CountUp({ to, className, suffix = '', duration = 900 }) {
  const value = useCountUp(to, { duration })
  return (
    <span className={cn('tabular', className)}>
      {value}
      {suffix}
    </span>
  )
}
