import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { login, me, register, verifyOTP, resendOTP, refreshToken } from '../controllers/authController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'
import { User } from '../models/User.js'
import { Preparation } from '../models/Preparation.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { signToken } from '../utils/token.js'
import { emptyPreparation } from '../utils/emptyPreparation.js'

export const authRoutes = Router()

authRoutes.post('/register', register)
authRoutes.post('/login', login)
authRoutes.get('/me', authMiddleware, me)
authRoutes.post('/verify-otp', verifyOTP)
authRoutes.post('/resend-otp', resendOTP)
authRoutes.post('/refresh', authMiddleware, refreshToken)

// Google OAuth — redirects to Google login
authRoutes.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return res.status(503).json({ success: false, message: 'Google sign-in not configured' })
  }
  const redirectUri = `${req.protocol}://${req.get('host')}/api/auth/google/callback`
  const scope = 'email profile'
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&access_type=offline`
  res.redirect(url)
})

// Google OAuth callback
authRoutes.get('/google/callback', asyncHandler(async (req, res) => {
  const { code } = req.query
  if (!code) {
    return res.redirect('/login?error=no_code')
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    return res.redirect('/login?error=not_configured')
  }

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${req.protocol}://${req.get('host')}/api/auth/google/callback`,
      grant_type: 'authorization_code',
    }),
  })
  const tokens = await tokenRes.json()
  if (!tokens.access_token) {
    return res.redirect('/login?error=token_failed')
  }

  // Get user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const googleUser = await userRes.json()
  if (!googleUser.email) {
    return res.redirect('/login?error=no_email')
  }

  // Find or create user
  let user = await User.findOne({ email: googleUser.email.toLowerCase() })
  if (!user) {
    const passwordHash = await bcrypt.hash(Math.random().toString(36).slice(2) + Date.now(), 10)
    user = await User.create({
      name: googleUser.name || googleUser.email.split('@')[0],
      email: googleUser.email.toLowerCase(),
      passwordHash,
    })
    await Preparation.create({
      userId: user._id,
      ...emptyPreparation(),
      student: { name: user.name, email: user.email },
    })
  }

  const token = signToken(user._id)
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173'
  res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({ id: String(user._id), name: user.name, email: user.email }))}`)
}))

// Forgot password — send reset email (placeholder)
authRoutes.post('/forgot-password', asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' })
  }
  // In production, send email with reset link
  // For now, always return success to prevent email enumeration
  return res.json({ success: true, data: { message: 'If an account exists with that email, a reset link has been sent.' } })
}))

// Reset password
authRoutes.post('/reset-password', asyncHandler(async (req, res) => {
  const { token: resetToken, password } = req.body
  if (!resetToken || !password) {
    return res.status(400).json({ success: false, message: 'Token and password are required' })
  }
  try {
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    const passwordHash = await bcrypt.hash(password, 10)
    await User.findByIdAndUpdate(decoded.userId, { passwordHash })
    return res.json({ success: true, data: { message: 'Password reset successfully' } })
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid or expired reset token' })
  }
}))
