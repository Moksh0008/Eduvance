import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Zap, BookOpen, BarChart3, Brain, Headphones, ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { api } from '../services/api'
import { useAppState } from '../context/AppState'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Get started with AI-powered quizzes and basic study tools.',
    color: 'var(--color-ink-3)',
    features: [
      { text: '10 AI-generated questions per quiz', included: true },
      { text: '3 AI generations per day', included: true },
      { text: 'Access to cached question bank', included: true },
      { text: 'Basic quiz analytics', included: true },
      { text: 'Standard adaptive recommendations', included: true },
      { text: 'Syllabus analysis & topic extraction', included: true },
      { text: 'Study schedule planning', included: true },
      { text: 'Advanced analytics & insights', included: false },
      { text: 'Detailed AI explanations', included: false },
      { text: 'Enhanced study planning', included: false },
      { text: '20-50 question quizzes', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹199',
    period: '/month',
    description: 'Unlock the full power of AI-driven adaptive preparation.',
    color: '#a78bfa',
    popular: true,
    features: [
      { text: 'Up to 50 questions per quiz', included: true },
      { text: '20 AI generations per day', included: true },
      { text: 'Full question bank access', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Detailed AI explanations for every answer', included: true },
      { text: 'Enhanced adaptive study planning', included: true },
      { text: 'Priority support', included: true },
      { text: 'Everything in Free', included: true },
    ],
  },
]

export function SubscriptionPage() {
  const { session } = useAppState()
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.token) return
    async function load() {
      try {
        const result = await api.get('/ai/subscription')
        if (result) setCurrentPlan(result)
      } catch (err) {
        console.error('[Subscription] Failed to load:', err.message)
      }
      setLoading(false)
    }
    load()
  }, [session?.token])

  const isPremium = currentPlan?.plan === 'premium' && currentPlan?.isActive

  return (
    <div className="space-y-10">
      <PageHeader
        title="Choose your plan"
        subtitle="Unlock the full potential of AI-powered exam preparation"
      />

      {/* Current plan indicator */}
      {currentPlan && (
        <div className="flex items-center justify-center gap-2 text-sm text-ink-2">
          <span>Current plan:</span>
          <span
            className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold uppercase"
            style={{
              background: isPremium ? 'rgba(167,139,250,0.15)' : 'var(--color-surface)',
              color: isPremium ? '#a78bfa' : 'var(--color-ink-3)',
            }}
          >
            {isPremium ? '⭐ Premium' : '○ Free'}
          </span>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === (currentPlan?.plan || 'free')
          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plan.popular ? 0.1 : 0 }}
              className="relative rounded-2xl p-6 overflow-hidden"
              style={{
                background: 'var(--color-card)',
                border: isCurrent
                  ? `2px solid ${plan.color}`
                  : '1px solid var(--color-line)',
                boxShadow: plan.popular
                  ? `0 0 40px ${plan.color}20`
                  : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: plan.color }}
                >
                  Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-ink" style={{ color: plan.color === 'var(--color-ink-3)' ? undefined : plan.color }}>
                  {plan.name}
                </h3>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-3">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-ink-2">{plan.description}</p>
              </div>

              {/* Features list */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check size={16} className="mt-0.5 shrink-0" style={{ color: plan.color === 'var(--color-ink-3)' ? '#22c55e' : plan.color }} />
                    ) : (
                      <X size={16} className="mt-0.5 shrink-0 text-ink-3/40" />
                    )}
                    <span className={feature.included ? 'text-ink' : 'text-ink-3/60'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div
                  className="rounded-xl py-2.5 text-center text-sm font-medium"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-ink-3)' }}
                >
                  Current plan
                </div>
              ) : plan.id === 'premium' ? (
                <Button className="w-full" style={{ background: plan.color }}>
                  Upgrade to Premium
                  <ArrowRight size={16} />
                </Button>
              ) : (
                <Button variant="secondary" className="w-full" as={Link} to="/dashboard">
                  Get started
                </Button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Why Premium section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-center text-lg font-bold text-ink mb-6">Why upgrade to Premium?</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { icon: <Zap size={20} />, title: 'More AI Power', desc: '20 AI generations per day instead of 3. Generate questions for any topic, anytime.' },
            { icon: <BookOpen size={20} />, title: 'Longer Quizzes', desc: 'Up to 50 questions per quiz. Perfect for thorough revision before exams.' },
            { icon: <BarChart3 size={20} />, title: 'Advanced Analytics', desc: 'Deep insights into your performance patterns, weak areas, and progress trends.' },
            { icon: <Brain size={20} />, title: 'Smart Explanations', desc: 'Detailed AI explanations for every answer. Understand why each answer is correct.' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}
            >
              <div className="mb-2 text-accent-2">{item.icon}</div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-xs text-ink-2">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-center text-lg font-bold text-ink">Frequently asked questions</h2>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes. Your Premium access continues until the end of your billing period.' },
          { q: 'What payment methods are accepted?', a: 'We support UPI, credit/debit cards, and net banking. More options coming soon.' },
          { q: 'Is there a student discount?', a: 'We\'re working on student pricing. Stay tuned!' },
        ].map((faq, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
            <p className="text-sm font-medium text-ink">{faq.q}</p>
            <p className="mt-1 text-xs text-ink-2">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
