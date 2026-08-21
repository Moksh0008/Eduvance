import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../brand/Logo'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function AppShell() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas">
      {/* Ambient background glow */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-accent/[0.03] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-low/[0.02] blur-[120px]" />
      </div>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2 focus:rounded-lg"
      >
        Skip to content
      </a>

      <div className="relative z-10 flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[15.5rem] shrink-0 border-r border-line bg-surface/50 backdrop-blur-sm lg:block">
          <div className="flex h-14 items-center border-b border-line px-4">
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
              />
              <motion.aside
                className="relative h-full w-64 border-r border-line bg-surface"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              >
                <div className="flex h-14 items-center border-b border-line px-4">
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
