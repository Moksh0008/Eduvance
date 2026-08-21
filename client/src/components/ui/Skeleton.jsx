import { cn } from '../../utils/cn'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-surface-2 rounded', className)} aria-hidden="true" />
}
