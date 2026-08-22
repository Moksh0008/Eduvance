import mongoose from 'mongoose'

let connecting = null
let keepAliveInterval = null
let lastConnectedAt = null

export async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in Render env vars or server/.env')
  }

  // Already connected and connection is healthy
  if (mongoose.connection.readyState === 1) {
    // Check if connection is actually alive (not just stale)
    try {
      if (lastConnectedAt && Date.now() - lastConnectedAt < 30000) {
        return // Connected recently, assume healthy
      }
      // Ping to verify connection is alive
      await mongoose.connection.db.admin().ping()
      lastConnectedAt = Date.now()
      return
    } catch {
      // Connection is stale/broken, reconnect
      console.log('MongoDB connection stale — reconnecting...')
      try { await mongoose.connection.close() } catch {}
    }
  }

  // Currently connecting — wait for it
  if (connecting) {
    try { await connecting } catch {}
    return
  }

  mongoose.set('strictQuery', true)

  // Remove old listeners to prevent duplicates
  mongoose.connection.removeAllListeners('disconnected')
  mongoose.connection.removeAllListeners('error')
  mongoose.connection.removeAllListeners('connected')

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected — will reconnect on next request')
    connecting = null
    lastConnectedAt = null
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
    connecting = null
  })

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
    lastConnectedAt = Date.now()
    connecting = null
  })

  connecting = mongoose
    .connect(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      // Retry initial connection
      retryWrites: true,
      retryReads: true,
    })
    .then((conn) => {
      console.log('MongoDB connected successfully')

      // Start keepalive ping every 4 minutes
      if (keepAliveInterval) clearInterval(keepAliveInterval)
      keepAliveInterval = setInterval(async () => {
        try {
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping()
            lastConnectedAt = Date.now()
          }
        } catch {
          console.log('Keepalive ping failed — will reconnect on next request')
          connecting = null
          lastConnectedAt = null
        }
      }, 4 * 60 * 1000)

      return conn
    })
    .catch((err) => {
      console.error('MongoDB connection failed:', err.message)
      connecting = null
      throw err
    })
    .finally(() => {
      connecting = null
    })

  await connecting
}
