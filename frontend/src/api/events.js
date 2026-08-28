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

export const getEvents = async () => {
  return apiCall('/api/events')
}

export const getEvent = async (eventId) => {
  return apiCall(`/api/events/${eventId}`)
}

export const createEvent = async (eventData) => {
  return apiCall('/api/events', {
    method: 'POST',
    body: JSON.stringify(eventData),
  })
}

export const updateEvent = async (eventId, eventData) => {
  return apiCall(`/api/events/${eventId}`, {
    method: 'PUT',
    body: JSON.stringify(eventData),
  })
}

export const deleteEvent = async (eventId) => {
  return apiCall(`/api/events/${eventId}`, { method: 'DELETE' })
}
