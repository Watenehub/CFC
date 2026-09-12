import { apiCall } from './client'
import { asList } from '../utils/content'

export const getGallery = async () => asList(await apiCall('/api/gallery'))

export const getGalleryItem = async (itemId) => apiCall(`/api/gallery/${itemId}`)

export const createGalleryItem = async (itemData) =>
  apiCall('/api/gallery', { method: 'POST', body: JSON.stringify(itemData) })

export const updateGalleryItem = async (itemId, itemData) =>
  apiCall(`/api/gallery/${itemId}`, { method: 'PUT', body: JSON.stringify(itemData) })

export const deleteGalleryItem = async (itemId) =>
  apiCall(`/api/gallery/${itemId}`, { method: 'DELETE' })
