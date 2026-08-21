import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Library,
  CalendarClock,
  RotateCcw,
  ListChecks,
  FileText,
  LineChart,
  ChartNoAxesCombined,
  ScanSearch,
  UserRound,
  SlidersHorizontal,
  PencilLine,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const groups = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Prepare',
    items: [
      { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
      { to: '/subjects', label: 'Subjects', icon: Library },
      { to: '/planner', label: 'Planner', icon: CalendarClock },
      { to: '/revision', label: 'Revision', icon: RotateCcw },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/quiz', label: 'Quiz', icon: ListChecks },
      { to: '/question-papers', label: 'Question papers', icon: FileText },
    ],
  },
  {
    label: 'Understand',
    items: [
      { to: '/progress', label: 'Progress', icon: LineChart },
      { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined },
      { to: '/insights', label: 'Insights', icon: ScanSearch },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: UserRound },
      { to: '/setup', label: 'Edit preparation', icon: PencilLine },
      { to: '/settings', label: 'Settings', icon: SlidersHorizontal },
    ],
  },
]

export function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col overflow-y-auto">
      {groups.map((group) => (
        <div key={group.label} className="px-3 py-2">
          <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-3">{group.label}</p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map(({ to, label, icon: Icon }) => (
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
        </div>
      ))}
    </nav>
  )
}
