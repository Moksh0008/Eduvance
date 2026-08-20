import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarClock,
  BookOpen,
  Library,
  CalendarDays,
  LineChart,
  ChartNoAxesCombined,
  FileText,
  Timer,
  UserRound,
  Settings2,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/planner', label: 'Planner', icon: CalendarClock },
  { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
  { to: '/subjects', label: 'Subjects', icon: Library },
  { to: '/timetable', label: 'Timetable', icon: CalendarDays },
  { to: '/progress', label: 'Progress', icon: LineChart },
  { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { to: '/question-papers', label: 'Papers', icon: FileText },
  { to: '/study-session', label: 'Session', icon: Timer },
  { to: '/setup', label: 'Setup', icon: Settings2 },
  { to: '/profile', label: 'Profile', icon: UserRound },
]

export function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col">
      <ul className="flex flex-1 flex-col gap-0.5 p-3">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                  isActive ? 'bg-canvas-2 font-medium text-ink' : 'text-ink-2 hover:bg-canvas-2/70 hover:text-ink',
                )
              }
            >
              <Icon size={16} strokeWidth={1.6} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
