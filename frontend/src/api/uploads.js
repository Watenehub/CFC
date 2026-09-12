import { apiCall } from './client'

export const uploadFile = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const API_BASE = import.meta.env.VITE_API_BASE || ''
  const url = `${API_BASE}/api/upload`

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}
