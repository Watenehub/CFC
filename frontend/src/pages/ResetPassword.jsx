import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import * as authApi from '../api/auth'
import './Login.css'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = useMemo(() => searchParams.get('token') || '', [searchParams])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await authApi.resetPassword(token, password)
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to reset this password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-header">
            <h1>Choose a new password</h1>
            <p className="login-subtitle">Use at least 8 characters with upper and lower case, a number, and a symbol.</p>
          </div>

          {error && (
            <div className="error-message">
              <div className="error-icon">✕</div>
              <p>{error}</p>
            </div>
          )}

          {!token ? (
            <p>This reset link is missing a token. Request a new link from the sign-in page.</p>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="password">New password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Updating...' : 'Update password'}
              </button>
            </form>
          )}

          <div className="register-footer">
            <p><Link to="/login" className="forgot-password">Back to sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
