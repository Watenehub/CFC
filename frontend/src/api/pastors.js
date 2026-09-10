import { apiCall } from './client'

export const getPastors = async () => apiCall('/api/pastors')

export const getPastor = async (pastorId) => apiCall(`/api/pastors/${pastorId}`)

export const createPastor = async (pastorData) =>
  apiCall('/api/pastors', { method: 'POST', body: JSON.stringify(pastorData) })

export const updatePastor = async (pastorId, pastorData) =>
  apiCall(`/api/pastors/${pastorId}`, { method: 'PUT', body: JSON.stringify(pastorData) })

export const deletePastor = async (pastorId) =>
  apiCall(`/api/pastors/${pastorId}`, { method: 'DELETE' })
