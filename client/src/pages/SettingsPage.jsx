import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Button } from '../components/ui/Button'

export function SettingsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Optimizer preferences. Persistence ships with the backend."
      />
      <ul className="max-w-lg divide-y divide-line border-t border-line text-sm">
        <li className="flex items-center justify-between py-4">
          <span>Re-run academic setup</span>
          <Button as={Link} to="/setup" size="sm" variant="secondary">
            Open setup
          </Button>
        </li>
        <li className="flex items-center justify-between py-4">
          <span>Exam timetable</span>
          <Button as={Link} to="/timetable" size="sm" variant="ghost">
            View
          </Button>
        </li>
        <li className="flex items-center justify-between py-4">
          <span>Study session timer</span>
          <Button as={Link} to="/study-session" size="sm" variant="ghost">
            Open
          </Button>
        </li>
        <li className="flex items-center justify-between py-4">
          <span>Notifications</span>
          <span className="text-ink-3">Frontend only</span>
        </li>
      </ul>
    </div>
  )
}
