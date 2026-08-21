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
  if (!dateStr) return 99
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const exam = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(exam.getTime())) return 99
  return Math.round((exam - today) / 86400000)
}

export function formatDate(dateStr) {
  if (!dateStr) return 'Date TBD'
  const d = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(d.getTime())) return 'Date TBD'
  return d.toLocaleDateString('en-IN', {
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
