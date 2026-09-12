import { apiCall } from './client'
import { asList } from '../utils/content'

export const getDeacons = async () => asList(await apiCall('/api/deacons'))

export const getDeacon = async (deaconId) => apiCall(`/api/deacons/${deaconId}`)

export const createDeacon = async (deaconData) =>
  apiCall('/api/deacons', { method: 'POST', body: JSON.stringify(deaconData) })

export const updateDeacon = async (deaconId, deaconData) =>
  apiCall(`/api/deacons/${deaconId}`, { method: 'PUT', body: JSON.stringify(deaconData) })

export const deleteDeacon = async (deaconId) =>
  apiCall(`/api/deacons/${deaconId}`, { method: 'DELETE' })
