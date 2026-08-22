function resolveBase() {
  return '/api'
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

async function request(path, { method = 'GET', body, auth = true, retries = 2 } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const jwt = token()
    if (jwt) headers.Authorization = `Bearer ${jwt}`
  }

  let lastError
  for (let attempt = 0; attempt <= retries; attempt++) {
    let res
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000) // 10s timeout
      res = await fetch(`${resolveBase()}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      })
      clearTimeout(timeout)
    } catch (err) {
      lastError = new ApiError(
        'Cannot reach the Eduvance API. The backend server may be starting up — retrying...',
        0,
      )
      // Wait before retry (exponential backoff: 1s, 2s)
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
        continue
      }
      throw lastError
    }

    // Don't retry on 4xx errors (client errors)
    if (res.status >= 400 && res.status < 500) {
      const json = await res.json().catch(() => ({}))
      const fallback = res.status === 404
        ? 'API route not found.'
        : `Request failed (${res.status})`
      throw new ApiError(json.message || fallback, res.status, json)
    }

    // Retry on 5xx errors (server errors)
    if (res.status >= 500 && attempt < retries) {
      await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
      continue
    }

    const json = await res.json().catch(() => ({}))
    if (!res.ok || json.success === false) {
      throw new ApiError(json.message || `Request failed (${res.status})`, res.status, json)
    }
    return json.data
  }

  throw lastError || new ApiError('Request failed after retries', 0)
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
