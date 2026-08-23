import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppState } from '../context/AppState'
import { MarketingNav } from '../components/layout/MarketingNav'
import { ProductDemo } from '../components/domain/ProductDemo'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export function LandingPage() {
  const { isAuthenticated, isDark } = useAppState()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <MarketingNav />

      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{ opacity: isDark ? 0.5 : 0.85, filter: isDark ? 'none' : 'saturate(0.9) brightness(1)' }}
        />
        <div className="absolute inset-0" style={{
          background: isDark
            ? 'linear-gradient(180deg, rgba(6,9,24,0.6) 0%, rgba(6,9,24,0.85) 100%)'
            : 'linear-gradient(180deg, rgba(245,245,250,0.3) 0%, rgba(245,245,250,0.5) 100%)',
        }} />
      </div>

      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 sm:pt-28 sm:pb-24 text-center">
        <motion.div
          className="mx-auto max-w-3xl"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p variants={fadeUp} className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-2 mb-4">
            Adaptive examination preparation
          </motion.p>
          <motion.h1 variants={fadeUp} className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink leading-[1.1]">
            Stop guessing{' '}
            <span className="text-accent">what to study.</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-4 text-base text-ink-2 max-w-xl mx-auto leading-relaxed">
            Eduvance decides what, when, and how long — then replans when your performance changes.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex justify-center gap-3">
            <Link to={isAuthenticated ? '/dashboard' : '/register?intent=prepare'}>
              <button className="px-6 py-3 rounded-xl font-medium text-sm text-white transition-all hover:shadow-lg hover:shadow-accent/25" style={{ background: 'var(--color-accent)' }}>
                Start Preparing
              </button>
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] text-ink-3">
            {['Priority engine', 'Auto-replan', 'Quiz analytics', 'Smart planner', 'Focus sessions'].map((f) => (
              <span key={f} className="rounded-full px-3 py-1.5 border border-line-2 bg-surface/70 backdrop-blur-sm">{f}</span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Product Demo */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-2 mb-2">See Eduvance in action</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">
            From confusion to <span className="text-accent">clarity</span>
          </h2>
          <p className="mt-2 text-sm text-ink-2 max-w-lg mx-auto">
            Every student's journey follows the same pattern. Eduvance accelerates every step.
          </p>
        </div>
        <ProductDemo />
      </section>

      {/* Adaptive Loop */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center mb-8">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-2 mb-2">The feedback loop</p>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink">
            How Eduvance <span className="text-accent">adapts</span>
          </h2>
          <p className="mt-2 text-sm text-ink-2 max-w-lg mx-auto">
            The plan adapts. Weaknesses detected. Strategy replanned. You keep improving.
          </p>
        </div>
        <AdaptiveLoop />
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-serif text-3xl text-ink">Ready to study smarter?</h2>
          <p className="mt-2 text-sm text-ink-2">Your AI-powered study companion is waiting.</p>
          <Link to={isAuthenticated ? '/dashboard' : '/register?intent=prepare'} className="mt-6 inline-block">
            <button className="px-8 py-3 rounded-xl font-medium text-sm text-white transition-all hover:shadow-lg hover:shadow-accent/25" style={{ background: 'var(--color-accent)' }}>
              Get started — it's free
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Professional Footer */}
      <footer className="border-t border-line-2" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--color-accent)' }}>
                  Ev
                </div>
                <span className="font-serif text-lg font-semibold text-ink">Eduvance</span>
              </div>
              <p className="text-xs text-ink-3 leading-relaxed max-w-xs">
                AI-powered adaptive examination preparation. Stop guessing, start preparing with intelligence.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ink-3 mb-3">Product</h4>
              <ul className="space-y-2 text-xs text-ink-2">
                <li><Link to="/how-it-works" className="hover:text-accent transition-colors">How it works</Link></li>
                <li><Link to="/problem" className="hover:text-accent transition-colors">Problem</Link></li>
                <li><Link to="/why-eduvance" className="hover:text-accent transition-colors">Why Eduvance</Link></li>
                <li><Link to="/the-loop" className="hover:text-accent transition-colors">The loop</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ink-3 mb-3">Company</h4>
              <ul className="space-y-2 text-xs text-ink-2">
                <li><span className="hover:text-accent transition-colors cursor-pointer">About</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Blog</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Careers</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Contact</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ink-3 mb-3">Legal</h4>
              <ul className="space-y-2 text-xs text-ink-2">
                <li><span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Terms of Service</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Cookie Policy</span></li>
                <li><span className="hover:text-accent transition-colors cursor-pointer">Refund Policy</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-line-2 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            <p className="text-[11px] text-ink-3">
              © 2026 Eduvance. All rights reserved. Built with 🧠 for students who refuse to guess.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-ink-3 hover:text-accent transition-colors cursor-pointer">🐙 Octo says: "Study smart, not hard!"</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
