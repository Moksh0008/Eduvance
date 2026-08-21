import { useAppState } from '../context/AppState'
import { buildDemoView, buildUserView } from '../services/viewModel'

export function useAppData() {
  const { user, workspace, demoMode } = useAppState()
  if (demoMode) return buildDemoView()
  return buildUserView(workspace, user)
}
