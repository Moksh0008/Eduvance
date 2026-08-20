import { Menu } from 'lucide-react'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { student } from '../../data/student'

export function Navbar({ onMenu }) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-line bg-surface/80 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu size={18} />
        </Button>
        <Logo to="/dashboard" className="lg:hidden" />
        <p className="hidden text-sm text-ink-2 sm:block">
          Preparation command center
          <span className="mx-2 text-line">·</span>
          <span className="text-ink">{student.name}</span>
        </p>
      </div>
      <p className="tabular text-xs text-ink-3">20 Aug 2026 · 6h available today</p>
    </header>
  )
}
