import { apiCall } from './client'
import { asList } from '../utils/content'

export const getEnquiries = async () => asList(await apiCall('/api/enquiries'))
export const getEnquiry = async (enquiryId) => apiCall(`/api/enquiries/${enquiryId}`)
export const createEnquiry = async (enquiryData) =>
  apiCall('/api/enquiries', { method: 'POST', body: JSON.stringify(enquiryData) })
export const updateEnquiry = async (enquiryId, enquiryData) =>
  apiCall(`/api/enquiries/${enquiryId}`, { method: 'PUT', body: JSON.stringify(enquiryData) })
export const deleteEnquiry = async (enquiryId) =>
  apiCall(`/api/enquiries/${enquiryId}`, { method: 'DELETE' })
