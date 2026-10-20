import { useEffect, useState } from 'react'
import * as givingApi from '../api/giving'
import * as megapayApi from '../api/megapay'
import './QuickGive.css'

function QuickGive() {
  const [options, setOptions] = useState([])
  const [givingId, setGivingId] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('')
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [paying, setPaying] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    givingApi.getGiving()
      .then(setOptions)
      .catch(() => setMessage('Could not load giving options. Please try again.'))
      .finally(() => setLoadingOptions(false))
  }, [])

  const waitForPayment = async (requestId) => {
    if (!requestId) return
    for (let attempt = 0; attempt < 30; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 4000))
      try {
        const { status } = await megapayApi.getMegapayStatus(requestId)
        if (status === 'success') {
          setSuccess(true)
          setMessage('')
          return
        }
        if (status === 'failed' || status === 'cancelled') {
          setMessage(status === 'cancelled' ? 'The payment was cancelled.' : 'The payment was not completed. Please try again.')
          return
        }
      } catch {
        // keep waiting; the next poll may succeed
      }
    }
    setMessage('We have not received confirmation yet. If money was deducted, it will reflect shortly.')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setPaying(true)
    setMessage('')
    setSuccess(false)
    try {
      const result = await megapayApi.initiateMegapayPayment({ giving_id: Number(givingId), phone, amount })
      setMessage(result.message || 'Check your phone to complete the payment.')
      await waitForPayment(result.transaction_request_id)
    } catch (err) {
      setMessage(err.message || 'Payment could not be started. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="qg-page">
      <div className="qg-card" role="dialog" aria-label="Give digitally">
        <img src="/logo.png" alt="Cornerstone Family Chapel" className="qg-logo" />
        <h1>Give Digitally</h1>
        <p className="qg-sub">Choose what you are giving towards, then enter your M-PESA number and amount.</p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="qg-type">Giving type</label>
          <select id="qg-type" value={givingId} onChange={(e) => setGivingId(e.target.value)} required disabled={loadingOptions || paying}>
            <option value="">{loadingOptions ? 'Loading...' : 'Select giving type'}</option>
            {options.map((option) => (
              <option key={option.id} value={option.id}>{option.title}</option>
            ))}
          </select>
          <label htmlFor="qg-phone">M-PESA phone number</label>
          <input id="qg-phone" type="tel" inputMode="tel" placeholder="07XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required disabled={paying} />
          <label htmlFor="qg-amount">Amount (KSh)</label>
          <input id="qg-amount" type="number" inputMode="numeric" min="1" max="150000" placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={paying} />
          <button type="submit" disabled={paying}>{paying ? 'Waiting for payment...' : 'Give Now'}</button>
        </form>
        {message && <p className="qg-message">{message}</p>}
        {success && <p className="qg-success" role="status">&#127881; Payment successful! Thank you for your generous giving.</p>}
      </div>
    </div>
  )
}

export default QuickGive
