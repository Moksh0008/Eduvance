import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAppState } from '../../context/AppState'
import { startPreparingPath } from './RequireAuth'

export function StartPreparingButton({
  size = 'md',
  className,
  children = 'Start Preparing',
  continueLabel,
}) {
  const { isLoggedIn, onboardingComplete } = useAppState()
  const to = startPreparingPath({ isLoggedIn, onboardingComplete })
  const label = isLoggedIn && onboardingComplete ? continueLabel || 'Open Dashboard' : children

  return (
    <Button as={Link} to={to} size={size} className={className}>
      {label}
    </Button>
  )
}
