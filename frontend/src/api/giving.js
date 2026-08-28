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

export const getGiving = async () => {
  return apiCall('/api/giving')
}

export const getGivingOption = async (givingId) => {
  return apiCall(`/api/giving/${givingId}`)
}

export const createGiving = async (givingData) => {
  return apiCall('/api/giving', {
    method: 'POST',
    body: JSON.stringify(givingData),
  })
}

export const updateGiving = async (givingId, givingData) => {
  return apiCall(`/api/giving/${givingId}`, {
    method: 'PUT',
    body: JSON.stringify(givingData),
  })
}

export const deleteGiving = async (givingId) => {
  return apiCall(`/api/giving/${givingId}`, { method: 'DELETE' })
}
