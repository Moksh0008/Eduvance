import { Link, useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { useAuth } from '../context/AppState'
import { useAppData } from '../hooks/useAppData'
import { DemoBanner } from '../components/domain/ModeBanners'

export function ProfilePage() {
  const { user, logout } = useAuth()
  const data = useAppData()
  const navigate = useNavigate()
  const student = data.student

  return (
    <div>
      <DemoBanner />
      <PageHeader
        eyebrow="Profile"
        title={user?.name || student.name}
        description="Signed in with a JWT session. Preparation is stored per account in MongoDB."
      />
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
