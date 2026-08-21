import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './config/db.js'
import { authRoutes } from './routes/authRoutes.js'
import { preparationRoutes } from './routes/preparationRoutes.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const app = express()
const port = Number(process.env.PORT) || 5000

const origins = String(process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

origins.push('http://localhost:5173', 'http://localhost:5174')

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true)
      const local = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      if (local || origins.includes(origin)) return callback(null, true)
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { ok: true } })
})

app.use('/api/auth', authRoutes)
app.use('/api/preparation', preparationRoutes)
app.use(notFound)
app.use(errorHandler)

try {
  await connectDb(process.env.MONGODB_URI)
} catch (err) {
  console.error('Database connection failed:', err.message)
  process.exit(1)
}

app.listen(port, () => {
  console.log(`Eduvance API listening on http://localhost:${port}`)
})
