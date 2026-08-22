/* ═══════════════════════════════════════════════════
   AUTH CALLBACK — Handles Google OAuth redirect
   ═══════════════════════════════════════════════════ */

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { saveAuth } from '../services/auth'
import { useAppState } from '../context/AppState'

export function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()

  useEffect(() => {
    const token = params.get('token')
    const userStr = params.get('user')
    const error = params.get('error')

    if (error) {
      navigate(`/login?error=${error}`)
      return
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr))
        saveAuth({ token, user, createdAt: new Date().toISOString() })
        window.location.href = '/dashboard'
      } catch {
        navigate('/login?error=parse_failed')
      }
    } else {
      navigate('/login?error=no_token')
    }
  }, [params, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="text-center">
        <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <p className="text-sm text-ink-2">Signing you in...</p>
      </div>
    </div>
  )
}
