import { apiCall } from './client'
import { asList } from '../utils/content'

export const getGiving = async () => asList(await apiCall('/api/giving'))
export const getGivingOption = async (givingId) => apiCall(`/api/giving/${givingId}`)
export const createGiving = async (givingData) =>
  apiCall('/api/giving', { method: 'POST', body: JSON.stringify(givingData) })
export const updateGiving = async (givingId, givingData) =>
  apiCall(`/api/giving/${givingId}`, { method: 'PUT', body: JSON.stringify(givingData) })
export const deleteGiving = async (givingId) =>
  apiCall(`/api/giving/${givingId}`, { method: 'DELETE' })
