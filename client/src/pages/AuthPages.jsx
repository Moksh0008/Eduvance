import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { ApiError } from '../services/api'

/* ═══════════════════════════════════════════════════
   ═══════════════════════════════════════════════════ */

/* ═══ ORBITAL VISUALIZATION ═══ */
const orbitalNodes = [
  { label: 'Subjects', emoji: '📚', angle: 0 },
  { label: 'Topics', emoji: '🎯', angle: 72 },
  { label: 'Progress', emoji: '📈', angle: 144 },
  { label: 'Plan', emoji: '🗓', angle: 216 },
  { label: 'Priority', emoji: '⚡', angle: 288 },
]

function OrbitalVisual() {
  return (
    <div className="relative h-[380px] w-[380px]">
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent/30 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15))', boxShadow: '0 0 40px rgba(99,102,241,0.15)' }}
        animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 40px rgba(99,102,241,0.15)', '0 0 60px rgba(99,102,241,0.25)', '0 0 40px rgba(99,102,241,0.15)'] }}
        transition={{ duration: 3, repeat: Infinity }}>
        <span className="text-2xl font-bold text-accent-2">Ev</span>
      </motion.div>
      {orbitalNodes.map((node, i) => {
        const radius = 150
        return (
          <motion.div key={node.label} className="absolute flex flex-col items-center gap-1.5"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [Math.cos(((node.angle - 90) * Math.PI) / 180) * radius, Math.cos(((node.angle - 90 + 360) * Math.PI) / 180) * radius],
              y: [Math.sin(((node.angle - 90) * Math.PI) / 180) * radius, Math.sin(((node.angle - 90 + 360) * Math.PI) / 180) * radius],
            }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: 'linear' }}>
            <motion.div className="h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line-2 flex flex-col items-center justify-center shadow-lg gap-0.5"
              style={{ background: 'var(--color-surface)' }}
              whileHover={{ scale: 1.15, boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
              <span className="text-lg">{node.emoji}</span>
              <span className="text-[8px] font-medium text-ink-3 leading-none">{node.label}</span>
            </motion.div>
          </motion.div>
        )
      })}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
      <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/15" />
      <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[60px]" />
    </div>
  )
}

function AuthVisual() {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-8">
      <div className="pointer-events-none absolute inset-0 bg-accent/[0.03] blur-[100px] rounded-3xl" />
      <OrbitalVisual />
    </div>
  )
}

/* ═══ LOGIN PAGE ═══ */
export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { login } = useAppState()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)
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
        <div className="flex items-center justify-center px-4 py-16">
          <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-serif text-4xl text-ink">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-2">Your workspace is loaded from your account — not from the last person on this browser.</p>
            <div className="mt-8">
              <GoogleButton onClick={() => window.location.href = '/api/auth/google'} />
              <Divider />
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail}
                onFocus={() => setFocusedField('email')} onBlur={() => !password && setFocusedField(null)} />
              <div>
                <Field id="password" label="Password" type="password" value={password} onChange={setPassword}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
                <div className="mt-1 text-right">
                  <Link to="/forgot-password" className="text-[11px] text-accent-2 hover:text-accent transition-colors">Forgot password?</Link>
                </div>
              </div>
              {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-risk">{error}</motion.p>}
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                {pending ? 'Signing in…' : 'Log in'}
              </Button>
            </form>
            <p className="mt-6 text-sm text-ink-3">
              New here?{' '}
              <Link to="/register?intent=prepare" className="font-medium text-accent-2 hover:text-accent transition-colors">Create an account</Link>
            </p>
          </motion.div>
        </div>
        <div className="hidden border-l border-line bg-surface/30 lg:block">
          <AuthVisual />
        </div>
      </div>
    </div>
  )
}

/* ═══ REGISTER PAGE ═══ */
export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAppState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [focusedField, setFocusedField] = useState(null)
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
        <div className="flex items-center justify-center px-4 py-16">
          <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-serif text-4xl text-ink">Create your account</h1>
            <p className="mt-2 text-sm text-ink-2">Then configure timetable, syllabus, and study constraints.</p>
            <div className="mt-8">
              <GoogleButton onClick={() => window.location.href = '/api/auth/google'} />
              <Divider />
            </div>
            <form onSubmit={onSubmit} className="space-y-4">
              <Field id="name" label="Full name" value={name} onChange={setName}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail}
                onFocus={() => setFocusedField('email')} onBlur={() => !password && setFocusedField(null)} />
              <Field id="password" label="Password" type="password" value={password} onChange={setPassword}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} showStrength />
              {error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-risk">{error}</motion.p>}
              <Button type="submit" className="w-full" size="lg" disabled={pending}>
                {pending ? 'Creating account…' : 'Continue to setup'}
              </Button>
            </form>
            <p className="mt-6 text-sm text-ink-3">
              Already registered?{' '}
              <Link to="/login?next=/setup" className="font-medium text-accent-2 hover:text-accent transition-colors">Log in</Link>
            </p>
          </motion.div>
        </div>
        <div className="hidden border-l border-line bg-surface/30 lg:block">
          <AuthVisual />
        </div>
      </div>
    </div>
  )
}

function Field({ id, label, type = 'text', value, onChange, onFocus, onBlur, showStrength }) {
  const strength = showStrength ? getPasswordStrength(value) : null
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-3">{label}</span>
      <input id={id} name={id} type={type} required minLength={type === 'password' ? 6 : undefined}
        value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur}
        className="input mt-1.5" />
      {showStrength && value.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map(i => (
              <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                style={{ background: i < strength.level ? strength.color : 'var(--color-line-2)' }} />
            ))}
          </div>
          <p className="mt-1 text-[10px]" style={{ color: strength.color }}>{strength.label}</p>
        </div>
      )}
    </label>
  )
}

function getPasswordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' }
  if (score <= 2) return { level: 2, label: 'Fair', color: '#f97316' }
  if (score <= 3) return { level: 3, label: 'Good', color: '#22c55e' }
  return { level: 4, label: 'Strong', color: '#16a34a' }
}

function GoogleButton({ onClick }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-lg border border-line-2 bg-surface px-4 py-3 text-sm font-medium text-ink transition-all hover:bg-surface-2 hover:border-accent/30">
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </button>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-4">
      <div className="flex-1 h-px" style={{ background: 'var(--color-line-2)' }} />
      <span className="text-[10px] uppercase tracking-wider text-ink-3">or</span>
      <div className="flex-1 h-px" style={{ background: 'var(--color-line-2)' }} />
    </div>
  )
}
