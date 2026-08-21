import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { ApiError } from '../services/api'

function AuthVisual() {
  return (
    <div className="relative hidden h-full items-center justify-center lg:flex">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-accent/[0.03] blur-[100px] rounded-3xl" />

      {/* Floating network nodes */}
      <div className="relative h-80 w-80">
        {/* Central node */}
        <motion.div
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <span className="text-lg font-bold text-accent-2">Ev</span>
        </motion.div>

        {/* Orbiting nodes */}
        {['Subjects', 'Topics', 'Progress', 'Plan', 'Priority'].map((label, i) => {
          const angle = (i / 5) * 360
          const radius = 120
          return (
            <motion.div
              key={label}
              className="absolute flex flex-col items-center gap-1"
              style={{ left: '50%', top: '50%' }}
              animate={{
                x: [
                  Math.cos(((angle - 90) * Math.PI) / 180) * radius,
                  Math.cos(((angle - 90 + 360) * Math.PI) / 180) * radius,
                ],
                y: [
                  Math.sin(((angle - 90) * Math.PI) / 180) * radius,
                  Math.sin(((angle - 90 + 360) * Math.PI) / 180) * radius,
                ],
              }}
              transition={{ duration: 25 + i * 3, repeat: Infinity, ease: 'linear' }}
            >
              <div className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-surface border border-line-2 flex items-center justify-center shadow-lg">
                <div className="h-2 w-2 rounded-full bg-accent/60" />
              </div>
              <span className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-ink-3 font-medium">
                {label}
              </span>
            </motion.div>
          )
        })}

        {/* Decorative rings */}
        <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/40" />
        <div className="absolute left-1/2 top-1/2 h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/20" />
      </div>
    </div>
  )
}

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
      <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
        {/* Form side */}
        <div className="flex items-center justify-center px-4 py-16">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-4xl text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-2">
              Your workspace is loaded from your account — not from the last person on this browser.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
              <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-risk"
                >
                  {error}
                </motion.p>
              ) : null}
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                {pending ? 'Signing in…' : 'Log in'}
              </Button>
            </form>
            <p className="mt-6 text-sm text-ink-3">
              New here?{' '}
              <Link to="/register?intent=prepare" className="font-medium text-accent-2 hover:text-accent transition-colors">
                Create an account
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Visual side */}
        <div className="hidden border-l border-line bg-surface/30 lg:block">
          <AuthVisual />
        </div>
      </div>
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
      <div className="grid min-h-[calc(100vh-3.5rem)] lg:grid-cols-2">
        {/* Form side */}
        <div className="flex items-center justify-center px-4 py-16">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-serif text-4xl text-ink">Create your account</h1>
            <p className="mt-2 text-sm text-ink-2">
              Then configure timetable, syllabus, and study constraints. Each account has its own preparation.
            </p>
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <Field id="name" label="Full name" value={name} onChange={setName} />
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
              <Field id="password" label="Password" type="password" value={password} onChange={setPassword} />
              {error ? (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-risk"
                >
                  {error}
                </motion.p>
              ) : null}
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                {pending ? 'Creating account…' : 'Continue to setup'}
              </Button>
            </form>
            <p className="mt-6 text-sm text-ink-3">
              Already registered?{' '}
              <Link to="/login?next=/setup" className="font-medium text-accent-2 hover:text-accent transition-colors">
                Log in
              </Link>
            </p>
          </motion.div>
        </div>

        {/* Visual side */}
        <div className="hidden border-l border-line bg-surface/30 lg:block">
          <AuthVisual />
        </div>
      </div>
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
        className="input mt-1.5"
      />
    </label>
  )
}
