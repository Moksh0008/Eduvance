import mongoose from 'mongoose'

export async function connectDb(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is missing. Set it in server/.env')
  }

  mongoose.set('strictQuery', true)
  await mongoose.connect(uri)
  console.log('MongoDB connected')
}
