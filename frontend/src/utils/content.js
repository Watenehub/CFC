const API_BASE = import.meta.env.VITE_API_BASE || ''

export function asList(data) {
  if (Array.isArray(data)) return data
  if (!data || typeof data !== 'object') return []
  const nested = data.items || data.events || data.ministries || data.giving || data.notifications || data.services
  return Array.isArray(nested) ? nested : []
}

export function isUpcomingDate(value) {
  if (!value) return true
  const stamp = String(value).slice(0, 10)
  const parts = stamp.split('-').map(Number)
  let eventDay
  if (parts.length === 3 && parts[0] > 31) {
    eventDay = new Date(parts[0], parts[1] - 1, parts[2])
  } else {
    eventDay = new Date(value)
  }
  if (Number.isNaN(eventDay.getTime())) return true
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  eventDay.setHours(0, 0, 0, 0)
  return eventDay.getTime() >= today.getTime()
}

export function formatDisplayDate(value) {
  if (!value) return ''
  const date = new Date(String(value).length <= 10 ? `${value}T12:00:00` : value)
  if (Number.isNaN(date.getTime())) return String(value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function categoryKey(value) {
  return String(value || '').trim().toLowerCase()
}

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (url.startsWith('/uploads/')) {
    return `${API_BASE}${url}`
  }
  if (!API_BASE && url.startsWith('http://localhost:5000')) {
    return url.replace('http://localhost:5000', '')
  }
  return url
}
