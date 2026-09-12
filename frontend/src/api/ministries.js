import { apiCall } from './client'
import { asList } from '../utils/content'

export const getMinistries = async () => asList(await apiCall('/api/ministries'))

export const getMinistry = async (ministryId) => apiCall(`/api/ministries/${ministryId}`)

export const createMinistry = async (ministryData) =>
  apiCall('/api/ministries', { method: 'POST', body: JSON.stringify(ministryData) })

export const updateMinistry = async (ministryId, ministryData) =>
  apiCall(`/api/ministries/${ministryId}`, { method: 'PUT', body: JSON.stringify(ministryData) })

export const deleteMinistry = async (ministryId) =>
  apiCall(`/api/ministries/${ministryId}`, { method: 'DELETE' })
