/** REST client — unused in Phase 1. Point at VITE_API_URL when the backend exists. */

const base = import.meta.env.VITE_API_URL || ''

export async function apiGet(path) {
  const res = await fetch(`${base}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}
