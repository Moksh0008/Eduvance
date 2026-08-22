/* ═══════════════════════════════════════════════════
   BACKEND STATUS — Checks server health on load
   Shows a banner if backend is unreachable
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'

const CHECK_INTERVAL = 30000 // re-check every 30 seconds

export function BackendStatus() {
  const [status, setStatus] = useState('checking') // 'checking' | 'online' | 'offline' | 'degraded'
  const [details, setDetails] = useState(null)
  const [dismissed, setDismissed] = useState(false)

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/health', { method: 'GET' })
      const json = await res.json()
      if (json.data?.ok) {
        setStatus('online')
        setDetails(json.data)
        setDismissed(false)
      } else {
        setStatus('degraded')
        setDetails(json.data)
      }
    } catch {
      setStatus('offline')
      setDetails(null)
    }
  }, [])

  useEffect(() => {
    checkHealth()
    const interval = setInterval(checkHealth, CHECK_INTERVAL)
    return () => clearInterval(interval)
  }, [checkHealth])

  // Don't show banner if online or user dismissed
  if (status === 'checking' || status === 'online' || (dismissed && status !== 'offline')) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-4 py-2.5 text-sm"
        style={{
          background: status === 'offline'
            ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {status === 'offline' ? '🔴' : '🟡'}
          </span>
          <div>
            <p className="font-semibold">
              {status === 'offline'
                ? 'Backend server is offline'
                : 'Backend is degraded'}
            </p>
            <p className="text-xs opacity-90">
              {status === 'offline'
                ? 'PDF upload, AI analysis, and quizzes require the backend. Start it with: cd server && npm run dev'
                : `MongoDB: ${details?.mongodb || 'unknown'} · Grok: ${details?.grok || 'unknown'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={checkHealth}
            className="rounded-md px-3 py-1 text-xs font-medium bg-white/20 hover:bg-white/30 transition-colors"
          >
            Retry
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="rounded-md px-3 py-1 text-xs font-medium bg-white/10 hover:bg-white/20 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default BackendStatus
