/* ═══════════════════════════════════════════════════
   BACKEND STATUS — Checks server health on load
   Non-blocking: dashboard renders immediately
   Shows a banner only if backend is unreachable
   ═══════════════════════════════════════════════════ */

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CHECK_INTERVAL = 60000 // re-check every 60 seconds (less aggressive)
const WAKEUP_TIMEOUT = 45000 // Render free tier cold start ~30-50s

export function BackendStatus() {
  const [status, setStatus] = useState('idle') // 'idle' | 'waking' | 'online' | 'offline' | 'degraded'
  const [details, setDetails] = useState(null)
  const [dismissed, setDismissed] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const mountedRef = useRef(true)

  const checkHealth = useCallback(async () => {
    if (!mountedRef.current) return
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout
      const res = await fetch('/api/health', { method: 'GET', signal: controller.signal })
      clearTimeout(timeout)
      const json = await res.json()
      if (!mountedRef.current) return
      if (json.data?.ok) {
        setStatus('online')
        setDetails(json.data)
        setDismissed(false)
        setRetryCount(0)
      } else {
        setStatus('degraded')
        setDetails(json.data)
      }
    } catch {
      if (!mountedRef.current) return
      // If first check fails, server might be waking up
      if (retryCount < 2) {
        setStatus('waking')
        setRetryCount(prev => prev + 1)
        // Retry after Render cold start time
        setTimeout(checkHealth, 8000)
      } else {
        setStatus('offline')
        setDetails(null)
      }
    }
  }, [retryCount])

  useEffect(() => {
    mountedRef.current = true
    // Fire health check immediately but DON'T block rendering
    // Small delay so dashboard renders first
    const timer = setTimeout(checkHealth, 500)
    const interval = setInterval(checkHealth, CHECK_INTERVAL)
    return () => {
      mountedRef.current = false
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Never show banner while idle or online
  if (status === 'idle' || status === 'online' || (dismissed && status !== 'offline')) {
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
          background: status === 'waking'
            ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            : status === 'offline'
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#fff',
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">
            {status === 'waking' ? '⚡' : status === 'offline' ? '🔴' : '🟡'}
          </span>
          <div>
            <p className="font-semibold">
              {status === 'waking'
                ? 'Waking up server...'
                : status === 'offline'
                  ? 'Backend is offline'
                  : 'Backend is degraded'}
            </p>
            <p className="text-xs opacity-90">
              {status === 'waking'
                ? 'Render free tier spins down after inactivity. First request may take 30s.'
                : status === 'offline'
                  ? 'PDF upload, AI analysis, and quizzes require the backend.'
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
