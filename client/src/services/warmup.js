/* ═══ WARMUP — Prevents Render free tier cold starts ═══ */

let warmedUp = false

/**
 * Ping the backend on first load so it's warm when the user needs it.
 * Fire-and-forget — never blocks the UI.
 */
export function warmBackend() {
  if (warmedUp) return
  warmedUp = true

  // Delay ping well past LCP (5s) so it never blocks rendering
  setTimeout(() => {
    fetch('/api/health', { method: 'GET', priority: 'low' })
      .then(res => {
        if (res.ok) console.log('[Warmup] Backend is alive')
        else console.log('[Warmup] Backend responded with', res.status)
      })
      .catch(() => console.log('[Warmup] Backend unreachable — will retry on next request'))

    // Second ping after 8 seconds (in case first one hit a cold start)
    setTimeout(() => {
      fetch('/api/health', { priority: 'low' }).catch(() => {})
    }, 8000)
  }, 5000)
}
