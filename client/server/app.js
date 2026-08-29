import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import { connectDb } from './config/db.js'
import { authRoutes } from './routes/authRoutes.js'
import { preparationRoutes } from './routes/preparationRoutes.js'
import { aiRoutes } from './routes/aiRoutes.js'
import { adminRoutes } from './routes/adminRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

  // Security headers
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
    next()
  })

  app.get('/api/health', async (_req, res) => {
    const checks = { ok: true, timestamp: new Date().toISOString() }

    // Check MongoDB — try to reconnect if disconnected
    try {
      const mongoose = await import('mongoose')
      let state = mongoose.default.connection.readyState
      
      // If disconnected, try to reconnect
      if (state !== 1 && process.env.MONGODB_URI) {
        try {
          await connectDb(process.env.MONGODB_URI)
          state = mongoose.default.connection.readyState
        } catch {
          // Reconnect failed, continue with current state
        }
      }
      
      checks.mongodb = state === 1 ? 'connected' : state === 2 ? 'connecting' : 'disconnected'
      if (state !== 1) checks.ok = false
    } catch {
      checks.mongodb = 'unavailable'
    }

    // Check AI provider status
    try {
      const { getProviderStatus } = await import('./services/grokService.js')
      const aiStatus = getProviderStatus()
      checks.ai = {
        primary: `${aiStatus.primary.name}/${aiStatus.primary.model} ${aiStatus.primary.configured ? '✅' : '❌'}`,
        fallback: aiStatus.fallback ? `${aiStatus.fallback.name}/${aiStatus.fallback.model} ${aiStatus.fallback.configured ? '✅' : '❌'}` : 'none',
      }
    } catch {
      checks.ai = { primary: 'unavailable', fallback: 'none' }
    }

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
  app.use('/api/admin', adminRoutes)

  // ── Serve frontend (Vite build) in production ──
  const distDir = join(__dirname, '..', '..', 'dist')
  const clientDistDir = join(__dirname, '..', 'dist')
  const resolvedDist = fs.existsSync(distDir) ? distDir : fs.existsSync(clientDistDir) ? clientDistDir : null
  if (resolvedDist) {
    console.log(`[Frontend] Serving static files from ${resolvedDist}`)
    app.use(express.static(resolvedDist, { maxAge: '1h', index: 'index.html' }))
    // SPA fallback: any non-API route serves index.html
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) return next()
      res.sendFile(join(resolvedDist, 'index.html'))
    })
  } else {
    console.log('[Frontend] No dist directory found — API-only mode')
  }

  app.use(notFound)
  app.use(errorHandler)

  return app
}

export const app = createApp()
// redeploy 1787502115
