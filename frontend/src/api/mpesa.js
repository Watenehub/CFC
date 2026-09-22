import { API_BASE } from './client'

export const initiateMpesaPayment = async (paymentData) => {
  const url = `${API_BASE}/api/mpesa/stkpush`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(paymentData),
    credentials: 'include'
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const error = new Error(data?.error || 'An error occurred')
    error.status = response.status
    error.payload = data
    throw error
  }

  return response.json()
}