import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppState } from '../context/AppState'
import { MarketingNav } from '../components/layout/MarketingNav'
import { ProductDemo } from '../components/domain/ProductDemo'
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export function LandingPage() {
  const { isAuthenticated } = useAppState()
  const { isDark } = useAppState()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-canvas)' }}>
      <MarketingNav />

      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <img
          src={isDark ? '/dark-theme-bg.webp' : '/light-theme-bg.webp'}
          alt=""
          className="h-full w-full object-cover object-center"
          style={{
            opacity: isDark ? 0.5 : 0.85,
            filter: isDark ? 'none' : 'saturate(0.9) brightness(1)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? 'linear-gradient(180deg, rgba(6,9,24,0.6) 0%, rgba(6,9,24,0.85) 100%)'
              : 'linear-gradient(180deg, rgba(245,245,250,0.3) 0%, rgba(245,245,250,0.5) 100%)',
          }}
        />
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

      {/* Roadmap / How It Works — Alternating Timeline */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-2 mb-2">Your journey with Eduvance</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              From syllabus to <span className="text-accent">success</span>
            </h2>
          </div>

          {/* Alternating timeline */}
          <div className="relative">
            {/* Dotted center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ borderLeft: '2px dashed rgba(99,102,241,0.2)' }} />

            {[
              { step: '01', icon: '📄', title: 'Upload syllabus', desc: 'AI extracts subjects and topics from your PDF.', color: '#6366f1' },
              { step: '02', icon: '🧠', title: 'AI analyzes', desc: 'Understands structure and identifies weak areas.', color: '#8b5cf6' },
              { step: '03', icon: '📅', title: 'Smart plan', desc: 'Personalized schedule based on your pace.', color: '#06b6d4' },
              { step: '04', icon: '🎯', title: 'Quiz from notes', desc: 'Questions generated from YOUR material.', color: '#ec4899' },
              { step: '05', icon: '📊', title: 'Track progress', desc: 'Real analytics on mastery and trends.', color: '#10b981' },
              { step: '06', icon: '🔄', title: 'Auto-replan', desc: 'Plan adapts when your performance changes.', color: '#f97316' },
            ].map((item, i) => {
              const isLeft = i % 2 === 0
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className={`relative flex items-center mb-6 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  {/* Content card */}
                  <div className="w-[calc(50%-1.5rem)] rounded-lg px-4 py-3 border border-line-2 bg-surface/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: item.color }}>Step {item.step}</span>
                      <span className="text-sm">{item.icon}</span>
                    </div>
                    <h3 className="mt-0.5 text-sm font-semibold text-ink">{item.title}</h3>
                    <p className="mt-0.5 text-xs text-ink-2">{item.desc}</p>
                  </div>

                  {/* Center dot */}
                  <div className="relative z-10 mx-3 flex-shrink-0">
                    <motion.div
                      className="w-8 h-8 rounded-full flex items-center justify-center border-2"
                      style={{ background: `${item.color}15`, borderColor: `${item.color}50` }}
                      whileInView={{ scale: [0.5, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 + 0.15 }}
                    >
                      <span className="text-xs">{item.icon}</span>
                    </motion.div>
                  </div>

                  {/* Empty space */}
                  <div className="w-[calc(50%-1.5rem)]" />
                </motion.div>
              )
            })}
          </div>
        </div>
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

      {/* Footer */}
      <footer className="border-t border-line-2 py-8 px-4 text-center text-[11px] text-ink-3" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
        <p>© 2026 Eduvance. All rights reserved. Built with 🧠 for students who refuse to guess.</p>
      </footer>
    </div>
  )
}
