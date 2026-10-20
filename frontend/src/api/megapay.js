import { apiCall } from './client'

export const initiateMegapayPayment = (paymentData) =>
  apiCall('/api/megapay/stkpush', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  })

export const getMegapayStatus = (transactionRequestId) =>
  apiCall('/api/megapay/status', {
    method: 'POST',
    body: JSON.stringify({ transaction_request_id: transactionRequestId }),
  })

export const getMegapayTransactions = (status = '', refresh = false) => {
  const params = new URLSearchParams()
  if (status) params.set('status', status)
  if (refresh) params.set('refresh', '1')
  const query = params.toString()
  return apiCall('/api/megapay/transactions' + (query ? '?' + query : ''))
}
