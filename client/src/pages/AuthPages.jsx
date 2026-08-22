import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AuthNav } from '../components/layout/MarketingNav'
import { Button } from '../components/ui/Button'
import { useAppState } from '../context/AppState'
import { ApiError } from '../services/api'

/* ═══════════════════════════════════════════════════
   REACTIVE EVO MASCOT — watches email, whistles at password
   ═══════════════════════════════════════════════════ */

function ReactiveEvo({ focusedField }) {
  // Eye direction changes based on focused field
  const eyeState = focusedField === 'password' ? 'whistle' : focusedField === 'email' ? 'peek' : 'idle'
  
  return (
    <motion.div
      className="relative"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg width="220" height="260" viewBox="0 0 220 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Body */}
        <ellipse cx="110" cy="170" rx="65" ry="60" fill="#6366f1" />
        <ellipse cx="110" cy="170" rx="65" ry="60" fill="url(#evoBodyGrad)" />
        
        {/* Belly highlight */}
        <ellipse cx="110" cy="175" rx="40" ry="35" fill="#818cf8" opacity="0.3" />

        {/* Face area */}
        <ellipse cx="110" cy="140" rx="50" ry="45" fill="#e8eaf0" />

        {/* Eyebrows */}
        <AnimatePresence mode="wait">
          {eyeState === 'whistle' ? (
            <motion.g key="whistle-brows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Raised eyebrows — pretending not to see */}
              <line x1="82" y1="118" x2="96" y2="120" stroke="#4a4a5a" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="124" y1="120" x2="138" y2="118" stroke="#4a4a5a" strokeWidth="2.5" strokeLinecap="round" />
            </motion.g>
          ) : (
            <motion.g key="normal-brows" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1="84" y1="122" x2="98" y2="121" stroke="#4a4a5a" strokeWidth="2" strokeLinecap="round" />
              <line x1="122" y1="121" x2="136" y2="122" stroke="#4a4a5a" strokeWidth="2" strokeLinecap="round" />
            </motion.g>
          )}
        </AnimatePresence>

        {/* Eyes — animated based on state */}
        {eyeState === 'whistle' ? (
          <>
            {/* Eyes looking away — small dots, side-glance */}
            <motion.g
              animate={{ x: [0, 3, 3] }}
              transition={{ duration: 0.4 }}
            >
              <circle cx="95" cy="137" r="6" fill="#1a1d2e" />
              <circle cx="125" cy="137" r="6" fill="#1a1d2e" />
              {/* Pupils shifted right — looking away */}
              <motion.circle
                cx="98" cy="136" r="2.5" fill="white"
                animate={{ cx: [97, 99, 99] }}
                transition={{ duration: 0.6 }}
              />
              <motion.circle
                cx="128" cy="136" r="2.5" fill="white"
                animate={{ cx: [127, 129, 129] }}
                transition={{ duration: 0.6 }}
              />
            </motion.g>
            {/* Side-eye lines */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <line x1="140" y1="133" x2="148" y2="131" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="140" y1="137" x2="150" y2="137" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="140" y1="141" x2="148" y2="143" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" />
            </motion.g>
          </>
        ) : (
          <>
            {/* Normal eyes — looking forward */}
            <circle cx="95" cy="137" r="7" fill="#1a1d2e" />
            <circle cx="125" cy="137" r="7" fill="#1a1d2e" />
            {/* Highlights */}
            <circle cx="97" cy="135" r="2.5" fill="white" />
            <circle cx="127" cy="135" r="2.5" fill="white" />
            <circle cx="93" cy="139" r="1" fill="white" opacity="0.5" />
            <circle cx="123" cy="139" r="1" fill="white" opacity="0.5" />
            {/* Peek effect — pupils move toward center when email focused */}
            {eyeState === 'peek' && (
              <motion.g
                initial={{ x: 0 }}
                animate={{ x: [-1, -2, -1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <motion.circle
                  cx="93" cy="136" r="3" fill="#1a1d2e"
                  style={{ mixBlendMode: 'screen' }}
                />
              </motion.g>
            )}
          </>
        )}

        {/* Mouth */}
        <AnimatePresence mode="wait">
          {eyeState === 'whistle' ? (
            <motion.g key="whistle-mouth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Whistling O mouth */}
              <ellipse cx="110" cy="160" rx="5" ry="6" fill="#1a1d2e" />
              <ellipse cx="110" cy="159" rx="3" ry="4" fill="#c07080" />
              {/* Whistle musical notes */}
              <motion.text
                x="150" y="155" fontSize="14" fill="#818cf8"
                animate={{ y: [155, 140, 130], opacity: [0, 0.8, 0], x: [150, 160, 165] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }}
              >♪</motion.text>
              <motion.text
                x="160" y="165" fontSize="11" fill="#a78bfa"
                animate={{ y: [165, 148, 138], opacity: [0, 0.6, 0], x: [160, 168, 172] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
              >♫</motion.text>
            </motion.g>
          ) : (
            <motion.path
              key="normal-mouth"
              d={eyeState === 'peek' ? "M95 155 Q110 168 125 155" : "M98 155 Q110 164 122 155"}
              stroke="#1a1d2e"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Blush */}
        <ellipse cx="78" cy="152" rx="8" ry="4" fill="#f0a0b0" opacity={eyeState === 'peek' ? 0.7 : 0.4} />
        <ellipse cx="142" cy="152" rx="8" ry="4" fill="#f0a0b0" opacity={eyeState === 'peek' ? 0.7 : 0.4} />

        {/* Graduation cap */}
        <polygon points="110,70 70,90 110,105 150,90" fill="#1a1d2e" />
        <rect x="106" y="88" width="8" height="6" fill="#1a1d2e" />
        <circle cx="110" cy="70" r="4" fill="#eab308" />
        <motion.line
          x1="110" y1="70" x2="120" y2="62"
          stroke="#eab308" strokeWidth="2" strokeLinecap="round"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '110px 70px' }}
        />
        <circle cx="120" cy="62" r="3" fill="#eab308" />

        {/* Arms */}
        {eyeState === 'whistle' ? (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Right arm raised — "I'm not looking" gesture */}
            <motion.ellipse
              cx="175" cy="130" rx="12" ry="7" fill="#6366f1"
              animate={{ rotate: [0, -5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: '160px 155px' }}
            />
            <circle cx="183" cy="125" r="7" fill="#e8eaf0" />
            {/* Left arm normal */}
            <ellipse cx="45" cy="170" rx="12" ry="7" fill="#6366f1" transform="rotate(-15 45 170)" />
            <circle cx="37" cy="167" r="6" fill="#e8eaf0" />
          </motion.g>
        ) : (
          <motion.g>
            {/* Left arm waving when peeking */}
            <motion.ellipse
              cx="38" cy="148" rx="12" ry="7" fill="#6366f1"
              animate={eyeState === 'peek' ? { rotate: [0, -20, 0] } : { rotate: 0 }}
              transition={{ duration: 1, repeat: eyeState === 'peek' ? Infinity : 0 }}
              style={{ transformOrigin: '52px 165px' }}
            />
            <motion.circle
              cx="30" cy="143" r="6" fill="#e8eaf0"
              animate={eyeState === 'peek' ? { cx: [30, 24, 30] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Right arm */}
            <ellipse cx="182" cy="170" rx="12" ry="7" fill="#6366f1" transform="rotate(15 182 170)" />
            <circle cx="190" cy="167" r="6" fill="#e8eaf0" />
          </motion.g>
        )}

        {/* Feet */}
        <ellipse cx="88" cy="225" rx="16" ry="8" fill="#4f46e5" />
        <ellipse cx="132" cy="225" rx="16" ry="8" fill="#4f46e5" />

        <defs>
          <linearGradient id="evoBodyGrad" x1="45" y1="110" x2="175" y2="230">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════
   ORBITAL VISUALIZATION — bigger, with emojis
   ═══════════════════════════════════════════════════ */

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
      {/* Central Evo badge */}
      <motion.div
        className="absolute left-1/2 top-1/2 z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-accent/30 flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(79,70,229,0.15))', boxShadow: '0 0 40px rgba(99,102,241,0.15)' }}
        animate={{ scale: [1, 1.06, 1], boxShadow: ['0 0 40px rgba(99,102,241,0.15)', '0 0 60px rgba(99,102,241,0.25)', '0 0 40px rgba(99,102,241,0.15)'] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <span className="text-2xl font-bold text-accent-2">Ev</span>
      </motion.div>

      {/* Orbiting nodes */}
      {orbitalNodes.map((node, i) => {
        const radius = 150
        return (
          <motion.div
            key={node.label}
            className="absolute flex flex-col items-center gap-1.5"
            style={{ left: '50%', top: '50%' }}
            animate={{
              x: [
                Math.cos(((node.angle - 90) * Math.PI) / 180) * radius,
                Math.cos(((node.angle - 90 + 360) * Math.PI) / 180) * radius,
              ],
              y: [
                Math.sin(((node.angle - 90) * Math.PI) / 180) * radius,
                Math.sin(((node.angle - 90 + 360) * Math.PI) / 180) * radius,
              ],
            }}
            transition={{ duration: 22 + i * 4, repeat: Infinity, ease: 'linear' }}
          >
            <motion.div
              className="h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-line-2 flex flex-col items-center justify-center shadow-lg gap-0.5"
              style={{ background: 'var(--color-surface)' }}
              whileHover={{ scale: 1.15, boxShadow: '0 0 20px rgba(99,102,241,0.2)' }}
            >
              <span className="text-lg">{node.emoji}</span>
              <span className="text-[8px] font-medium text-ink-3 leading-none">{node.label}</span>
            </motion.div>
          </motion.div>
        )
      })}

      {/* Decorative rings */}
      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />
      <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/15" />

      {/* Floating glow */}
      <div className="absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.04] blur-[60px]" />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   AUTH VISUAL — combines Evo + orbital
   ═══════════════════════════════════════════════════ */

function AuthVisual({ focusedField }) {
  return (
    <div className="relative flex h-full flex-col items-center justify-center gap-8 px-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-accent/[0.03] blur-[100px] rounded-3xl" />

      {/* Reactive Evo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
      >
        <ReactiveEvo focusedField={focusedField} />
      </motion.div>

      {/* Speech bubble */}
      <AnimatePresence mode="wait">
        <motion.div
          key={focusedField || 'default'}
          initial={{ opacity: 0, y: 8, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative rounded-2xl px-5 py-3 text-center text-sm font-medium text-ink"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-line-2)' }}
        >
          {focusedField === 'email' && "👀 I see you typing! Go ahead..."}
          {focusedField === 'password' && "🎵 La la la~ I'm not looking! 🔒"}
          {!focusedField && "Hi! I'm Evo — your study buddy! 🎓"}
          <div className="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2"
               style={{ borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '8px solid var(--color-surface)' }} />
        </motion.div>
      </AnimatePresence>

      {/* Orbital visualization below */}
      <OrbitalVisual />
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════ */

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
              <Field
                id="email" label="Email" type="email" value={email}
                onChange={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => !password && setFocusedField(null)}
              />
              <Field
                id="password" label="Password" type="password" value={password}
                onChange={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
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

        {/* Visual side — bigger, with Evo */}
        <div className="hidden border-l border-line bg-surface/30 lg:block">
          <AuthVisual focusedField={focusedField} />
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════ */

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
              <Field
                id="name" label="Full name" value={name}
                onChange={setName}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
              />
              <Field
                id="email" label="Email" type="email" value={email}
                onChange={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
              <Field
                id="password" label="Password" type="password" value={password}
                onChange={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
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
      <input
        id={id}
        name={id}
        type={type}
        required
        minLength={type === 'password' ? 6 : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        className="input mt-1.5"
      />
    </label>
  )
}
