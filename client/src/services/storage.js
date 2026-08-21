const PREFIX = 'eduvance.'

export function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function writeStore(key, value) {
  localStorage.setItem(PREFIX + key, JSON.stringify(value))
}

export function removeStore(key) {
  localStorage.removeItem(PREFIX + key)
}

export function workspaceCacheKey(userId) {
  return userId ? `workspace.${userId}` : 'workspace'
}

export function savePreparation(data, userId) {
  if (!userId) return data
  writeStore(workspaceCacheKey(userId), data)
  return data
}

export function loadPreparation(userId) {
  if (!userId) return null
  return readStore(workspaceCacheKey(userId), null)
}

export function clearPreparation(userId) {
  if (userId) removeStore(workspaceCacheKey(userId))
  else removeStore('workspace')
}

export function loadUi() {
  return { demoMode: false, ...readStore('ui', {}) }
}

export function saveUi(ui) {
  writeStore('ui', ui)
  return ui
}
