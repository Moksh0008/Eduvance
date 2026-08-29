import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useTheme } from '../../context/ThemeContext'

/* ═══════════════════════════════════════════════════
   ADAPTIVE LOOP — Circular animated visualization
   Shows: Analyze → Prioritize → Plan → Study →
          Quiz → Evaluate → Replan → (back to Analyze)
   ═══════════════════════════════════════════════════ */

const STEPS = [
  { label: 'Analyze',   emoji: '🔍', color: '#6366f1', desc: 'Understand your syllabus' },
  { label: 'Prioritize', emoji: '⚡', color: '#f97316', desc: 'Rank by exam proximity' },
  { label: 'Plan',      emoji: '🗓',  color: '#06b6d4', desc: 'Build your study schedule' },
  { label: 'Study',     emoji: '📖', color: '#8b5cf6', desc: 'Focus on what matters' },
  { label: 'Quiz',      emoji: '🎯', color: '#ec4899', desc: 'Test your knowledge' },
  { label: 'Evaluate',  emoji: '📊', color: '#10b981', desc: 'Analyze your results' },
  { label: 'Replan',    emoji: '🔄', color: '#eab308', desc: 'Adapt the strategy' },
]

const RADIUS_DESKTOP = 140
const RADIUS_MOBILE = 90

// Map routes to step indices
const ROUTE_STEP_MAP = {
  '/setup': 0,      // Analyze
  '/syllabus': 0,   // Analyze
  '/subjects': 0,   // Analyze
  '/dashboard': 3,  // Study
  '/planner': 2,    // Plan
  '/revision': 3,   // Study
  '/quiz': 4,       // Quiz
  '/quiz/play': 4,  // Quiz
  '/quiz/result': 5,// Evaluate
  '/progress': 6,   // Replan
  '/analytics': 5,  // Evaluate
  '/insights': 6,   // Replan
  '/question-papers': 4, // Quiz
}

function useActiveStep() {
  const location = useLocation()
  const [step, setStep] = useState(0)

  useEffect(() => {
    const path = location.pathname
    // Check exact match first, then partial match
    if (ROUTE_STEP_MAP[path] != null) {
      setStep(ROUTE_STEP_MAP[path])
    } else {
      // Partial match: /quiz/play → 4, /setup/* → 0, etc.
      for (const [route, idx] of Object.entries(ROUTE_STEP_MAP)) {
        if (path.startsWith(route + '/')) {
          setStep(idx)
          return
        }
      }
      // Default: cycle for unmatched pages
      setStep(3) // Study as default
    }
  }, [location.pathname])

  return step
}

function getStepPosition(index, total, radius) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

/* Generate a smooth arc path between two points on the circle */
function getArcPath(p1, p2, center) {
  // Quadratic bezier that follows the circle edge
  const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }
  // Pull control point slightly toward center for smooth curve
  const cx = mid.x + (center.x - mid.x) * 0.2
  const cy = mid.y + (center.y - mid.y) * 0.2
  return `M ${center.x + p1.x} ${center.y + p1.y} Q ${cx} ${cy} ${center.x + p2.x} ${center.y + p2.y}`
}

export function AdaptiveLoop({ compact = false }) {
  const { isDark } = useTheme()
  const reduce = useReducedMotion()
  const activeStep = useActiveStep()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const radius = isMobile ? RADIUS_MOBILE : RADIUS_DESKTOP
  const size = isMobile ? 220 : 340
  const center = { x: size / 2, y: size / 2 }

  /* ── Compact mode: simple horizontal flow ── */
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-y-2">
        {STEPS.map((step, i) => (
          <div key={step.label} className="flex items-center">
            <motion.div
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-500"
              style={{
                background: i === activeStep ? `${step.color}22` : 'transparent',
                color: i === activeStep ? step.color : 'var(--color-ink-3)',
                boxShadow: i === activeStep ? `0 0 20px ${step.color}15` : 'none',
                whiteSpace: 'nowrap',
              }}
              animate={i === activeStep && !reduce ? { scale: [1, 1.08, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              <span className="text-sm">{step.emoji}</span>
              <span>{step.label}</span>
            </motion.div>
            {i < STEPS.length - 1 && (
              <svg className="mx-1 shrink-0" width="16" height="12" viewBox="0 0 16 12" fill="none">
                <motion.path
                  d="M0 6h12M10 1l5 5-5 5"
                  stroke={i === activeStep ? step.color : 'var(--color-ink-3)'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  animate={i === activeStep && !reduce ? { pathLength: [0, 1] } : {}}
                  transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2.5 }}
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    )
  }

  /* ── Full circular mode ── */
  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
      {/* Circular visualization */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        {/* Center hub */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center rounded-full z-10"
          style={{
            width: isMobile ? 80 : 110,
            height: isMobile ? 80 : 110,
            background: isDark
              ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(6,9,24,0.8) 70%)'
              : 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(244,242,238,0.8) 70%)',
            border: `1.5px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
            backdropFilter: 'blur(12px)',
          }}
          animate={!reduce ? {
            boxShadow: [
              `0 0 20px ${STEPS[activeStep].color}15`,
              `0 0 40px ${STEPS[activeStep].color}25`,
              `0 0 20px ${STEPS[activeStep].color}15`,
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.span
            className="text-xl sm:text-2xl"
            key={activeStep}
            initial={{ scale: 0.5, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            {STEPS[activeStep].emoji}
          </motion.span>
          <motion.span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: STEPS[activeStep].color }}
            key={`label-${activeStep}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
          >
            {STEPS[activeStep].label}
          </motion.span>
        </motion.div>

        {/* Rotating orbit ring */}
        {!reduce && (
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: radius * 2 + 30,
              height: radius * 2 + 30,
              border: `1px dashed ${isDark ? 'rgba(99,102,241,0.12)' : 'rgba(99,102,241,0.08)'}`,
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {/* Connecting lines between nodes — clean arcs */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={size}
          height={size}
          aria-hidden="true"
        >
          <defs>
            {STEPS.map((step, i) => (
              <linearGradient key={`grad-${i}`} id={`lineGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={step.color} stopOpacity={i === activeStep ? 0.6 : 0.1} />
                <stop offset="100%" stopColor={STEPS[(i + 1) % STEPS.length].color} stopOpacity={i === activeStep ? 0.6 : 0.1} />
              </linearGradient>
            ))}
          </defs>
          {STEPS.map((step, i) => {
            const next = (i + 1) % STEPS.length
            const p1 = getStepPosition(i, STEPS.length, radius)
            const p2 = getStepPosition(next, STEPS.length, radius)
            const isActive = i === activeStep
            const d = getArcPath(p1, p2, center)
            return (
              <motion.path
                key={`line-${i}`}
                d={d}
                fill="none"
                stroke={isActive ? `url(#lineGrad-${i})` : isDark ? 'rgba(148,163,184,0.08)' : 'rgba(26,29,46,0.06)'}
                strokeWidth={isActive ? 2.5 : 1}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
              />
            )
          })}
        </svg>

        {/* Step nodes */}
        {STEPS.map((step, i) => {
          const pos = getStepPosition(i, STEPS.length, radius)
          const isActive = i === activeStep
          return (
            <motion.div
              key={step.label}
              className="absolute flex flex-col items-center z-10"
              style={{
                left: center.x + pos.x,
                top: center.y + pos.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
            >
              {/* Node circle */}
              <motion.div
                className="flex items-center justify-center rounded-full transition-all duration-500"
                style={{
                  width: isActive ? (isMobile ? 44 : 52) : (isMobile ? 36 : 42),
                  height: isActive ? (isMobile ? 44 : 52) : (isMobile ? 36 : 42),
                  background: isActive
                    ? `${step.color}20`
                    : isDark ? 'rgba(17,22,49,0.6)' : 'rgba(255,255,255,0.7)',
                  border: `2px solid ${isActive ? step.color : isDark ? 'rgba(148,163,184,0.1)' : 'rgba(26,29,46,0.08)'}`,
                  boxShadow: isActive ? `0 0 24px ${step.color}30` : 'none',
                  backdropFilter: 'blur(8px)',
                }}
                animate={isActive && !reduce ? {
                  scale: [1, 1.15, 1],
                  boxShadow: [
                    `0 0 16px ${step.color}20`,
                    `0 0 32px ${step.color}40`,
                    `0 0 16px ${step.color}20`,
                  ],
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className={isMobile ? 'text-base' : 'text-lg'}>{step.emoji}</span>
              </motion.div>

              {/* Label below node */}
              <span
                className="mt-1 text-center font-medium transition-all duration-300"
                style={{
                  fontSize: isMobile ? '9px' : '11px',
                  color: isActive ? step.color : 'var(--color-ink-3)',
                  fontWeight: isActive ? 600 : 400,
                  maxWidth: isMobile ? 50 : 65,
                  lineHeight: 1.2,
                }}
              >
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {/* Description panel */}
      <div className="flex-1 space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-3">
          The adaptive learning loop
        </p>
        <div className="space-y-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-3 rounded-xl px-3 py-2 transition-all duration-300"
              style={{
                background: i === activeStep ? `${step.color}10` : 'transparent',
              }}
              animate={i === activeStep && !reduce ? { x: [0, 4, 0] } : {}}
              transition={{ duration: 0.6 }}
            >
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm"
                style={{
                  background: i === activeStep ? `${step.color}20` : 'var(--color-accent-soft)',
                  color: i === activeStep ? step.color : 'var(--color-ink-3)',
                }}
              >
                {step.emoji}
              </span>
              <div>
                <p
                  className="text-sm font-medium transition-colors duration-300"
                  style={{ color: i === activeStep ? step.color : 'var(--color-ink)' }}
                >
                  {step.label}
                </p>
                <p className="text-xs text-ink-3">{step.desc}</p>
              </div>
              {i === activeStep && (
                <motion.div
                  className="ml-auto h-1.5 w-1.5 rounded-full"
                  style={{ background: step.color }}
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-xs text-ink-3 italic">
          Eduvance continuously cycles through these steps based on your performance.
        </p>
      </div>
    </div>
  )
}
