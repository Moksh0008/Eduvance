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
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-[15.5rem] shrink-0 border-r border-line bg-surface lg:block">
          <div className="flex h-14 items-center border-b border-line px-4">
            <Logo to="/dashboard" />
          </div>
          <Sidebar />
        </aside>

        <AnimatePresence>
          {open ? (
            <div className="fixed inset-0 z-40 lg:hidden">
              <motion.button
                type="button"
                aria-label="Close navigation"
                className="absolute inset-0 bg-ink/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              />
              <motion.aside
                className="relative h-full w-64 bg-surface shadow-xl"
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.22 }}
              >
                <div className="flex h-14 items-center border-b border-line px-4">
                  <Logo to="/dashboard" />
                </div>
                <Sidebar onNavigate={() => setOpen(false)} />
              </motion.aside>
            </div>
          ) : null}
        </AnimatePresence>

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onMenu={() => setOpen(true)} />
          <main id="main" className="flex-1 px-4 py-8 sm:px-6 lg:px-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
