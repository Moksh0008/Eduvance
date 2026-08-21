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
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'

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

function SidebarItem({ to, label, icon: Icon, onNavigate }) {
  const reduce = useReducedMotion()
  return (
    <li>
      <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
            isActive
              ? 'bg-accent-soft text-accent-2 font-medium'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg bg-accent-soft"
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Icon
              size={16}
              strokeWidth={1.6}
              aria-hidden="true"
              className={cn(
                'relative z-10 transition-transform duration-200',
                isActive ? 'text-accent-2' : 'text-ink-3 group-hover:text-ink-2',
                !reduce && 'group-hover:scale-110',
              )}
            />
            <span className="relative z-10">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  )
}

export function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col overflow-y-auto py-2">
      {groups.map((group, gi) => (
        <div key={group.label} className="px-3 py-1.5">
          <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3/60">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <SidebarItem key={item.to} {...item} onNavigate={onNavigate} />
            ))}
          </ul>
          {gi < groups.length - 1 && <div className="mx-3 mt-3 border-t border-line" />}
        </div>
      ))}
    </nav>
  )
}
