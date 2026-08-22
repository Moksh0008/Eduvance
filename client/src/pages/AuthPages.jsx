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
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail}
                onFocus={() => setFocusedField('email')} onBlur={() => !password && setFocusedField(null)} />
              <Field id="password" label="Password" type="password" value={password} onChange={setPassword}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
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
            <form onSubmit={onSubmit} className="mt-8 space-y-4">
              <Field id="name" label="Full name" value={name} onChange={setName}
                onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)} />
              <Field id="email" label="Email" type="email" value={email} onChange={setEmail}
                onFocus={() => setFocusedField('email')} onBlur={() => !password && setFocusedField(null)} />
              <Field id="password" label="Password" type="password" value={password} onChange={setPassword}
                onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
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

function Field({ id, label, type = 'text', value, onChange, onFocus, onBlur }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-ink-3">{label}</span>
      <input id={id} name={id} type={type} required minLength={type === 'password' ? 6 : undefined}
        value={value} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} onBlur={onBlur}
        className="input mt-1.5" />
    </label>
  )
}
