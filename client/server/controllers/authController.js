import bcrypt from 'bcryptjs'
import { User } from '../models/User.js'
import { Preparation } from '../models/Preparation.js'
import { signToken } from '../utils/token.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { emptyPreparation } from '../utils/emptyPreparation.js'

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
  }
}

function authPayload(user) {
  return {
    token: signToken(user._id),
    user: publicUser(user),
  }
}

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}

export const register = asyncHandler(async (req, res) => {
  const name = String(req.body.name || '').trim()
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')

  if (!name) return res.status(400).json({ success: false, message: 'Name is required' })
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'A valid email is required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ success: false, message: 'Email already registered' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, passwordHash })
  await Preparation.create({
    userId: user._id,
    ...emptyPreparation(),
    student: { name, email },
  })

  return res.status(201).json({
    success: true,
    data: authPayload(user),
  })
})

export const login = asyncHandler(async (req, res) => {
  const email = normalizeEmail(req.body.email)
  const password = String(req.body.password || '')

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' })
  }

  const user = await User.findOne({ email }).select('+passwordHash')
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' })
  }

  return res.json({
    success: true,
    data: authPayload(user),
  })
})

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
  if (!user) return res.status(404).json({ success: false, message: 'User not found' })
  const preparation = await Preparation.findOne({ userId: req.user.userId })
  return res.json({
    success: true,
    data: {
      user: publicUser(user),
      setupCompleted: Boolean(preparation?.setupCompleted || preparation?.onboardingComplete),
    },
  })
})
