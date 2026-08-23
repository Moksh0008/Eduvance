import { api } from './api'
import { emptyWorkspace, saveWorkspace, loadWorkspace } from './workspace'

export async function pullPreparation() {
  // Skip API call if no token — avoid noisy 401 errors
  try {
    const raw = localStorage.getItem('eduvance.auth')
    if (!raw || !JSON.parse(raw).token) {
      const cached = loadWorkspace()
      return cached && (cached.setupCompleted || cached.onboardingComplete || cached.subjects?.length)
        ? cached : emptyWorkspace()
    }
  } catch {}

  try {
    const data = await api.get('/preparation')
    return saveWorkspace({ ...emptyWorkspace(), ...data, demoMode: false })
  } catch (err) {
    // Backend unreachable — use cached localStorage data if available
    console.warn('[Sync] pullPreparation failed, using localStorage fallback')
    const cached = loadWorkspace()
    if (cached && (cached.setupCompleted || cached.onboardingComplete || cached.subjects?.length)) {
      return cached
    }
    return emptyWorkspace()
  }
}

export async function pushPreparation(workspace) {
  const payload = { ...workspace, demoMode: false }
  saveWorkspace(payload) // Always save locally first
  const data = await api.put('/preparation', payload)
  return saveWorkspace({ ...emptyWorkspace(), ...data, demoMode: false })
}
