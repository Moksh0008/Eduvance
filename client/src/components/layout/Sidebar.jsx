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
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, emoji: '🏠' }],
  },
  {
    label: 'Prepare',
    items: [
      { to: '/syllabus', label: 'Syllabus', icon: BookOpen, emoji: '📚' },
      { to: '/subjects', label: 'Subjects', icon: Library, emoji: '🧪' },
      { to: '/planner', label: 'Planner', icon: CalendarClock, emoji: '🗓' },
      { to: '/revision', label: 'Revision', icon: RotateCcw, emoji: '🔄' },
    ],
  },
  {
    label: 'Practice',
    items: [
      { to: '/quiz', label: 'Quiz', icon: ListChecks, emoji: '🎯' },
      { to: '/question-papers', label: 'Question papers', icon: FileText, emoji: '📝' },
    ],
  },
  {
    label: 'Understand',
    items: [
      { to: '/progress', label: 'Progress', icon: LineChart, emoji: '📈' },
      { to: '/analytics', label: 'Analytics', icon: ChartNoAxesCombined, emoji: '📊' },
      { to: '/insights', label: 'Insights', icon: ScanSearch, emoji: '💡' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/profile', label: 'Profile', icon: UserRound, emoji: '🧑' },
      { to: '/setup', label: 'Edit preparation', icon: PencilLine, emoji: '✏️' },
      { to: '/settings', label: 'Settings', icon: SlidersHorizontal, emoji: '⚙️' },
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

function SidebarItem({ to, label, icon: Icon, emoji, onNavigate }) {
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
              : 'text-ink-2 hover:text-ink hover:bg-white/[0.06]',
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
                  background: 'rgba(99,102,241,0.15)',
                  boxShadow: '0 0 24px rgba(99,102,241,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
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

            {/* Emoji + Icon */}
            <motion.div
              className="relative z-10 flex items-center justify-center"
              whileHover={reduce ? undefined : anim.hover}
              transition={anim.hover?.transition || { type: 'spring', stiffness: 400, damping: 20 }}
            >
              <span className="text-base mr-0.5" aria-hidden="true">{emoji}</span>
              <Icon
                size={14}
                strokeWidth={1.6}
                aria-hidden="true"
                className={cn(
                  'transition-colors duration-200 hidden',
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
        <div key={group.label} className={gi > 0 ? 'mt-6' : ''}>
          {/* Section divider line */}
          {gi > 0 && (
            <div className="mx-3 mb-3 h-px" style={{ background: 'var(--color-line-2, rgba(148,163,184,0.12))' }} />
          )}
          <p className="px-3 pb-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-ink-2">
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
