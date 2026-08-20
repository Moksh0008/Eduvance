export function formatHours(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}m`
  if (m === 0) return `${h}h`
  return `${h}h ${m}m`
}

export function formatTime(isoOrHm) {
  if (isoOrHm.includes(':') && isoOrHm.length <= 5) return isoOrHm
  return isoOrHm
}

export function daysUntil(dateStr) {
  const today = new Date('2026-08-20T00:00:00')
  const exam = new Date(`${dateStr}T00:00:00`)
  return Math.round((exam - today) / 86400000)
}

export function formatDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatClock(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

export function priorityLabel(score) {
  if (score >= 80) return 'High'
  if (score >= 55) return 'Medium'
  return 'Low'
}
