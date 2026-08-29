import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Zap, BookOpen, BarChart3, Brain, Shield, ArrowRight, Sparkles, Crown } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/PageHeader'
import { api } from '../services/api'
import { useAppState } from '../context/AppState'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    icon: <Sparkles size={20} />,
    price: '₹0',
    period: 'forever',
    description: 'Get started with AI-powered quizzes and basic study tools.',
    color: '#6b7280',
    gradient: 'from-gray-500/10 to-gray-600/5',
    borderGradient: 'from-gray-500/20 to-gray-600/10',
    features: [
      { text: 'Up to 15 questions per quiz', included: true, icon: <BookOpen size={14} /> },
      { text: '3 AI generations per day', included: true, icon: <Zap size={14} /> },
      { text: 'Access to cached question bank', included: true, icon: <Check size={14} /> },
      { text: 'Basic quiz analytics', included: true, icon: <BarChart3 size={14} /> },
      { text: 'Standard adaptive recommendations', included: true, icon: <Brain size={14} /> },
      { text: 'Syllabus analysis & topic extraction', included: true, icon: <Check size={14} /> },
      { text: 'Study schedule planning', included: true, icon: <Check size={14} /> },
      { text: 'Advanced analytics & insights', included: false },
      { text: 'Detailed AI explanations', included: false },
      { text: 'Enhanced study planning', included: false },
      { text: '20-50 question quizzes', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Zap size={20} />,
    price: '₹99',
    period: '/month',
    description: 'More power for serious students who want deeper practice.',
    color: '#3b82f6',
    gradient: 'from-blue-500/10 to-blue-600/5',
    borderGradient: 'from-blue-500/30 to-blue-400/10',
    popular: true,
    features: [
      { text: 'Up to 30 questions per quiz', included: true, icon: <BookOpen size={14} /> },
      { text: '10 AI generations per day', included: true, icon: <Zap size={14} /> },
      { text: 'Full question bank access', included: true, icon: <Check size={14} /> },
      { text: 'Advanced analytics & insights', included: true, icon: <BarChart3 size={14} /> },
      { text: 'Standard adaptive recommendations', included: true, icon: <Brain size={14} /> },
      { text: 'Syllabus analysis & topic extraction', included: true, icon: <Check size={14} /> },
      { text: 'Study schedule planning', included: true, icon: <Check size={14} /> },
      { text: 'Detailed AI explanations', included: false },
      { text: 'Enhanced study planning', included: false },
      { text: '40-50 question quizzes', included: false },
      { text: 'Priority support', included: false },
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <Crown size={20} />,
    price: '₹199',
    period: '/month',
    description: 'The complete AI-powered preparation experience.',
    color: '#a78bfa',
    gradient: 'from-purple-500/10 to-purple-600/5',
    borderGradient: 'from-purple-500/30 to-purple-400/10',
    features: [
      { text: 'Up to 50 questions per quiz', included: true, icon: <BookOpen size={14} /> },
      { text: '20 AI generations per day', included: true, icon: <Zap size={14} /> },
      { text: 'Full question bank access', included: true, icon: <Check size={14} /> },
      { text: 'Advanced analytics & insights', included: true, icon: <BarChart3 size={14} /> },
      { text: 'Detailed AI explanations for every answer', included: true, icon: <Brain size={14} /> },
      { text: 'Enhanced adaptive study planning', included: true, icon: <Check size={14} /> },
      { text: 'Priority support', included: true, icon: <Shield size={14} /> },
      { text: 'Everything in Free & Pro', included: true, icon: <Check size={14} /> },
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

  const currentPlanId = currentPlan?.plan || 'free'

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
              background: currentPlanId === 'premium' ? 'rgba(167,139,250,0.15)' : currentPlanId === 'pro' ? 'rgba(59,130,246,0.15)' : 'var(--color-surface)',
              color: currentPlanId === 'premium' ? '#a78bfa' : currentPlanId === 'pro' ? '#3b82f6' : 'var(--color-ink-3)',
            }}
          >
            {currentPlanId === 'premium' ? '👑 Premium' : currentPlanId === 'pro' ? '⚡ Pro' : '○ Free'}
          </span>
        </div>
      )}

      {/* Plan cards */}
      <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === currentPlanId
          const isUpgrade = plan.id !== 'free' && plan.id !== currentPlanId
          const isDowngrade = false // No downgrade button for now

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plan.popular ? 0.1 : plan.id === 'premium' ? 0.2 : 0 }}
              className={`relative rounded-2xl p-6 overflow-hidden ${plan.popular ? 'md:-mt-2 md:mb-[-8px] md:pb-8' : ''}`}
              style={{
                background: 'var(--color-card)',
                border: isCurrent
                  ? `2px solid ${plan.color}`
                  : '1px solid var(--color-line)',
                boxShadow: plan.popular
                  ? `0 0 40px ${plan.color}15, 0 8px 32px rgba(0,0,0,0.08)`
                  : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  className="absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                  style={{ background: plan.color }}
                >
                  Most Popular
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: plan.color }}>{plan.icon}</span>
                  <h3 className="text-lg font-bold" style={{ color: plan.color }}>
                    {plan.name}
                  </h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-3">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">{plan.description}</p>
              </div>

              {/* Key highlights */}
              <div className="mb-5 grid grid-cols-2 gap-2">
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: `${plan.color}10` }}>
                  <p className="text-lg font-bold text-ink">{plan.id === 'free' ? '15' : plan.id === 'pro' ? '30' : '50'}</p>
                  <p className="text-[10px] text-ink-3">max questions</p>
                </div>
                <div className="rounded-lg px-3 py-2 text-center" style={{ background: `${plan.color}10` }}>
                  <p className="text-lg font-bold text-ink">{plan.id === 'free' ? '3' : plan.id === 'pro' ? '10' : '20'}</p>
                  <p className="text-[10px] text-ink-3">AI / day</p>
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
                    ) : (
                      <X size={14} className="mt-0.5 shrink-0 text-ink-3/30" />
                    )}
                    <span className={feature.included ? 'text-ink' : 'text-ink-3/40'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              {isCurrent ? (
                <div
                  className="rounded-xl py-2.5 text-center text-sm font-medium"
                  style={{ background: `${plan.color}15`, color: plan.color }}
                >
                  ✓ Current plan
                </div>
              ) : plan.id === 'free' ? (
                <Button variant="secondary" className="w-full" as={Link} to="/dashboard">
                  Get started
                </Button>
              ) : (
                <Button
                  className="w-full text-white"
                  style={{ background: plan.color }}
                >
                  Upgrade to {plan.name}
                  <ArrowRight size={16} />
                </Button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Why upgrade section */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-center text-lg font-bold text-ink mb-2">Why upgrade?</h2>
        <p className="text-center text-sm text-ink-2 mb-8">Each tier unlocks more AI power and deeper insights</p>

        {/* Comparison table */}
        <div className="overflow-x-auto rounded-2xl" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-line)' }}>
                <th className="px-4 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">Feature</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-ink-3 uppercase tracking-wider">Free</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#3b82f6' }}>Pro</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider" style={{ color: '#a78bfa' }}>Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                { feature: 'Questions per quiz', free: '15', pro: '30', premium: '50' },
                { feature: 'AI generations / day', free: '3', pro: '10', premium: '20' },
                { feature: 'Cached question bank', free: '✓', pro: '✓', premium: '✓' },
                { feature: 'Basic quiz analytics', free: '✓', pro: '✓', premium: '✓' },
                { feature: 'Advanced analytics', free: '✗', pro: '✓', premium: '✓' },
                { feature: 'AI explanations', free: '✗', pro: '✗', premium: '✓' },
                { feature: 'Enhanced study planning', free: '✗', pro: '✗', premium: '✓' },
                { feature: 'Priority support', free: '✗', pro: '✗', premium: '✓' },
              ].map((row, i) => (
                <tr key={i} className="border-b last:border-b-0" style={{ borderColor: 'var(--color-line)' }}>
                  <td className="px-4 py-3 text-ink font-medium">{row.feature}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={row.free === '✓' ? 'text-emerald-400 font-semibold' : 'text-ink-3/40'}>
                      {row.free}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={row.pro === '✓' ? 'text-blue-400 font-semibold' : row.pro === '✗' ? 'text-ink-3/40' : 'text-blue-400 font-semibold'}>
                      {row.pro}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={row.premium === '✓' ? 'text-purple-400 font-semibold' : row.premium === '✗' ? 'text-ink-3/40' : 'text-purple-400 font-semibold'}>
                      {row.premium}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefit cards */}
      <div className="max-w-5xl mx-auto">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: <Zap size={20} />, title: 'More AI Power', desc: 'Generate questions for any topic, anytime. Pro gets 10/day, Premium gets 20/day.', color: '#3b82f6' },
            { icon: <BookOpen size={20} />, title: 'Longer Quizzes', desc: 'From 15 to 30 or 50 questions. Perfect for thorough revision before exams.', color: '#a78bfa' },
            { icon: <Brain size={20} />, title: 'Deep Insights', desc: 'Pro unlocks advanced analytics. Premium adds AI explanations for every answer.', color: '#22c55e' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-xl p-4"
              style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}
            >
              <div className="mb-2" style={{ color: item.color }}>{item.icon}</div>
              <h3 className="text-sm font-semibold text-ink">{item.title}</h3>
              <p className="mt-1 text-xs text-ink-2 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-center text-lg font-bold text-ink">Frequently asked questions</h2>
        {[
          { q: 'Can I cancel anytime?', a: 'Yes. Your access continues until the end of your billing period. No questions asked.' },
          { q: 'What payment methods are accepted?', a: 'We support UPI, credit/debit cards, and net banking. More options coming soon.' },
          { q: 'Is there a student discount?', a: "We're working on student pricing. Stay tuned!" },
          { q: 'What happens when my AI limit runs out?', a: 'You can still take quizzes using cached questions from the question bank. The limit only affects new AI generation.' },
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
