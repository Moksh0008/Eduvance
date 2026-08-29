import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../brand/Logo'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'
import { ParticleBackground } from '../ui/ParticleBackground'
import { FloatingSymbols } from '../ui/FloatingSymbols'
import { BackendStatus } from '../ui/BackendStatus'

import { useTheme } from '../../context/ThemeContext'

/* Page-specific ambient glow colors */
const PAGE_GLOWS = {
  '/dashboard': { a: 'rgba(99,102,241,0.035)', b: 'rgba(34,211,238,0.02)' },
  '/syllabus': { a: 'rgba(6,182,212,0.03)', b: 'rgba(99,102,241,0.02)' },
  '/subjects': { a: 'rgba(139,92,246,0.03)', b: 'rgba(99,102,241,0.015)' },
  '/planner': { a: 'rgba(6,182,212,0.03)', b: 'rgba(59,130,246,0.02)' },
  '/revision': { a: 'rgba(245,158,11,0.025)', b: 'rgba(99,102,241,0.02)' },
  '/quiz': { a: 'rgba(139,92,246,0.03)', b: 'rgba(59,130,246,0.02)' },
  '/progress': { a: 'rgba(34,197,94,0.025)', b: 'rgba(6,182,212,0.02)' },
  '/analytics': { a: 'rgba(99,102,241,0.03)', b: 'rgba(139,92,246,0.02)' },
  '/insights': { a: 'rgba(249,115,22,0.02)', b: 'rgba(139,92,246,0.025)' },
  '/profile': { a: 'rgba(139,92,246,0.025)', b: 'rgba(99,102,241,0.015)' },
  '/settings': { a: 'rgba(148,163,184,0.02)', b: 'rgba(99,102,241,0.01)' },
}
const DEFAULT_GLOW = { a: 'rgba(99,102,241,0.03)', b: 'rgba(34,211,238,0.015)' }

const PAGE_GLOWS_LIGHT = {
  '/dashboard': { a: 'rgba(85,88,230,0.04)', b: 'rgba(8,145,178,0.03)' },
  '/syllabus': { a: 'rgba(8,145,178,0.035)', b: 'rgba(85,88,230,0.025)' },
  '/subjects': { a: 'rgba(124,58,237,0.035)', b: 'rgba(85,88,230,0.02)' },
  '/planner': { a: 'rgba(8,145,178,0.035)', b: 'rgba(59,130,246,0.025)' },
  '/quiz': { a: 'rgba(124,58,237,0.035)', b: 'rgba(59,130,246,0.025)' },
  '/progress': { a: 'rgba(22,163,74,0.03)', b: 'rgba(8,145,178,0.025)' },
  '/analytics': { a: 'rgba(85,88,230,0.035)', b: 'rgba(124,58,237,0.025)' },
}
const DEFAULT_GLOW_LIGHT = { a: 'rgba(85,88,230,0.035)', b: 'rgba(8,145,178,0.02)' }

export function AppShell() {
  const [open, setOpen] = useState(false)
  const { isDark } = useTheme()
  const location = useLocation()

  const glows = isDark ? PAGE_GLOWS : PAGE_GLOWS_LIGHT
  const defaultGlow = isDark ? DEFAULT_GLOW : DEFAULT_GLOW_LIGHT
  const glow = glows[location.pathname] || defaultGlow

  return (
    <div className="min-h-screen bg-canvas">
      {/* Fixed background image — same as landing page */}
      <div className="fixed inset-0 z-0">
            <img
              src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="lazy"
              width="1920"
              height="1080"
              style={{ opacity: isDark ? 0.15 : 0.45, filter: isDark ? 'none' : 'saturate(0.6) brightness(1.05)' }}
            />
      </div>

      {/* Particle background */}
      <ParticleBackground />



      {/* Floating educational symbols */}
      <FloatingSymbols />

      {/* Page-specific ambient glow orbs */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
        <motion.div
          key={`glow-a-${location.pathname}`}
          className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-[150px]"
          style={{ background: glow.a }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        <motion.div
          key={`glow-b-${location.pathname}`}
          className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: glow.b }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        />
        {/* Third subtle orb for depth */}
        <div
          className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[180px]"
          style={{ background: isDark ? 'rgba(99,102,241,0.015)' : 'rgba(85,88,230,0.02)' }}
        />
      </div>

      {/* Backend health check banner */}
      <BackendStatus />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>



      <div className="relative z-10 flex min-h-screen">
        {/* Desktop sidebar — borderless, floating feel */}
        <aside className="sticky top-0 hidden h-screen w-[15.5rem] shrink-0 backdrop-blur-lg lg:block" style={{ background: isDark ? 'rgba(10,14,28,0.92)' : 'rgba(255,255,255,0.92)', borderRight: isDark ? '1px solid rgba(148,163,184,0.1)' : '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex h-14 items-center px-4">
            <Logo to="/dashboard" />
          </div>
          <Sidebar />
        </aside>

        {/* Mobile sidebar overlay */}
        <AnimatePresence>
          {open ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <motion.div
                className="absolute inset-0 bg-canvas/80 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />                <motion.aside
                className="relative h-full w-64 backdrop-blur-xl"
                style={{ background: isDark ? 'rgba(10,14,28,0.95)' : 'rgba(255,255,255,0.95)' }}
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              >
                <div className="flex h-14 items-center px-4">
                  <Logo to="/dashboard" />
                </div>
                <Sidebar onNavigate={() => setOpen(false)} />
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenu={() => setOpen(true)} />
          <main id="main" className="min-w-0 flex-1 overflow-x-hidden px-4 py-8 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>

    </div>
  )
}
