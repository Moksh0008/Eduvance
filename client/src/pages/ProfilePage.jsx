import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { AvatarDisplay, AvatarPicker } from '../components/ui/AvatarPicker'
import { useAuth } from '../context/AppState'
import { useAppData } from '../hooks/useAppData'
import { DemoBanner } from '../components/domain/ModeBanners'
import { api } from '../services/api'

function SubscriptionCard({ subscription, aiUsage }) {
  if (!subscription) return null
  const planId = subscription.plan || 'free'
  const planColor = planId === 'premium' ? '#a78bfa' : planId === 'pro' ? '#3b82f6' : '#6b7280'
  const planIcon = planId === 'premium' ? '👑' : planId === 'pro' ? '⚡' : '○'
  const planLabel = planId === 'premium' ? 'Premium' : planId === 'pro' ? 'Pro' : 'Free'
  const planPrice = planId === 'premium' ? '₹199/mo' : planId === 'pro' ? '₹99/mo' : 'Free'
  const maxQ = subscription.features?.maxQuizQuestions || (planId === 'premium' ? 50 : planId === 'pro' ? 30 : 15)
  const aiLimit = subscription.features?.dailyAiLimit || (planId === 'premium' ? 20 : planId === 'pro' ? 10 : 3)

  return (
    <div
      className="max-w-lg mb-4 rounded-2xl p-6 overflow-hidden relative"
      style={{
        background: 'var(--color-card)',
        border: `2px solid ${planColor}40`,
        boxShadow: `0 0 30px ${planColor}10`,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10" style={{ background: `radial-gradient(circle at top right, ${planColor}, transparent 70%)` }} />

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">Subscription</h2>
          <Link to="/subscription" className="text-[10px] font-medium text-accent-2 hover:underline">
            {planId === 'free' ? 'Upgrade plan →' : 'Manage plan →'}
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
              style={{ background: `${planColor}15` }}
            >
              {planIcon}
            </div>
            <div>
              <p className="text-lg font-bold" style={{ color: planColor }}>{planLabel} Plan</p>
              <p className="text-xs text-ink-3">{planPrice}</p>
            </div>
          </div>
          <span
            className="rounded-full px-3 py-1 text-[10px] font-bold uppercase"
            style={{ background: `${planColor}15`, color: planColor }}
          >
            {subscription.status || 'active'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl p-3 text-center" style={{ background: `${planColor}08` }}>
            <p className="text-lg font-bold text-ink">{maxQ}</p>
            <p className="text-[10px] text-ink-3">max questions</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${planColor}08` }}>
            <p className="text-lg font-bold text-ink">{aiLimit}</p>
            <p className="text-[10px] text-ink-3">AI / day</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: `${planColor}08` }}>
            <p className="text-lg font-bold text-ink">{aiUsage?.remaining ?? '?'}</p>
            <p className="text-[10px] text-ink-3">remaining</p>
          </div>
        </div>

        {aiUsage && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] text-ink-3 mb-1">
              <span>AI generations today</span>
              <span>{aiUsage.used || 0} / {aiUsage.limit}</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.min(100, ((aiUsage.used || 0) / (aiUsage.limit || 1)) * 100)}%`,
                  background: (aiUsage.remaining || 0) === 0 ? '#ef4444' : planColor,
                }}
              />
            </div>
          </div>
        )}

        {planId === 'free' && (
          <Link
            to="/subscription"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #a78bfa)' }}
          >
            ✨ Upgrade to Pro or Premium
          </Link>
        )}
        {planId === 'pro' && (
          <Link
            to="/subscription"
            className="mt-2 flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)' }}
          >
            👑 Upgrade to Premium
          </Link>
        )}
      </div>
    </div>
  )
}

export function ProfilePage() {
  const { user, logout } = useAuth()
  const data = useAppData()
  const navigate = useNavigate()
  const student = data.student
  const [showPicker, setShowPicker] = useState(false)
  const [subscription, setSubscription] = useState(null)
  const [aiUsage, setAiUsage] = useState(null)
  const [avatarId, setAvatarId] = useState(() => {
    try { return localStorage.getItem('edu-avatar') || null } catch { return null }
  })

  function handleAvatarSelect(id) {
    setAvatarId(id)
    try { localStorage.setItem('edu-avatar', id) } catch {}
    window.dispatchEvent(new Event('avatar-changed'))
  }

  useEffect(() => {
    async function loadSubscription() {
      try {
        const [subResult, usageResult] = await Promise.all([
          api.get('/ai/subscription'),
          api.get('/ai/usage'),
        ])
        if (subResult) setSubscription(subResult)
        if (usageResult) setAiUsage(usageResult)
      } catch (err) {
        console.error('[Profile] Failed to load subscription:', err.message)
      }
    }
    loadSubscription()
  }, [])

  const subjects = data.subjects || []
  const totalTopics = subjects.reduce((acc, s) => acc + (s.topics?.length || 0), 0)
  const hours = data.preferences?.dailyHours || 3
  const examDate = data.preferences?.examDate
  const daysLeft = examDate ? Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000)) : null

  return (
    <div>
      <DemoBanner />

      {/* Avatar + Name header */}
      <div className="mb-8 flex items-center gap-5">
        <motion.button
          whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
          onClick={() => setShowPicker(true)}
          className="relative group"
          title="Change avatar"
        >
          <AvatarDisplay avatarId={avatarId} size={80} />
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-canvas/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-lg">✏️</span>
          </div>
        </motion.button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-2">Profile</p>
          <h1 className="font-serif text-3xl text-ink">{user?.name || student.name}</h1>
          <p className="mt-1 text-sm text-ink-3">{user?.email || student.email}</p>
        </div>
      </div>

      {/* Account info card */}
      <div className="card max-w-lg p-6 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-3">Account</h2>
        <dl className="text-sm">
          <Row label="📧 Email" value={user?.email || student.email} />
          <Row label="👤 Name" value={user?.name || student.name} />
        </dl>
      </div>

      {/* Subscription card */}
      <SubscriptionCard subscription={subscription} aiUsage={aiUsage} />

      {/* Study profile card */}
      <div className="card max-w-lg p-6 mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3 mb-3">Study Profile</h2>
        <dl className="text-sm">
          <Row label="⏰ Daily study" value={`${hours} hours`} />
          <Row label="📚 Subjects" value={`${subjects.length} subjects`} />
          <Row label="📝 Total topics" value={`${totalTopics} topics`} />
          {daysLeft !== null && <Row label="📅 Exam in" value={`${daysLeft} days`} />}
          <Row label="🏠 Mode" value={data.isDemo ? 'Demo data' : 'Your workspace'} />
        </dl>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 max-w-lg mb-6">
        {[
          { emoji: '📚', label: 'Subjects', value: subjects.length },
          { emoji: '📝', label: 'Topics', value: totalTopics },
          { emoji: '⏱', label: 'hrs/day', value: hours },
        ].map(stat => (
          <motion.div key={stat.label}
            whileHover={{ y: -2, scale: 1.02 }}
            className="rounded-xl p-3 text-center"
            style={{ background: 'var(--color-card)', border: '1px solid var(--color-line-2)' }}>
            <span className="text-lg">{stat.emoji}</span>
            <p className="text-lg font-bold text-ink mt-1">{stat.value}</p>
            <p className="text-[10px] text-ink-3">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 max-w-lg">
        <Button as={Link} to="/setup" variant="secondary">
          ✏️ Edit preparation
        </Button>
        <Button as={Link} to="/settings" variant="ghost">
          ⚙️ Settings
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          🚪 Log out
        </Button>
      </div>

      {showPicker && (
        <AvatarPicker
          currentAvatar={avatarId}
          onSelect={handleAvatarSelect}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-t border-line py-3">
      <dt className="text-ink-3">{label}</dt>
      <dd className="font-medium text-ink">{value}</dd>
    </div>
  )
}
