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

/* Icon-specific hover animations — each nav item gets a unique micro-interaction */
const iconAnimations = {
  '/dashboard': { hover: { rotate: [0, -8, 8, 0], transition: { duration: 0.4 } } },
  '/syllabus': { hover: { rotateY: 20, transition: { duration: 0.3 } } },
  '/subjects': { hover: { scale: 1.15, transition: { type: 'spring', stiffness: 400, damping: 15 } } },
  '/planner': { hover: { y: -2, transition: { type: 'spring', stiffness: 500, damping: 20 } } },
  '/revision': { hover: { rotate: -180, transition: { duration: 0.5, ease: 'easeOut' } } },
  '/quiz': { hover: { scale: [1, 1.2, 1], transition: { duration: 0.35 } } },
  '/question-papers': { hover: { y: -2, x: 1, transition: { type: 'spring', stiffness: 400, damping: 18 } } },
  '/progress': { hover: { scaleY: 1.15, originY: 1, transition: { duration: 0.3 } } },
  '/analytics': { hover: { y: -1, scale: 1.1, transition: { type: 'spring', stiffness: 400, damping: 20 } } },
  '/insights': { hover: { scale: 1.15, rotate: 15, transition: { type: 'spring', stiffness: 350, damping: 15 } } },
  '/profile': { hover: { y: -2, transition: { type: 'spring', stiffness: 400, damping: 18 } } },
  '/setup': { hover: { rotate: 45, transition: { duration: 0.35, ease: 'easeOut' } } },
  '/settings': { hover: { rotate: 90, transition: { duration: 0.4, ease: 'easeOut' } } },
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
            'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200',
            isActive
              ? 'bg-accent-soft text-accent-2 font-medium'
              : 'text-ink-2 hover:bg-surface-2 hover:text-ink',
          )
        }
      >
        {({ isActive }) => (
          <>
            {/* Animated active indicator with glow */}
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 rounded-lg"
                style={{
                  background: 'var(--color-accent-soft)',
                  boxShadow: '0 0 20px var(--color-accent-glow), 0 0 40px var(--color-glow)',
                }}
                transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Hover glow effect (non-active items) */}
            {!isActive && (
              <div
                className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: 'var(--color-accent-soft)',
                  boxShadow: '0 0 16px var(--color-glow)',
                }}
              />
            )}

            {/* Icon with unique micro-interaction */}
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

            {/* Active dot indicator */}
            {isActive && (
              <motion.div
                className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
              />
            )}
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
          {gi < groups.length - 1 && <div className="mx-3 mt-4" />}
        </div>
      ))}
    </nav>
  )
}
