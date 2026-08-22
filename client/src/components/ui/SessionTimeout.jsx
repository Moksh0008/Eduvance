import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAppState } from '../../context/AppState'
import { clearAuth, loadAuth } from '../../services/auth'

const WARNING_BEFORE_MS = 5 * 60 * 1000 // warn 5 minutes before expiry
const CHECK_INTERVAL_MS = 30 * 1000 // check every 30 seconds

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]
    const decoded = JSON.parse(atob(payload))
    return { exp: decoded.exp * 1000, iat: decoded.iat * 1000 }
  } catch {
    return null
  }
}

function formatTimeLeft(ms) {
  if (ms <= 0) return '0:00'
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export default function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [extending, setExtending] = useState(false)
  const timerRef = useRef(null)
  const navigate = useNavigate()
  const { isLoggedIn, logout } = useAppState()

  const handleExtend = useCallback(async () => {
    setExtending(true)
    try {
      const auth = loadAuth()
      if (!auth?.token) return

      const apiBase = import.meta.env.VITE_API_URL || ''
      const res = await fetch(`${apiBase}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${auth.token}`,
        },
      })
      const data = await res.json()
      if (data.success && data.data?.token) {
        const updated = { ...auth, token: data.data.token, user: data.data.user || auth.user }
        localStorage.setItem('auth', JSON.stringify(updated))
        setShowWarning(false)
        setTimeLeft(0)
      } else {
        logout()
        navigate('/login')
      }
    } catch {
      logout()
      navigate('/login')
    } finally {
      setExtending(false)
    }
  }, [logout, navigate])

  const handleLogout = useCallback(() => {
    clearAuth()
    logout()
    navigate('/login')
  }, [logout, navigate])

  useEffect(() => {
    if (!isLoggedIn) {
      setShowWarning(false)
      return
    }

    function check() {
      const auth = loadAuth()
      if (!auth?.token) return

      const decoded = decodeToken(auth.token)
      if (!decoded) return

      const remaining = decoded.exp - Date.now()

      if (remaining <= 0) {
        // Token expired
        clearAuth()
        logout()
        navigate('/login')
        return
      }

      setTimeLeft(remaining)

      if (remaining <= WARNING_BEFORE_MS) {
        setShowWarning(true)
      }
    }

    check()
    timerRef.current = setInterval(check, CHECK_INTERVAL_MS)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isLoggedIn, logout, navigate])

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="mx-4 w-full max-w-sm rounded-2xl border border-glass bg-surface p-6 shadow-2xl"
          >
            {/* Timer icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
              <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>

            <h2 className="text-center text-lg font-semibold text-ink">Session Expiring Soon</h2>
            <p className="mt-2 text-center text-sm text-ink-2">
              Your session will expire in{' '}
              <span className="font-mono font-bold text-amber-500">{formatTimeLeft(timeLeft)}</span>
            </p>
            <p className="mt-1 text-center text-xs text-ink-3">
              Extend your session to continue studying.
            </p>

            {/* Countdown bar */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line-2">
              <motion.div
                className="h-full rounded-full bg-amber-500"
                initial={{ width: '100%' }}
                animate={{ width: `${Math.max(0, (timeLeft / WARNING_BEFORE_MS) * 100)}%` }}
                transition={{ duration: 1, ease: 'linear' }}
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 rounded-xl border border-line-2 px-4 py-2.5 text-sm font-medium text-ink-2 transition-colors hover:bg-line-2"
              >
                Log Out
              </button>
              <button
                onClick={handleExtend}
                disabled={extending}
                className="flex-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
              >
                {extending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Extending…
                  </span>
                ) : (
                  'Extend Session'
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
