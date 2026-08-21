import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { ApiError } from '../services/api'

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login } = useAppState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      const { workspace } = await login({ email, password })
      const next = params.get('next')
      if (next) navigate(next)
      else navigate(workspace.setupCompleted || workspace.onboardingComplete ? '/dashboard' : '/setup')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not log in')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNav />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-ink-2">Your workspace is loaded from your account — not from the last person on this browser.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
          {error ? <p className="text-sm text-risk">{error}</p> : null}
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Signing in…' : 'Log in'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-2">
          New here?{' '}
          <Link to="/register?intent=prepare" className="font-medium text-accent hover:underline">
            Create an account
          </Link>
        </p>
      </main>
    </div>
  )
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAppState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setPending(true)
    try {
      await register({ name, email, password })
      navigate('/setup')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas">
      <AuthNav />
      <main className="mx-auto max-w-md px-4 py-16">
        <h1 className="font-serif text-4xl text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-ink-2">Then configure timetable, syllabus, and study constraints. Each account has its own preparation.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field id="name" label="Full name" value={name} onChange={setName} />
          <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
          <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
          {error ? <p className="text-sm text-risk">{error}</p> : null}
          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? 'Creating account…' : 'Continue to setup'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-2">
          Already registered?{' '}
          <Link to="/login?next=/setup" className="font-medium text-accent hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  )
}

function Field({ id, label, type = 'text', value, onChange }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-3">{label}</span>
      <input
        id={id}
        name={id}
        type={type}
        required
        minLength={type === 'password' ? 6 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 h-11 w-full border border-line bg-surface px-3 text-sm text-ink outline-none focus:border-accent"
      />
    </label>
  )
}
