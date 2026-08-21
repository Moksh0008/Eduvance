import jwt from 'jsonwebtoken'

export function signToken(userId) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is missing')
  return jwt.sign({ userId: String(userId) }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET)
}
