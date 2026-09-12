import { apiCall } from './client'
import { asList } from '../utils/content'

export const getServices = async () => asList(await apiCall('/api/services'))
export const createService = async (data) =>
  apiCall('/api/services', { method: 'POST', body: JSON.stringify(data) })
export const updateService = async (id, data) =>
  apiCall(`/api/services/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteService = async (id) =>
  apiCall(`/api/services/${id}`, { method: 'DELETE' })
