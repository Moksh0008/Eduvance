/**
 * Isolation check against a running API.
 * Usage: node scripts/isolation-test.js
 * Requires server/.env MONGODB_URI and the API listening on PORT.
 */
const base = process.env.API_URL || 'http://localhost:5000/api'

async function req(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(`${path} ${res.status}: ${json.message || JSON.stringify(json)}`)
  return json.data
}

const stamp = Date.now()
const userA = { name: 'User A', email: `a${stamp}@example.com`, password: 'secret1' }
const userB = { name: 'User B', email: `b${stamp}@example.com`, password: 'secret1' }

const a = await req('/auth/register', { method: 'POST', body: userA })
const b = await req('/auth/register', { method: 'POST', body: userB })

await req('/preparation', {
  method: 'PUT',
  token: a.token,
  body: {
    setupCompleted: true,
    subjects: [
      { id: 'os', name: 'Operating Systems', units: [] },
      { id: 'dbms', name: 'DBMS', units: [] },
      { id: 'cn', name: 'Computer Networks', units: [] },
    ],
  },
})

const aPrep = await req('/preparation', { token: a.token })
const bPrep = await req('/preparation', { token: b.token })

const aNames = (aPrep.subjects || []).map((s) => s.name).join(',')
const bNames = (bPrep.subjects || []).map((s) => s.name).join(',')

if (!aNames.includes('Operating Systems')) throw new Error('User A missing OS')
if (bNames.includes('Operating Systems')) throw new Error('User B leaked User A subjects')

await req('/preparation', {
  method: 'PUT',
  token: b.token,
  body: {
    setupCompleted: true,
    subjects: [
      { id: 'java', name: 'Java', units: [] },
      { id: 'dsa', name: 'DSA', units: [] },
    ],
  },
})

const aAgain = await req('/preparation', { token: a.token })
const bAgain = await req('/preparation', { token: b.token })
const a2 = (aAgain.subjects || []).map((s) => s.name).join(',')
const b2 = (bAgain.subjects || []).map((s) => s.name).join(',')

if (a2.includes('Java')) throw new Error('User A leaked User B subjects')
if (!b2.includes('Java') || b2.includes('Operating Systems')) throw new Error('User B isolation failed')

console.log('Isolation OK')
console.log('A:', a2)
console.log('B:', b2)
