import { apiCall } from './client'

export const getDashboardStats = async () => apiCall('/api/dashboard/stats')
