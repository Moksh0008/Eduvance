import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../services/api'
import { useAppState } from '../../context/AppState'

/**
 * PlanBadge — shows current plan (Free/Premium) and AI usage.
 * Non-intrusive, fits existing design.
 */
export function PlanBadge({ compact = false }) {
  const { session } = useAppState()
  const [plan, setPlan] = useState(null)
  const [usage, setUsage] = useState(null)

  useEffect(() => {
    if (!session?.token) return

    async function load() {
      try {
        const [subResult, usageResult] = await Promise.all([
          api.get('/ai/subscription'),
          api.get('/ai/usage'),
        ])
        if (subResult) setPlan(subResult)
        if (usageResult) setUsage(usageResult)
      } catch (err) {
        console.error('[PlanBadge] Failed to load:', err.message)
      }
    }

    load()
  }, [session?.token])

  if (!plan) return null

  const isPremium = plan.plan === 'premium' && plan.isActive
  const remaining = usage?.remaining ?? '?'
  const limit = usage?.limit ?? '?'

  if (compact) {
    return (
      <Link to="/subscription" className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider hover:opacity-80 transition-opacity">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: isPremium ? '#a78bfa' : 'var(--color-ink-3)' }}
        />
        <span style={{ color: isPremium ? '#a78bfa' : 'var(--color-ink-3)' }}>
          {isPremium ? 'Premium' : 'Free Plan'}
        </span>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--color-card)' }}>
      {/* Plan badge */}
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{
          background: isPremium ? 'rgba(167,139,250,0.15)' : 'var(--color-surface)',
          color: isPremium ? '#a78bfa' : 'var(--color-ink-3)',
        }}
      >
        {isPremium ? '⭐' : '○'} {isPremium ? 'Premium' : 'Free'}
      </span>

      {/* AI usage */}
      {usage && (
        <span className="text-[10px] text-ink-3">
          AI: <span className={remaining === 0 ? 'text-red-400 font-medium' : 'text-ink-2'}>{remaining}</span>/{limit} today
        </span>
      )}
    </div>
  )
}

/**
 * PlanGate — conditionally renders children based on feature access.
 * Shows upgrade prompt if feature is locked.
 */
export function PlanGate({ feature, children, upgradePrompt }) {
  const { session } = useAppState()
  const [access, setAccess] = useState(null)

  useEffect(() => {
    if (!session?.token || !feature) return

    async function check() {
      try {
        const result = await api.get(`/ai/subscription`)
        // Simple client-side check based on plan
        const isPremium = result?.plan === 'premium' && result?.isActive
        setAccess({ allowed: isPremium || feature === 'ai-generation', plan: result?.plan })
      } catch {
        setAccess({ allowed: true }) // fail open for non-critical features
      }
    }

    check()
  }, [session?.token, feature])

  if (!access) return null

  if (access.allowed) return children

  return (
    <div className="rounded-xl border border-dashed p-4 text-center" style={{ borderColor: 'var(--color-line)' }}>
      <p className="text-sm text-ink-2">{upgradePrompt || 'This feature requires Premium'}</p>
      <a
        href="#upgrade"
        className="mt-2 inline-block text-xs font-medium text-accent-2 hover:underline"
      >
        Learn more →
      </a>
    </div>
  )
}
