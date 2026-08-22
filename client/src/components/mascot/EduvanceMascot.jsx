import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { useAppData } from '../../hooks/useAppData'
import { useTheme } from '../../context/ThemeContext'
import { getStreak } from '../../utils/streaks'
import { getContextMessage } from './mascotMessages'
import { daysUntil } from '../../utils/format'

/* ═══════════════════════════════════════════════════
   EDUVANCE MASCOT — Octo the purple octopus
   Click → shows deadlines, syllabus, quiz results
   ═══════════════════════════════════════════════════ */

const COOLDOWN_MS = 12000
const MESSAGE_VISIBLE_MS = 8000
const OCTO_IMG = '/mascot/octo-main.webp'

/* CSS keyframes injected once */
const STYLES = `
@keyframes octo-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}
@keyframes octo-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes octo-blink-line {
  0%, 92%, 100% { opacity: 0; }
  94% { opacity: 1; }
}
@keyframes octo-dot-pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.7; }
}
@keyframes octo-panel-in {
  0% { opacity: 0; transform: scale(0.9) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const s = document.createElement('style')
  s.textContent = STYLES
  document.head.appendChild(s)
  stylesInjected = true
}

function PriorityBadge({ level }) {
  const colors = {
    high: { bg: 'rgba(239,68,68,0.12)', text: '#dc2626', label: 'HIGH' },
    medium: { bg: 'rgba(234,179,8,0.12)', text: '#ca8a04', label: 'MED' },
    low: { bg: 'rgba(34,197,94,0.12)', text: '#16a34a', label: 'LOW' },
  }
  const c = colors[level] || colors.medium
  return (
    <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase" style={{ background: c.bg, color: c.text }}>
      {c.label}
    </span>
  )
}

export function EduvanceMascot() {
  const location = useLocation()
  const data = useAppData()
  const { isDark } = useTheme()

  const [isOpen, setIsOpen] = useState(false)
  const [view, setView] = useState('bubble') // 'bubble' | 'panel'
  const [message, setMessage] = useState('')
  const [lastAutoShow, setLastAutoShow] = useState(0)
  const [hasEntered, setHasEntered] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  injectStyles()

  const quizScore = useMemo(() => {
    try {
      const raw = sessionStorage.getItem('eduvance.quiz.result')
      return raw ? JSON.parse(raw).score : null
    } catch { return null }
  }, [location.pathname])

  const streakCount = useMemo(() => getStreak().current, [location.pathname])

  const contextMsg = useMemo(() => {
    return getContextMessage(location.pathname, data, { quizScore, streakCount })
  }, [location.pathname, data, quizScore, streakCount])

  // Auto-show contextual bubble on PAGE CHANGE only (not on every contextMsg change)
  const prevPathRef = useRef(location.pathname)
  useEffect(() => {
    // Only auto-show when navigating to a new page
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname
      setMessage(contextMsg.message)
      setView('bubble')
      const now = Date.now()
      if (now - lastAutoShow > COOLDOWN_MS) {
        setIsOpen(true)
        setLastAutoShow(now)
        const timer = setTimeout(() => {
          // Only close if still in bubble view (don't close panel if user clicked)
          setView(v => { if (v === 'bubble') setIsOpen(false); return v })
        }, MESSAGE_VISIBLE_MS)
        return () => clearTimeout(timer)
      }
    } else {
      // Same page — just update message silently, don't open/close
      setMessage(contextMsg.message)
    }
  }, [location.pathname, contextMsg])

  useEffect(() => {
    const timer = setTimeout(() => setHasEntered(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Build dashboard data for the panel
  const panelData = useMemo(() => {
    const exams = (data.exams || []).map(e => ({
      name: e.name,
      date: e.date,
      daysLeft: daysUntil(e.date || '2099-01-01'),
    })).filter(e => e.daysLeft > 0 && e.daysLeft <= 60).sort((a, b) => a.daysLeft - b.daysLeft)

    const subjects = (data.subjects || []).map(s => {
      const totalTopics = (s.units || []).reduce((n, u) => n + (u.topics || []).length, 0)
      const covered = Math.round((s.syllabusCoverage || 0) / 100 * totalTopics)
      return {
        name: s.name,
        total: totalTopics,
        covered,
        remaining: totalTopics - covered,
        progress: s.progress || 0,
      }
    }).filter(s => s.total > 0)

    const recentQuizzes = (data.quizResults || []).slice(-5).reverse().map(q => ({
      subject: q.subject,
      topic: q.topic,
      score: q.score,
      date: q.date || q.at,
    }))

    const weakTopics = (data.progress?.weakTopics || []).slice(0, 3)

    return { exams, subjects, recentQuizzes, weakTopics }
  }, [data])

  const handleClick = useCallback(() => {
    if (isOpen && view === 'panel') {
      setIsOpen(false)
      return
    }
    if (isOpen && view === 'bubble') {
      // Switch to panel view
      setView('panel')
      return
    }
    // Open with panel view showing dashboard info
    setView('panel')
    setIsOpen(true)
    setLastAutoShow(Date.now())
  }, [isOpen, view])

  if (location.pathname === '/setup' && !hasEntered) return null

  return (
    <motion.div
      className="fixed z-50 flex items-end gap-2 sm:gap-3"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
      }}
      initial={{ opacity: 0, y: 50, scale: 0.7 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 1.2 }}
    >
      {/* Info panel / Speech bubble */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, x: 16, y: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, x: 16, y: 10 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
            style={{
              background: isDark ? 'rgba(17,22,49,0.96)' : '#ffffff',
              border: `1px solid ${isDark ? 'rgba(148,163,184,0.1)' : 'rgba(0,0,0,0.08)'}`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              width: view === 'panel' ? 'min(320px, 80vw)' : 'auto',
              maxWidth: view === 'panel' ? '320px' : '260px',
              animation: 'octo-panel-in 0.3s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            {view === 'bubble' ? (
              /* Simple speech bubble */
              <div className="px-4 py-3 text-[13px] font-medium leading-relaxed" style={{ color: isDark ? '#e8eaf0' : '#1a1d2e' }}>
                {message}
              </div>
            ) : (
              /* Rich dashboard panel */
              <div className="max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {/* Panel header */}
                <div className="flex items-center gap-2 px-4 pt-3 pb-2" style={{ borderBottom: `1px solid ${isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.05)'}` }}>
                  <img src={OCTO_IMG} alt="" className="h-7 w-7" style={{ filter: 'drop-shadow(0 2px 6px rgba(109,76,216,0.3))' }} />
                  <div>
                    <p className="text-[11px] font-bold" style={{ color: isDark ? '#e8eaf0' : '#111827' }}>Octo's Dashboard</p>
                    <p className="text-[10px]" style={{ color: isDark ? '#64748b' : '#6b7280' }}>Your preparation at a glance</p>
                  </div>
                </div>

                <div className="p-3 space-y-3">
                  {/* 🔴 Deadlines */}
                  {panelData.exams.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                        📅 Upcoming Deadlines
                      </p>
                      <div className="space-y-1">
                        {panelData.exams.slice(0, 3).map(exam => (
                          <div key={exam.name} className="flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }}>
                            <span className="text-[11px] font-medium" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{exam.name}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px]" style={{ color: exam.daysLeft <= 7 ? '#dc2626' : exam.daysLeft <= 14 ? '#ca8a04' : isDark ? '#94a3b8' : '#6b7280' }}>
                                {exam.daysLeft}d left
                              </span>
                              {exam.daysLeft <= 7 && <span className="text-[10px]">🔴</span>}
                              {exam.daysLeft > 7 && exam.daysLeft <= 14 && <span className="text-[10px]">🟡</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 📚 Syllabus Coverage */}
                  {panelData.subjects.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                        📚 Syllabus Remaining
                      </p>
                      <div className="space-y-1.5">
                        {panelData.subjects.slice(0, 4).map(sub => (
                          <div key={sub.name} className="rounded-lg px-2.5 py-1.5" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }}>
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-medium" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{sub.name}</span>
                              <span className="text-[10px] font-medium" style={{ color: sub.remaining > 0 ? (isDark ? '#f97316' : '#ea580c') : '#16a34a' }}>
                                {sub.remaining > 0 ? `${sub.remaining} topics left` : '✓ Done'}
                              </span>
                            </div>
                            {/* Progress bar */}
                            <div className="mt-1 h-1 w-full overflow-hidden rounded-full" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ background: sub.progress >= 70 ? '#16a34a' : sub.progress >= 40 ? '#ca8a04' : '#dc2626' }}
                                initial={{ width: 0 }}
                                animate={{ width: `${sub.progress}%` }}
                                transition={{ duration: 0.8, ease: 'easeOut' }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 🎯 Recent Quiz Results */}
                  {panelData.recentQuizzes.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                        🎯 Recent Quiz Results
                      </p>
                      <div className="space-y-1">
                        {panelData.recentQuizzes.map((quiz, i) => (
                          <div key={i} className="flex items-center justify-between rounded-lg px-2.5 py-1.5" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f9fafb' }}>
                            <div className="min-w-0 flex-1">
                              <span className="block truncate text-[11px] font-medium" style={{ color: isDark ? '#e2e8f0' : '#111827' }}>{quiz.topic}</span>
                              <span className="text-[9px]" style={{ color: isDark ? '#64748b' : '#9ca3af' }}>{quiz.subject}</span>
                            </div>
                            <span className="ml-2 shrink-0 text-[12px] font-bold" style={{
                              color: quiz.score >= 80 ? '#16a34a' : quiz.score >= 60 ? '#ca8a04' : '#dc2626',
                            }}>
                              {quiz.score}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ⚠️ Weak Topics */}
                  {panelData.weakTopics.length > 0 && (
                    <div>
                      <p className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                        ⚠️ Needs Attention
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {panelData.weakTopics.map((t, i) => (
                          <span key={i} className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium" style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: '#dc2626',
                          }}>
                            {t.name || t.topic || 'Unknown'}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty state */}
                  {panelData.exams.length === 0 && panelData.subjects.length === 0 && panelData.recentQuizzes.length === 0 && (
                    <div className="py-4 text-center">
                      <p className="text-[12px]" style={{ color: isDark ? '#94a3b8' : '#6b7280' }}>
                        Start by adding your exam details! 📝
                      </p>
                    </div>
                  )}

                  {/* Streak */}
                  {streakCount > 0 && (
                    <div className="rounded-lg px-2.5 py-2 text-center" style={{ background: isDark ? 'rgba(249,115,22,0.08)' : 'rgba(249,115,22,0.06)' }}>
                      <span className="text-[11px] font-semibold" style={{ color: '#ea580c' }}>
                        🔥 {streakCount}-day study streak! Keep going!
                      </span>
                    </div>
                  )}
                </div>

                {/* Panel footer */}
                <div className="px-4 py-2 text-center" style={{ borderTop: `1px solid ${isDark ? 'rgba(148,163,184,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
                  <p className="text-[10px]" style={{ color: isDark ? '#475569' : '#9ca3af' }}>Click Octo again to close</p>
                </div>
              </div>
            )}

            {/* Pointer triangle */}
            {view === 'bubble' && (
              <div
                className="absolute -bottom-2 right-4 h-0 w-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: `8px solid ${isDark ? 'rgba(17,22,49,0.96)' : '#ffffff'}`,
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mascot button with idle animations */}
      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className="relative shrink-0 cursor-pointer select-none focus:outline-none"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        aria-label="Eduvance study companion — click for preparation overview"
        title="Click for your study dashboard!"
        style={{
          animation: 'octo-float 3.5s ease-in-out infinite',
        }}
      >
        {/* Hover glow ring */}
        <div
          className="absolute -inset-2 rounded-full transition-all duration-500"
          style={{
            background: isHovering
              ? 'radial-gradient(circle, rgba(109,76,216,0.25) 0%, transparent 70%)'
              : 'transparent',
            filter: isHovering ? 'blur(8px)' : 'blur(0px)',
          }}
        />

        {/* Octo image with breathing animation */}
        <div
          className="relative"
          style={{
            animation: 'octo-breathe 4s ease-in-out infinite',
          }}
        >
          <img
            src={OCTO_IMG}
            alt="Octo — your study companion"
            className="object-contain select-none"
            width="130"
            height="130"
            loading="lazy"
            style={{
              width: 'clamp(80px, 12vw, 130px)',
              height: 'clamp(80px, 12vw, 130px)',
              filter: 'drop-shadow(0 4px 16px rgba(109,76,216,0.35))',
              transition: 'filter 0.4s ease',
              ...(isHovering ? { filter: 'drop-shadow(0 6px 24px rgba(109,76,216,0.5))' } : {}),
            }}
            draggable={false}
          />

          {/* Blink overlay */}
          <div
            className="absolute rounded-full"
            style={{
              top: '22%',
              left: '25%',
              width: '50%',
              height: '12%',
              background: isDark ? 'rgba(109,76,216,0.6)' : 'rgba(109,76,216,0.5)',
              borderRadius: '50%',
              animation: 'octo-blink-line 4s ease-in-out infinite',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Notification dot */}
        {!isOpen && (
          <div
            className="absolute -right-1 -top-1 h-4 w-4 rounded-full border-2"
            style={{
              background: '#22c55e',
              borderColor: isDark ? '#111631' : '#ffffff',
              animation: 'octo-dot-pulse 2s ease-in-out infinite',
            }}
          />
        )}
      </motion.button>
    </motion.div>
  )
}

export default EduvanceMascot
