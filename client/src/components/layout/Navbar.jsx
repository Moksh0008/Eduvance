import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Logo } from '../brand/Logo'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { BulbToggle } from '../ui/BulbToggle'
import { AvatarDisplay } from '../ui/AvatarPicker'
import { PlanBadge } from '../domain/PlanBadge'
import { useAppState } from '../../context/AppState'
import { useAppData } from '../../hooks/useAppData'
import { api } from '../../services/api'

export function Navbar({ onMenu }) {
  const { user, demoMode } = useAppState()
  const data = useAppData()
  const hours = data.preferences?.dailyHours ?? 6
  const avatarId = (() => { try { return localStorage.getItem('edu-avatar') || null } catch { return null } })()
  const [plan, setPlan] = useState(null)

  useEffect(() => {
    if (!user) return
    api.get('/ai/subscription').then(r => { if (r) setPlan(r) }).catch(() => {})
    const onPlanChange = () => api.get('/ai/subscription').then(r => { if (r) setPlan(r) }).catch(() => {})
    window.addEventListener('subscription-changed', onPlanChange)
    return () => window.removeEventListener('subscription-changed', onPlanChange)
  }, [user])

  const planLabel = plan?.plan === 'premium' ? '👑 Premium' : plan?.plan === 'pro' ? '⚡ Pro' : 'Free Plan'

  return (
    <header className="flex h-14 items-center justify-between px-4 backdrop-blur-xl lg:px-6" style={{
      background: 'color-mix(in srgb, var(--color-canvas) 70%, transparent)',
    }}>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenu} aria-label="Open navigation">
          <Menu size={18} />
        </Button>
        <Logo to="/" className="lg:hidden" />
        <div className="hidden items-center gap-2 sm:flex">
          <AvatarDisplay avatarId={avatarId} size={28} />
          <div className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <p className="text-sm text-ink-2">
            <Link to="/profile" className="text-ink hover:text-accent-2 transition-colors" data-cursor="click">{user?.name}</Link>
            <span className="mx-2 text-ink-3">·</span>
            <Link to="/subscription" className="text-ink-3 hover:text-accent-2 transition-colors" data-cursor="click">{planLabel}</Link>
          </p>
        </div>
        {demoMode ? <Badge tone="accent">Demo</Badge> : null}
        {!demoMode && <PlanBadge compact />}
      </div>
      <div className="flex items-center gap-3">
        <Link to="/setup" className="hidden text-xs font-medium text-ink-2 hover:text-accent-2 transition-colors sm:inline" data-cursor="click">
          Edit preparation
        </Link>
        <BulbToggle />
      </div>
    </header>
  )
}
