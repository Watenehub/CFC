import { apiCall } from './client'
import { asList } from '../utils/content'

export const getNotifications = async (activeOnly = false) =>
  asList(await apiCall(`/api/notifications${activeOnly ? '?active=1' : ''}`))
export const createNotification = async (data) =>
  apiCall('/api/notifications', { method: 'POST', body: JSON.stringify(data) })
export const updateNotification = async (id, data) =>
  apiCall(`/api/notifications/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const deleteNotification = async (id) =>
  apiCall(`/api/notifications/${id}`, { method: 'DELETE' })
