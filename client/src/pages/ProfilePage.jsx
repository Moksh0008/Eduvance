import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'
import { getStudent } from '../services/catalog'

export function ProfilePage() {
  const student = getStudent()

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title={student.name}
        description="Preferences for the optimizer. Saved locally in the UI for this phase."
      />
      <dl className="max-w-lg space-y-4 text-sm">
        <Row label="Email" value={student.email} />
        <Row label="Program" value={student.program} />
        <Row label="Semester" value={String(student.semester)} />
        <Row label="Daily study window" value={`${student.dailyMinutes / 60} hours`} />
      </dl>
      <div className="mt-8 flex flex-wrap gap-2">
        <Button as={Link} to="/setup" variant="secondary">
          Reconfigure setup
        </Button>
        <Button as={Link} to="/settings" variant="ghost">
          Settings
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
