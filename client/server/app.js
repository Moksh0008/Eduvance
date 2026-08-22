import express from 'express'
import cors from 'cors'
import { connectDb } from './config/db.js'
import { authRoutes } from './routes/authRoutes.js'
import { preparationRoutes } from './routes/preparationRoutes.js'
import { aiRoutes } from './routes/aiRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

export async function ensureDb() {
  await connectDb(process.env.MONGODB_URI)
}

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: true,
      credentials: true,
    }),
  )
  app.use(express.json({ limit: '2mb' }))

  app.get('/api/health', async (_req, res) => {
    const checks = { ok: true, timestamp: new Date().toISOString() }

    // Check MongoDB
    try {
      const mongoose = await import('mongoose')
      const state = mongoose.default.connection.readyState
      checks.mongodb = state === 1 ? 'connected' : state === 2 ? 'connecting' : 'disconnected'
      if (state !== 1) checks.ok = false
    } catch {
      checks.mongodb = 'unavailable'
    }

    // Check Grok API key
    checks.grok = process.env.XAI_API_KEY ? 'configured' : 'missing'

    // Server uptime
    checks.uptime = Math.round(process.uptime()) + 's'

    const status = checks.ok ? 200 : 503
    res.status(status).json({ success: checks.ok, data: checks })
  })

  app.use(async (req, _res, next) => {
    if (req.path === '/api/health') return next()
    try {
      await ensureDb()
      next()
    } catch (err) {
      err.statusCode = 503
      err.message = 'Database is not configured on the server.'
      next(err)
    }
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/preparation', preparationRoutes)
  app.use('/api/ai', aiRoutes)
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export const app = createApp()
