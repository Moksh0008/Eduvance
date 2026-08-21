import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { StartPreparingButton } from '../auth/StartPreparingButton'
import { cn } from '../../utils/cn'
import { useAppState } from '../../context/AppState'

export function MarketingNav() {
  const { isLoggedIn, user, onboardingComplete } = useAppState()

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm text-ink-2 md:flex" aria-label="Marketing">
          {[
            { href: '#clarity', label: 'The loop' },
            { href: '#problem', label: 'Problem' },
            { href: '#how', label: 'How it works' },
            { href: '#why', label: 'Why Eduvance' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative transition-colors hover:text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-accent-2 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Button as={Link} to={onboardingComplete ? '/dashboard' : '/setup'} variant="ghost" size="sm">
                {user?.name?.split(' ')[0]}
              </Button>
              <StartPreparingButton size="sm" continueLabel="Open Dashboard" />
            </>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <StartPreparingButton size="sm" />
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export function AuthNav() {
  return (
    <header className="border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Logo />
        <NavLink to="/" className={({ isActive }) => cn('text-sm text-ink-2 hover:text-accent-2 transition-colors', isActive && 'text-ink')}>
          Back to home
        </NavLink>
      </div>
    </header>
  )
}
