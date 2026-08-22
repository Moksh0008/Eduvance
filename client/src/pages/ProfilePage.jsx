import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    window.dispatchEvent(new Event('avatar-changed'))
  }

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
          <Row label="🔑 Auth" value="JWT session" />
          <Row label="💾 Storage" value="MongoDB" />
        </dl>
      </div>

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
