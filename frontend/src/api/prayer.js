import { apiCall } from './client'

export const getPrayerRequests = async () => apiCall('/api/prayer')
export const createPrayerRequest = async (data) =>
  apiCall('/api/prayer', { method: 'POST', body: JSON.stringify(data) })
export const updatePrayerRequest = async (id, data) =>
  apiCall(`/api/prayer/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deletePrayerRequest = async (id) =>
  apiCall(`/api/prayer/${id}`, { method: 'DELETE' })
