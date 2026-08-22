import mongoose from 'mongoose'

let connecting = null
let keepAliveInterval = null

export async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in Render env vars or server/.env')
  }

  // Already connected
  if (mongoose.connection.readyState === 1) return

  // Currently connecting — wait for it
  if (connecting) {
    await connecting
    return
  }

  mongoose.set('strictQuery', true)

  // Handle connection events
  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected — will reconnect on next request')
    connecting = null
  })

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message)
    connecting = null
  })

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected')
    connecting = null
  })

  connecting = mongoose
    .connect(uri, {
      // Keep connection alive
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4, // Use IPv4
    })
    .then((conn) => {
      console.log('MongoDB connected successfully')

      // Start keepalive ping every 4 minutes (Render free tier kills idle conns)
      if (keepAliveInterval) clearInterval(keepAliveInterval)
      keepAliveInterval = setInterval(async () => {
        try {
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping()
          }
        } catch {
          console.log('Keepalive ping failed — will reconnect')
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
