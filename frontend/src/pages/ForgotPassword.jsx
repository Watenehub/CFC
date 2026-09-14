import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as authApi from '../api/auth'
import './Login.css'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const response = await authApi.requestPasswordReset(email)
      setMessage(response.message)
    } catch (err) {
      setError(err.message || 'Unable to send a reset email right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Reset password</h1>
            <p className="login-subtitle">Enter the email on your staff account.</p>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">✕</div>
              <p>{error}</p>
            </div>
          )}
          {message && (
            <div className="success-message">
              <p>{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="your.email@example.com"
                disabled={loading}
                autoComplete="username"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <div className="register-footer">
            <p><Link to="/login" className="forgot-password">Back to sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
