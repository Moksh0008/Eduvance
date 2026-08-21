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

const iconAnimations = {
  '/dashboard': { hover: { rotate: [0, -6, 6, 0], transition: { duration: 0.35 } } },
  '/syllabus': { hover: { rotateY: 15, transition: { duration: 0.25 } } },
  '/subjects': { hover: { scale: 1.12, transition: { type: 'spring', stiffness: 400, damping: 15 } } },
  '/planner': { hover: { y: -2, transition: { type: 'spring', stiffness: 500, damping: 20 } } },
  '/revision': { hover: { rotate: -180, transition: { duration: 0.45, ease: 'easeOut' } } },
  '/quiz': { hover: { scale: [1, 1.15, 1], transition: { duration: 0.3 } } },
  '/question-papers': { hover: { y: -2, x: 1, transition: { type: 'spring', stiffness: 400, damping: 18 } } },
  '/progress': { hover: { scaleY: 1.12, originY: 1, transition: { duration: 0.25 } } },
  '/analytics': { hover: { y: -1, scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 20 } } },
  '/insights': { hover: { scale: 1.12, rotate: 12, transition: { type: 'spring', stiffness: 350, damping: 15 } } },
  '/profile': { hover: { y: -2, transition: { type: 'spring', stiffness: 400, damping: 18 } } },
  '/setup': { hover: { rotate: 45, transition: { duration: 0.3 } } },
  '/settings': { hover: { rotate: 90, transition: { duration: 0.35 } } },
}

function SidebarItem({ to, label, icon: Icon, onNavigate }) {
  const reduce = useReducedMotion()
  const anim = iconAnimations[to] || {}

  return (
    <li>
      <NavLink
        to={to}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-250',
            isActive
              ? 'font-medium'
              : 'text-ink-2 hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            {/* Active indicator — floating, no borders */}
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'var(--color-accent-soft)',
                  boxShadow: '0 0 24px var(--color-accent-glow), inset 0 1px 0 rgba(255,255,255,0.04)',
                }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Hover glow — no border, just light */}
            {!isActive && (
              <div
                className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: 'var(--color-accent-soft)' }}
              />
            )}

            {/* Icon */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              whileHover={reduce ? undefined : anim.hover}
              transition={anim.hover?.transition || { type: 'spring', stiffness: 400, damping: 20 }}
            >
              <Icon
                size={16}
                strokeWidth={1.6}
                aria-hidden="true"
                className={cn(
                  'transition-colors duration-200',
                  isActive ? 'text-accent-2' : 'text-ink-3 group-hover:text-accent-2',
                )}
              />
            </motion.div>

            <span className="relative z-10 transition-colors duration-200">{label}</span>
          </>
        )}
      </NavLink>
    </li>
  )
}

export function Sidebar({ onNavigate }) {
  return (
    <nav aria-label="Application" className="flex h-full flex-col overflow-y-auto px-3 py-3">
      {groups.map((group, gi) => (
        <div key={group.label} className={gi > 0 ? 'mt-5' : ''}>
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-3/50">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => (
              <SidebarItem key={item.to} {...item} onNavigate={onNavigate} />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
