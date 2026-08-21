import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'

export function SetupShell({ children, step, total, onDemo, editing }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-line">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Logo to="/" />
          <div className="flex items-center gap-3">
            {editing ? (
              <Link to="/dashboard" className="text-xs font-medium text-accent hover:underline">
                Back to dashboard
              </Link>
            ) : null}
            <p className="text-xs text-ink-3">
              {editing ? 'Edit preparation' : 'Setup'} {step} / {total}
            </p>
          </div>
        </div>
        <div className="flex h-1 w-full" aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <div key={i} className={`h-full flex-1 ${i < step ? 'bg-ink' : 'bg-line'}`} />
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:py-14">{children}</main>
      <p className="px-4 pb-8 text-center text-xs text-ink-3">
        Uploads are stored locally. The analysis engine is not connected yet.{' '}
        {onDemo ? (
          <button type="button" onClick={onDemo} className="underline hover:text-ink">
            Explore CSE demo data instead
          </button>
        ) : (
          <Link to="/" className="underline hover:text-ink">
            Back to home
          </Link>
        )}
      </p>
    </div>
  )
}
