import { Link, NavLink } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { cn } from '../../utils/cn'

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/80 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-ink-2 md:flex" aria-label="Marketing">
          <a href="#problem" className="hover:text-ink">
            Problem
          </a>
          <a href="#how" className="hover:text-ink">
            How it works
          </a>
          <a href="#why" className="hover:text-ink">
            Why Eduvance
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Button as={Link} to="/login" variant="ghost" size="sm">
            Log in
          </Button>
          <Button as={Link} to="/register" size="sm">
            Start Preparing
          </Button>
        </div>
      </div>
    </header>
  )
}

export function AuthNav() {
  return (
    <header className="border-b border-line bg-canvas">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />
        <NavLink to="/" className={({ isActive }) => cn('text-sm text-ink-2 hover:text-ink', isActive && 'text-ink')}>
          Back to home
        </NavLink>
      </div>
    </header>
  )
}
