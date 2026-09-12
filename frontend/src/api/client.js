export const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    cache: 'no-store',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  }

  const response = await fetch(url, config)
  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    const error = new Error(data?.error || 'An error occurred')
    error.status = response.status
    error.payload = data
    throw error
  }

  return data
}
