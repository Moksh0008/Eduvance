function resolveBase() {
  const env = String(import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')
  if (typeof window === 'undefined') return env || '/api'

  const host = window.location.hostname
  const isLoopback = host === 'localhost' || host === '127.0.0.1'
  const envPointsAtLoopback = /localhost|127\.0\.0\.1/.test(env)

  if (!isLoopback && envPointsAtLoopback) return '/api'
  return env || '/api'
}

function token() {
  try {
    const raw = localStorage.getItem('eduvance.auth')
    return raw ? JSON.parse(raw).token : null
  } catch {
    return null
  }
}

export class ApiError extends Error {
  constructor(message, status, body) {
    super(message)
    this.status = status
    this.body = body
  }
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const jwt = token()
    if (jwt) headers.Authorization = `Bearer ${jwt}`
  }

  let res
  try {
    res = await fetch(`${resolveBase()}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new ApiError('Cannot reach the Eduvance API. Is the server running?', 0)
  }

  const json = await res.json().catch(() => ({}))
  if (!res.ok || json.success === false) {
    const fallback =
      res.status === 404
        ? 'API route not found. Keep the server running (`cd server && npm run dev`) and restart the client.'
        : `Request failed (${res.status})`
    throw new ApiError(json.message || fallback, res.status, json)
  }
  return json.data
}

export const api = {
  get: (path, opts) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  del: (path, opts) => request(path, { ...opts, method: 'DELETE' }),
}

export function apiBase() {
  return resolveBase()
}
