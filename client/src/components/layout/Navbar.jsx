import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { useAppState } from '../../context/AppState'
import { useAppData } from '../../hooks/useAppData'

export function Navbar({ onMenu }) {
  const { user, demoMode } = useAppState()
  const data = useAppData()
  const hours = data.preferences?.dailyHours ?? 6

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
          <span className="text-ink">{user?.name}</span>
        </p>
        {demoMode ? <Badge tone="accent">Demo</Badge> : null}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/setup" className="hidden text-xs font-medium text-ink-2 hover:text-ink sm:inline" data-cursor="click">
          Edit preparation
        </Link>
        <p className="tabular text-xs text-ink-3">{hours}h available / day</p>
      </div>
    </header>
  )
}
