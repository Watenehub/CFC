const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}

export const getEnquiries = async () => {
  return apiCall('/api/enquiries')
}

export const getEnquiry = async (enquiryId) => {
  return apiCall(`/api/enquiries/${enquiryId}`)
}

export const createEnquiry = async (enquiryData) => {
  return apiCall('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiryData),
  })
}

export const updateEnquiry = async (enquiryId, enquiryData) => {
  return apiCall(`/api/enquiries/${enquiryId}`, {
    method: 'PUT',
    body: JSON.stringify(enquiryData),
  })
}

export const deleteEnquiry = async (enquiryId) => {
  return apiCall(`/api/enquiries/${enquiryId}`, { method: 'DELETE' })
}
