import { api } from './api'
import { emptyWorkspace, saveWorkspace } from './workspace'

export async function pullPreparation() {
  const data = await api.get('/preparation')
  return saveWorkspace({ ...emptyWorkspace(), ...data, demoMode: false })
}

export async function pushPreparation(workspace) {
  const payload = { ...workspace, demoMode: false }
  saveWorkspace(payload)
  const data = await api.put('/preparation', payload)
  return saveWorkspace({ ...emptyWorkspace(), ...data, demoMode: false })
}
