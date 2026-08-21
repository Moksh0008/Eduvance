import express from 'express'
import cors from 'cors'
import { connectDb } from './config/db.js'
import { authRoutes } from './routes/authRoutes.js'
import { preparationRoutes } from './routes/preparationRoutes.js'
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

  app.use(async (_req, _res, next) => {
    try {
      await ensureDb()
      next()
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { ok: true } })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/preparation', preparationRoutes)
  app.use(notFound)
  app.use(errorHandler)

  return app
}

export const app = createApp()
