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

export const getSermons = async () => {
  return apiCall('/api/sermons')
}

export const getSermon = async (sermonId) => {
  return apiCall(`/api/sermons/${sermonId}`)
}

export const createSermon = async (sermonData) => {
  return apiCall('/api/sermons', {
    method: 'POST',
    body: JSON.stringify(sermonData),
  })
}

export const updateSermon = async (sermonId, sermonData) => {
  return apiCall(`/api/sermons/${sermonId}`, {
    method: 'PUT',
    body: JSON.stringify(sermonData),
  })
}

export const deleteSermon = async (sermonId) => {
  return apiCall(`/api/sermons/${sermonId}`, { method: 'DELETE' })
}
