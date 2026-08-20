import { Link } from 'react-router-dom'
import { cn } from '../../utils/cn'

export function Logo({ className, to = '/' }) {
  return (
    <Link to={to} className={cn('flex items-center gap-2 text-ink', className)} aria-label="Eduvance home">
      <span className="flex h-7 w-7 items-center justify-center rounded bg-ink text-[11px] font-semibold tracking-tight text-canvas">
        Ev
      </span>
      <span className="text-[15px] font-semibold tracking-tight">Eduvance</span>
    </Link>
  )
}
