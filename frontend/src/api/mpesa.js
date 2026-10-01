import { apiCall } from './client'

export const initiateMpesaPayment = (paymentData) =>
  apiCall('/api/mpesa/stkpush', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  })