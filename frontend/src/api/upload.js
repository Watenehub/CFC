const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

export async function uploadImage(file) {
  if (!file) throw new Error('No file selected')
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file')
  if (file.size > 8 * 1024 * 1024) throw new Error('Image must be 8MB or smaller')

  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE}/api/upload`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || 'Upload failed')
  }

  return data.url
}
