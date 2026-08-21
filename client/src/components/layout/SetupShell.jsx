import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'

export function SetupShell({ children, step, total }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo to="/" />
          <p className="text-xs text-ink-3">
            Setup {step} / {total}
          </p>
        </div>
        <div className="flex h-1 w-full" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`h-full flex-1 ${i < step ? 'bg-ink' : 'bg-line'}`} />
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">{children}</main>
      <p className="pb-8 text-center text-xs text-ink-3">
        Simulated intelligence for this phase.{' '}
        <Link to="/dashboard" className="underline hover:text-ink">
          Skip to dashboard
        </Link>
      </p>
    </div>
  )
}
