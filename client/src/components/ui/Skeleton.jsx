import { cn } from '../../utils/cn'

export function Skeleton({ className }) {
  return <div className={cn('animate-pulse bg-canvas-2', className)} aria-hidden="true" />
}
