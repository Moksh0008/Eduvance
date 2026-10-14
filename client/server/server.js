import 'dotenv/config'
import { app, ensureDb } from './app.js'
import { logProviderConfig } from './services/grokService.js'

const port = Number(process.env.PORT) || 5000

// Validate AI provider configuration on startup
logProviderConfig()

try {
  await ensureDb()
} catch (err) {
  console.error('Database connection failed:', err.message)
  process.exit(1)
}

// Auto-upgrade designated users to premium on startup
try {
  const { User } = await import('./models/User.js')
  const { Subscription } = await import('./models/Subscription.js')
  const premiumEmails = (process.env.PREMIUM_USER_EMAILS || 'user1@gmail.com').split(',').map(e => e.trim().toLowerCase())
  for (const email of premiumEmails) {
    const user = await User.findOne({ email })
    if (user) {
      const sub = await Subscription.findOne({ userId: user._id })
      if (sub && sub.plan !== 'premium') {
        sub.plan = 'premium'
        sub.status = 'active'
        sub.startDate = new Date()
        sub.endDate = null // lifetime
        await sub.save()
        console.log(`[Startup] Upgraded ${email} to premium`)
      } else if (!sub) {
        await Subscription.create({ userId: user._id, plan: 'premium', status: 'active', startDate: new Date() })
        console.log(`[Startup] Created premium subscription for ${email}`)
      } else {
        console.log(`[Startup] ${email} is already premium`)
      }
    }
  }
} catch (err) {
  console.error('[Startup] Premium upgrade script error:', err.message)
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Eduvance API listening on http://localhost:${port}`)
})
