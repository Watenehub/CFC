import { apiCall } from './client'
import { asList } from '../utils/content'

export const getEvents = async () => asList(await apiCall('/api/events'))
export const getEvent = async (eventId) => apiCall(`/api/events/${eventId}`)
export const createEvent = async (eventData) =>
  apiCall('/api/events', { method: 'POST', body: JSON.stringify(eventData) })
export const updateEvent = async (eventId, eventData) =>
  apiCall(`/api/events/${eventId}`, { method: 'PUT', body: JSON.stringify(eventData) })
export const deleteEvent = async (eventId) =>
  apiCall(`/api/events/${eventId}`, { method: 'DELETE' })
