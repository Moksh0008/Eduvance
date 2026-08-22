/* ═══════════════════════════════════════════════════
   BACKEND STATUS — Non-blocking health check
   Shows banner only when backend is unreachable
   Auto-recovers when backend comes back online
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHECK_INTERVAL = 60000 // re-check every 60 seconds

export function BackendStatus() {
  const [status, setStatus] = useState('idle') // 'idle' | 'waking' | 'online' | 'offline' | 'degraded'
  const [details, setDetails] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const mountedRef = useRef(true)

  const checkHealth = useCallback(async () => {
    if (!mountedRef.current) return
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 12000) // 12s timeout
      const res = await fetch('/api/health', { method: 'GET', signal: controller.signal })
      clearTimeout(timeout)
      const json = await res.json()
      if (!mountedRef.current) return
      if (json.data?.ok) {
        setStatus('online')
        setDetails(json.data)
        setDismissed(false)
      } else {
        setStatus('degraded')
        setDetails(json.data)
      }
    } catch {
      if (!mountedRef.current) return
      setStatus('offline')
      setDetails(null)
    }
  }, [])

  useEffect(() => {
    mountedRef.current = true
    // Delay first check so dashboard renders immediately
    const timer = setTimeout(checkHealth, 1000)
    const interval = setInterval(checkHealth, CHECK_INTERVAL)
    return () => {
      mountedRef.current = false
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Never show banner while idle or online
  if (status === 'idle' || status === 'online' || dismissed) {
    return null
  }

  const bgColor = status === 'waking'
    ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    : status === 'offline'
      ? 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        className="fixed left-0 right-0 top-0 z-[100] flex items-center justify-between px-4 py-2.5 text-sm"
        style={{ background: bgColor, color: '#fff' }}
      >
        <div className="flex items-center gap-3">
          <motion.span
            className="text-lg"
            animate={status === 'waking' ? { rotate: [0, 360] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {status === 'waking' ? '⚡' : status === 'offline' ? '🔴' : '🟡'}
          </motion.span>
          <div>
            <p className="font-semibold">
              {status === 'waking'
                ? 'Waking up server...'
                : status === 'offline'
                  ? 'Backend is sleeping'
                  : 'Backend is degraded'}
            </p>
            <p className="text-xs opacity-90">
              {status === 'waking'
                ? 'Render free tier spins down after inactivity. Waking up now...'
                : status === 'offline'
                  ? 'The server was automatically put to sleep. Click Retry to wake it up.'
                  : `MongoDB: ${details?.mongodb || 'unknown'} · Grok: ${details?.grok || 'unknown'}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStatus('waking')
              setDismissed(false)
              checkHealth()
            }}
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
