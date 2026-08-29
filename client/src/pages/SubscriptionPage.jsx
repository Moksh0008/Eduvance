import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Zap, BookOpen, BarChart3, Brain, Shield, ArrowRight, Sparkles, Crown, CreditCard, Smartphone, Lock, ChevronLeft } from 'lucide-react'
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
    amount: 0,
    description: 'Get started with AI-powered quizzes and basic study tools.',
    color: '#6b7280',
    features: [
      { text: 'Up to 15 questions per quiz', included: true },
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
    id: 'pro',
    name: 'Pro',
    icon: <Zap size={20} />,
    price: '₹99',
    period: '/month',
    amount: 99,
    description: 'More power for serious students who want deeper practice.',
    color: '#3b82f6',
    popular: true,
    features: [
      { text: 'Up to 30 questions per quiz', included: true },
      { text: '10 AI generations per day', included: true },
      { text: 'Full question bank access', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Standard adaptive recommendations', included: true },
      { text: 'Syllabus analysis & topic extraction', included: true },
      { text: 'Study schedule planning', included: true },
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
    amount: 199,
    description: 'The complete AI-powered preparation experience.',
    color: '#a78bfa',
    features: [
      { text: 'Up to 50 questions per quiz', included: true },
      { text: '20 AI generations per day', included: true },
      { text: 'Full question bank access', included: true },
      { text: 'Advanced analytics & insights', included: true },
      { text: 'Detailed AI explanations for every answer', included: true },
      { text: 'Enhanced adaptive study planning', included: true },
      { text: 'Priority support', included: true },
      { text: 'Everything in Free & Pro', included: true },
    ],
  },
]

function PaymentModal({ plan, onClose, onSuccess }) {
  const [method, setMethod] = useState('card')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardName, setCardName] = useState('')
  const [upiId, setUpiId] = useState('')

  function formatCardNumber(val) {
    const v = val.replace(/\D/g, '').slice(0, 16)
    return v.replace(/(\d{4})(?=\d)/g, '$1 ')
  }
  function formatExpiry(val) {
    const v = val.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 3) return v.slice(0, 2) + '/' + v.slice(2)
    return v
  }

  function handleSubmit(e) {
    e.preventDefault()
    setProcessing(true)
    setTimeout(() => {
      setProcessing(false)
      setSuccess(true)
      if (onSuccess) onSuccess(plan.id)
      window.dispatchEvent(new Event('subscription-changed'))
    }, 1500)
  }

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xs rounded-2xl p-6 text-center" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
          <div className="mb-3 flex justify-center">
            <div className="h-14 w-14 rounded-full flex items-center justify-center" style={{ background: `${plan.color}20` }}>
              <Check size={28} style={{ color: plan.color }} />
            </div>
          </div>
          <h3 className="text-lg font-bold text-ink">Payment Successful!</h3>
          <p className="mt-1.5 text-sm text-ink-2">Welcome to <span style={{ color: plan.color }}>{plan.name}</span>! Your plan is now active.</p>
          <div className="mt-4 rounded-lg p-3 text-sm" style={{ background: `${plan.color}08` }}>
            <div className="flex justify-between"><span className="text-ink-3">Plan</span><span className="font-semibold" style={{ color: plan.color }}>{plan.name}</span></div>
            <div className="mt-1 flex justify-between"><span className="text-ink-3">Amount</span><span className="text-ink">{plan.price}{plan.period}</span></div>
          </div>
          <Button className="mt-4 w-full" size="sm" onClick={onClose}>Continue</Button>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="w-full max-w-sm rounded-2xl overflow-hidden" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid var(--color-line)' }}>
          <div className="flex items-center justify-between">
            <button onClick={onClose} className="flex items-center gap-1 text-xs text-ink-3 hover:text-ink transition-colors">
              <ChevronLeft size={14} /> Back
            </button>
            <div className="flex items-center gap-1 text-[9px] text-emerald-400">
              <Lock size={8} /> Secure
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg" style={{ color: plan.color }}>{plan.icon}</span>
              <div>
                <p className="text-sm font-bold" style={{ color: plan.color }}>{plan.name} Plan</p>
                <p className="text-[10px] text-ink-3">{plan.price} {plan.period}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex border-b" style={{ borderColor: 'var(--color-line)' }}>
          <button onClick={() => setMethod('card')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${method === 'card' ? 'text-ink border-b-2' : 'text-ink-3'}`} style={method === 'card' ? { borderColor: plan.color } : {}}>
            <CreditCard size={14} /> Card
          </button>
          <button onClick={() => setMethod('upi')} className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${method === 'upi' ? 'text-ink border-b-2' : 'text-ink-3'}`} style={method === 'upi' ? { borderColor: plan.color } : {}}>
            <Smartphone size={14} /> UPI
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {method === 'card' ? (
            <>
              <div>
                <label className="block text-[10px] font-medium text-ink-3 mb-0.5">Name on card</label>
                <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value)} placeholder="Mokshith R" required className="input w-full !py-2 !text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-ink-3 mb-0.5">Card number</label>
                <input type="text" value={cardNumber} onChange={(e) => setCardNumber(formatCardNumber(e.target.value))} placeholder="4242 4242 4242 4242" required maxLength={19} className="input w-full !py-2 !text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-medium text-ink-3 mb-0.5">Expiry</label>
                  <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(formatExpiry(e.target.value))} placeholder="MM/YY" required maxLength={5} className="input w-full !py-2 !text-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-medium text-ink-3 mb-0.5">CVV</label>
                  <input type="password" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="•••" required maxLength={4} className="input w-full !py-2 !text-sm" />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] font-medium text-ink-3 mb-0.5">UPI ID</label>
                <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi" required className="input w-full !py-2 !text-sm" />
                <p className="mt-0.5 text-[9px] text-ink-3">You will receive a payment request on your UPI app</p>
              </div>
            </>
          )}

          {/* Order summary */}
          <div className="rounded-lg p-2.5" style={{ background: 'var(--color-surface)' }}>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-2">Total</span>
              <span className="font-bold" style={{ color: plan.color }}>{plan.price}</span>
            </div>
          </div>

          <Button type="submit" className="w-full text-white !py-2.5 !text-sm" style={{ background: plan.color }} disabled={processing}>
            {processing ? (
              <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</span>
            ) : (<><Lock size={12} /> Pay {plan.price}</>) }
          </Button>

          <p className="text-center text-[9px] text-ink-3">Auto-renews monthly. Cancel anytime from your profile.</p>
        </form>
      </motion.div>
    </motion.div>
  )
}

export function SubscriptionPage() {
  const { session } = useAppState()
  const [currentPlan, setCurrentPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentPlan, setPaymentPlan] = useState(null)

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

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: plan.popular ? 0.1 : plan.id === 'premium' ? 0.2 : 0 }}
              className={`relative rounded-2xl p-6 overflow-hidden ${plan.popular ? 'md:-mt-2 md:mb-[-8px] md:pb-8' : ''}`}
              style={{
                background: 'var(--color-card)',
                border: isCurrent ? `2px solid ${plan.color}` : '1px solid var(--color-line)',
                boxShadow: plan.popular ? `0 0 40px ${plan.color}15, 0 8px 32px rgba(0,0,0,0.08)` : '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 rounded-bl-xl px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white" style={{ background: plan.color }}>
                  Most Popular
                </div>
              )}

              <div className="mb-5">
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: plan.color }}>{plan.icon}</span>
                  <h3 className="text-lg font-bold" style={{ color: plan.color }}>{plan.name}</h3>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-3">{plan.period}</span>
                </div>
                <p className="mt-2 text-sm text-ink-2 leading-relaxed">{plan.description}</p>
              </div>

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

              <ul className="space-y-2.5 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    {feature.included ? (
                      <Check size={14} className="mt-0.5 shrink-0" style={{ color: plan.color }} />
                    ) : (
                      <X size={14} className="mt-0.5 shrink-0 text-ink-3/30" />
                    )}
                    <span className={feature.included ? 'text-ink' : 'text-ink-3/40'}>{feature.text}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="rounded-xl py-2.5 text-center text-sm font-medium" style={{ background: `${plan.color}15`, color: plan.color }}>
                  ✓ Current plan
                </div>
              ) : plan.id === 'free' ? (
                <Button variant="secondary" className="w-full" as={Link} to="/dashboard">Get started</Button>
              ) : (
                <Button
                  className="w-full text-white"
                  style={{ background: plan.color }}
                  onClick={() => setPaymentPlan(plan)}
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
                    <span className={row.free === '✓' ? 'text-emerald-400 font-semibold' : 'text-ink-3/40'}>{row.free}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={row.pro === '✓' ? 'text-blue-400 font-semibold' : row.pro === '✗' ? 'text-ink-3/40' : 'text-blue-400 font-semibold'}>{row.pro}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={row.premium === '✓' ? 'text-purple-400 font-semibold' : row.premium === '✗' ? 'text-ink-3/40' : 'text-purple-400 font-semibold'}>{row.premium}</span>
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
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="rounded-xl p-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
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
          { q: 'Can I cancel anytime?', a: 'Yes! You can cancel your subscription anytime from your profile page. Your Pro or Premium access will remain active until the end of your current billing period. No questions asked, no cancellation fees.' },
          { q: 'What payment methods are accepted?', a: 'We accept all major credit cards (Visa, Mastercard, RuPay), debit cards, and UPI (Google Pay, PhonePe, Paytm, BHIM). All payments are securely processed.' },
          { q: 'Will I be charged automatically?', a: 'Yes, your subscription renews automatically each month. You will be charged on the same date you subscribed. You can cancel anytime before the renewal date to avoid the next charge.' },
          { q: 'What happens when my AI limit runs out?', a: 'You can still take quizzes using cached questions from the question bank — this is completely free and unlimited. The daily AI limit only applies to generating new questions via AI.' },
          { q: 'Is my payment secure?', a: 'Absolutely. We use industry-standard encryption for all transactions. We never store your card details on our servers. Payments are processed through secure, PCI-compliant payment gateways.' },
          { q: 'Can I switch between plans?', a: 'Yes! You can upgrade from Free → Pro → Premium anytime. When upgrading mid-cycle, you only pay the difference for the remaining days. Downgrading takes effect at the next billing cycle.' },
        ].map((faq, i) => (
          <div key={i} className="rounded-xl p-4" style={{ background: 'var(--color-card)', border: '1px solid var(--color-line)' }}>
            <p className="text-sm font-medium text-ink">{faq.q}</p>
            <p className="mt-1 text-xs text-ink-2 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentPlan && (
          <PaymentModal plan={paymentPlan} onClose={() => setPaymentPlan(null)} onSuccess={(planId) => setCurrentPlan({ plan: planId, isActive: true, status: 'active' })} />
        )}
      </AnimatePresence>
    </div>
  )
}
