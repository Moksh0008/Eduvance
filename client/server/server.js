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

app.listen(port, '0.0.0.0', () => {
  console.log(`Eduvance API listening on http://localhost:${port}`)
})
