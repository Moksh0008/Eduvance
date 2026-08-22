import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { AvatarDisplay, AvatarPicker } from '../components/ui/AvatarPicker'
import { useAuth } from '../context/AppState'
import { useAppData } from '../hooks/useAppData'
import { DemoBanner } from '../components/domain/ModeBanners'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const data = useAppData()
  const navigate = useNavigate()
  const student = data.student
  const [showPicker, setShowPicker] = useState(false)
  const [avatarId, setAvatarId] = useState(() => {
    try { return localStorage.getItem('edu-avatar') || null } catch { return null }
  })

  function handleAvatarSelect(id) {
    setAvatarId(id)
    try { localStorage.setItem('edu-avatar', id) } catch {}
    // Force navbar to re-render by reloading
    window.dispatchEvent(new Event('avatar-changed'))
  }

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
          <AvatarDisplay avatarId={avatarId} size={72} />
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-canvas/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-lg">✏️</span>
          </div>
        </motion.button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-accent-2">Profile</p>
          <h1 className="font-serif text-3xl text-ink">{user?.name || student.name}</h1>
          <p className="mt-1 text-sm text-ink-3">Signed in with a JWT session</p>
        </div>
      </div>

      <div className="card max-w-lg p-6">
        <dl className="text-sm">
          <Row label="Email" value={user?.email || student.email} />
          <Row label="Daily study window" value={`${(data.preferences?.dailyHours || 3)} hours`} />
          <Row label="Mode" value={data.isDemo ? 'Demo sample data' : 'Your workspace'} />
        </dl>
      </div>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button as={Link} to="/setup" variant="secondary">
          Edit preparation
        </Button>
        <Button as={Link} to="/settings" variant="ghost">
          Settings
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Log out
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
