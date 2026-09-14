import { API_BASE, apiCall, getCsrfToken } from './client'

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const token = await getCsrfToken()

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    headers: { 'X-CSRFToken': token },
  })

  const data = await response.json().catch(() => ({}))
  if (data?.code === 'csrf_failed') {
    return apiCall('/api/upload', { method: 'POST', body: formData })
  }
  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}
