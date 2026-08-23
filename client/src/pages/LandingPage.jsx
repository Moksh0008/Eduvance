import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppState } from '../context/AppState'
import { MarketingNav } from '../components/layout/MarketingNav'
import { ProductDemo } from '../components/domain/ProductDemo'
import { AdaptiveLoop } from '../components/domain/AdaptiveLoop'

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const features = [
  { icon: '🧠', label: 'AI-powered adaptation', desc: 'Quiz results reshape your plan automatically.' },
  { icon: '📅', label: 'Smart scheduling', desc: 'Exam dates, study hours, deadlines — all factored in.' },
  { icon: '🎯', label: 'Weak-topic focus', desc: 'Spend time where it matters most.' },
  { icon: '🔄', label: 'Continuous replanning', desc: 'Plans change when your data changes.' },
]

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

      {/* Roadmap / How It Works */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-2 mb-2">Your journey with Eduvance</p>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              From syllabus to <span className="text-accent">success</span>
            </h2>
          </div>

          {/* Roadmap steps */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-accent/30 via-accent/50 to-accent/30" />

            {[
              { step: '01', icon: '📄', title: 'Upload your syllabus', desc: 'Drop your PDF — AI extracts subjects, units, and topics automatically.', color: '#6366f1' },
              { step: '02', icon: '🧠', title: 'AI analyzes everything', desc: 'Grok reads your syllabus and notes, understands the structure, identifies weak areas.', color: '#8b5cf6' },
              { step: '03', icon: '📅', title: 'Get your smart plan', desc: 'A personalized study schedule based on exam dates, difficulty, and your pace.', color: '#06b6d4' },
              { step: '04', icon: '🎯', title: 'Quiz from your notes', desc: 'AI generates questions from YOUR material — not random stuff from the internet.', color: '#ec4899' },
              { step: '05', icon: '📊', title: 'Track your progress', desc: 'Real analytics on accuracy, mastery, weak topics, and improvement trends.', color: '#10b981' },
              { step: '06', icon: '🔄', title: 'Plan adapts automatically', desc: 'Missed a session? Got a question wrong? The plan replans itself.', color: '#f97316' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative flex items-start gap-6 mb-10 pl-14"
              >
                {/* Step number circle */}
                <div
                  className="absolute left-0 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold border-2 z-10"
                  style={{
                    background: `${item.color}15`,
                    borderColor: `${item.color}40`,
                    color: item.color,
                  }}
                >
                  {item.icon}
                </div>

                {/* Content card */}
                <div className="flex-1 rounded-xl p-5 border border-line-2 bg-surface/60 backdrop-blur-sm hover:border-accent/30 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: item.color }}>
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                  <p className="mt-1 text-sm text-ink-2 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
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

      {/* Features */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="grid sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl p-5 border border-line-2 bg-surface/80 backdrop-blur-md"
              >
                <span className="text-2xl">{f.icon}</span>
                <h3 className="mt-2 font-medium text-ink">{f.label}</h3>
                <p className="mt-1 text-sm text-ink-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
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
