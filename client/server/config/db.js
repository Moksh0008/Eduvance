import mongoose from 'mongoose'

let connecting

export async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in Vercel env vars or server/.env')
  }

  if (mongoose.connection.readyState === 1) return
  if (connecting) {
    await connecting
    return
  }

  mongoose.set('strictQuery', true)
  connecting = mongoose
    .connect(uri)
    .then((conn) => {
      console.log('MongoDB connected')
      return conn
    })
    .finally(() => {
      connecting = null
    })
  await connecting
}
