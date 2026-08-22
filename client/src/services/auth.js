import { readStore, writeStore, removeStore } from './storage'
import { api } from './api'

export function loadAuth() {
  return readStore('auth', null)
}

export function saveAuth(session) {
  writeStore('auth', session)
  return session
}

export function clearAuth() {
  removeStore('auth')
}

export async function registerAccount({ name, email, password }) {
  const data = await api.post('/auth/register', { name, email, password }, { auth: false })
  const saved = saveAuth({ token: data.token, user: data.user, createdAt: new Date().toISOString() })
  return { ...saved, requiresVerification: data.requiresVerification }
}

export async function loginAccount({ email, password }) {
  const data = await api.post('/auth/login', { email, password }, { auth: false })
  return saveAuth({ token: data.token, user: data.user, createdAt: new Date().toISOString() })
}

export async function fetchMe() {
  return api.get('/auth/me')
}
