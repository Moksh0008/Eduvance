import { verifyToken } from '../utils/token.js'
import { User } from '../models/User.js'

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ success: false, message: 'Authentication required' })
    }

    const decoded = verifyToken(token)
    const userId = decoded.userId
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Invalid token' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' })
    }

    req.user = {
      userId: String(user._id),
      name: user.name,
      email: user.email,
    }
    return next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Session expired' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
