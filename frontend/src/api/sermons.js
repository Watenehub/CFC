import { apiCall } from './client'
import { asList } from '../utils/content'

export const getSermons = async () => asList(await apiCall('/api/sermons'))
export const getSermon = async (sermonId) => apiCall(`/api/sermons/${sermonId}`)
export const createSermon = async (sermonData) =>
  apiCall('/api/sermons', { method: 'POST', body: JSON.stringify(sermonData) })
export const updateSermon = async (sermonId, sermonData) =>
  apiCall(`/api/sermons/${sermonId}`, { method: 'PUT', body: JSON.stringify(sermonData) })
export const deleteSermon = async (sermonId) =>
  apiCall(`/api/sermons/${sermonId}`, { method: 'DELETE' })
