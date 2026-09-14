import { API_BASE, apiCall, getCsrfToken } from './client'

export async function uploadImage(file) {
  if (!file) throw new Error('No file selected')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be 8MB or smaller')

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
    throw new Error(data.error || 'Upload failed')
  }

  return data.url
}
