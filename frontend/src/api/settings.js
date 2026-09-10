import { apiCall } from './client'

export const getSettings = async () => apiCall('/api/settings')

export const updateSettings = async (settingsData) =>
  apiCall('/api/settings', { method: 'PUT', body: JSON.stringify(settingsData) })

export const updateLivestream = async (payload) =>
  apiCall('/api/settings/livestream', { method: 'PUT', body: JSON.stringify(payload) })
