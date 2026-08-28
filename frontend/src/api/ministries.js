const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}

export const getMinistries = async () => {
  return apiCall('/api/ministries')
}

export const getMinistry = async (ministryId) => {
  return apiCall(`/api/ministries/${ministryId}`)
}
