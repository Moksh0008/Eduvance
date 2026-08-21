import { Navigate, useLocation } from 'react-router-dom'
import { useAppState, useAuth } from '../../context/AppState'

export function RequireAuth({ children }) {
  const { isLoggedIn } = useAuth()
  const { bootstrapped } = useAppState()
  const location = useLocation()
  if (!bootstrapped) return null
  if (!isLoggedIn) {
    const next = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?next=${next}`} replace />
  }
  return children
}

export function startPreparingPath({ isLoggedIn, onboardingComplete }) {
  if (!isLoggedIn) return '/register?intent=prepare'
  if (!onboardingComplete) return '/setup'
  return '/dashboard'
}
