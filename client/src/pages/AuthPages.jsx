import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { ApiError } from '../services/api'

/* ═══════════════════════════════════════════════════
   REACTIVE OCTO — watches email, whistles at password
   ═══════════════════════════════════════════════════ */

const C = {
  body: '#6D4CD8', bodyLight: '#9B72FF', eye: '#34495E',
  cap: '#2ECC71', bow: '#FFD164', cheek: '#FFB6B9', star: '#FFD164',
}

function ReactiveOcto({ focusedField }) {
  const state = focusedField === 'password' ? 'whistle' : focusedField === 'email' ? 'peek' : 'idle'

  return (
    <motion.div className="relative"
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
      <svg width="220" height="260" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Tentacles */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
          const angle = (i * 45 - 90) * Math.PI / 180
          const bx = 60 + Math.cos(angle) * 30, by = 95 + Math.sin(angle) * 15
          const tx = 60 + Math.cos(angle) * 42, ty = 115 + Math.sin(angle) * 20
          const mx = 60 + Math.cos(angle) * 36, my = 108 + Math.sin(angle) * 22
          return (
            <motion.path key={i}
              d={`M${bx} ${by} Q${mx} ${my} ${tx} ${ty}`}
              stroke={C.body} strokeWidth="6" strokeLinecap="round" fill="none"
              animate={{ d: [`M${bx} ${by} Q${mx} ${my} ${tx} ${ty}`,
                             `M${bx} ${by} Q${mx + (i % 2 ? 4 : -4)} ${my + 2} ${tx + (i % 2 ? 5 : -5)} ${ty + 3}`,
                             `M${bx} ${by} Q${mx} ${my} ${tx} ${ty}`] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: 'easeInOut' }} />
          )
        })}

        {/* Body */}
        <ellipse cx="60" cy="85" rx="32" ry="28" fill={C.body} />
        <ellipse cx="60" cy="82" rx="30" ry="26" fill={C.bodyLight} />

        {/* Face */}
        <ellipse cx="60" cy="70" rx="24" ry="22" fill="#F7F9FC" opacity="0.95" />

        {/* Glasses */}
        <rect x="36" y="60" width="18" height="14" rx="4" fill="none" stroke={C.eye} strokeWidth="2" opacity="0.6" />
        <rect x="66" y="60" width="18" height="14" rx="4" fill="none" stroke={C.eye} strokeWidth="2" opacity="0.6" />
        <line x1="54" y1="67" x2="66" y2="67" stroke={C.eye} strokeWidth="1.5" opacity="0.5" />

        {/* Eyes */}
        {state === 'whistle' ? (
          <>
            {/* Looking away */}
            <circle cx="45" cy="67" r="5" fill={C.eye} />
            <circle cx="75" cy="67" r="5" fill={C.eye} />
            <motion.g animate={{ x: [0, 3, 3] }} transition={{ duration: 0.4 }}>
              <circle cx="48" cy="66" r="2" fill="white" />
              <circle cx="78" cy="66" r="2" fill="white" />
            </motion.g>
            {/* Side-glance lines */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 0.6, 0.6, 0] }} transition={{ duration: 2, repeat: Infinity }}>
              <line x1="88" y1="63" x2="95" y2="61" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="67" x2="97" y2="67" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="88" y1="71" x2="95" y2="73" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          </>
        ) : state === 'peek' ? (
          <>
            {/* Eyes looking toward center */}
            <circle cx="45" cy="67" r="5" fill={C.eye} />
            <circle cx="75" cy="67" r="5" fill={C.eye} />
            <motion.g animate={{ x: [-1, -2, -1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <circle cx="43" cy="66" r="2" fill="white" />
              <circle cx="73" cy="66" r="2" fill="white" />
            </motion.g>
          </>
        ) : (
          <>
            <circle cx="45" cy="67" r="5" fill={C.eye} />
            <circle cx="75" cy="67" r="5" fill={C.eye} />
            <circle cx="47" cy="65" r="2" fill="white" />
            <circle cx="77" cy="65" r="2" fill="white" />
          </>
        )}

        {/* Brows */}
        {state === 'whistle' ? (
          <>
            <line x1="40" y1="56" x2="50" y2="58" stroke={C.eye} strokeWidth="2" strokeLinecap="round" />
            <line x1="70" y1="58" x2="80" y2="56" stroke={C.eye} strokeWidth="2" strokeLinecap="round" />
          </>
        ) : (
          <>
            <line x1="40" y1="58" x2="50" y2="57" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
            <line x1="70" y1="57" x2="80" y2="58" stroke={C.eye} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          </>
        )}

        {/* Mouth */}
        {state === 'whistle' ? (
          <>
            <ellipse cx="60" cy="80" rx="4" ry="5" fill={C.eye} opacity="0.6" />
            {/* Musical notes */}
            <motion.text x="88" y="76" fontSize="12" fill={C.bodyLight}
              animate={{ y: [76, 60, 50], opacity: [0, 0.8, 0], x: [88, 95, 100] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}>♪</motion.text>
            <motion.text x="95" y="82" fontSize="10" fill={C.body}
              animate={{ y: [82, 65, 55], opacity: [0, 0.6, 0], x: [95, 102, 106] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}>♫</motion.text>
          </>
        ) : (
          <path d={state === 'peek' ? "M50 78 Q60 86 70 78" : "M52 78 Q60 84 68 78"}
            stroke={C.eye} strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {/* Blush */}
        <ellipse cx="36" cy="76" rx="5" ry="3" fill={C.cheek} opacity={state === 'peek' ? 0.7 : 0.4} />
        <ellipse cx="84" cy="76" rx="5" ry="3" fill={C.cheek} opacity={state === 'peek' ? 0.7 : 0.4} />

        {/* Bow tie */}
        <path d="M54 90 L60 94 L66 90 L60 98Z" fill={C.bow} />
        <circle cx="60" cy="94" r="2" fill="#FF8A3D" />

        {/* Graduation cap */}
        <polygon points="60,22 35,34 60,42 85,34" fill={C.cap} />
        <rect x="57" y="34" width="6" height="5" fill="#1a8a4a" />
        <circle cx="60" cy="22" r="3" fill={C.star} />
        <motion.line x1="60" y1="22" x2="68" y2="16" stroke={C.star} strokeWidth="2" strokeLinecap="round"
          animate={{ rotate: [0, 8, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
          style={{ transformOrigin: '60px 22px' }} />
        <circle cx="68" cy="16" r="2.5" fill={C.star} />
      </svg>
    </motion.div>
  )
}

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

function AuthVisual({ focusedField }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-6 px-8">
      <div className="pointer-events-none absolute inset-0 bg-accent/[0.03] blur-[100px] rounded-3xl" />
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}>
        <ReactiveOcto focusedField={focusedField} />
      </motion.div>
      <AnimatePresence mode="wait">
        <motion.div key={focusedField || 'default'}
          initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative rounded-2xl px-5 py-3 text-center text-sm font-medium text-ink"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}>
          {focusedField === 'email' && "👀 I see you typing! Go ahead..."}
          {focusedField === 'password' && "🎵 La la la~ I'm not looking! 🔒"}
          {!focusedField && "Hi! I'm Octo — your study buddy! 🐙"}
          <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2"
            style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '8px solid var(--color-surface)' }} />
        </motion.div>
      </AnimatePresence>
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
          <AuthVisual focusedField={focusedField} />
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
          <AuthVisual focusedField={focusedField} />
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
