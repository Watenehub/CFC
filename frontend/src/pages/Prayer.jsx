import { useState } from 'react'
import './Prayer.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Prayer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    prayerRequest: '',
    category: 'general',
    privacy: 'public'
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/prayer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit prayer request')
      }

      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        prayerRequest: '',
        category: 'general',
        privacy: 'public'
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'general', label: 'General Prayer Request' },
    { value: 'health', label: 'Health & Healing' },
    { value: 'family', label: 'Family' },
    { value: 'financial', label: 'Financial' },
    { value: 'spiritual', label: 'Spiritual Growth' },
    { value: 'guidance', label: 'Guidance & Direction' },
    { value: 'thanksgiving', label: 'Thanksgiving' },
    { value: 'other', label: 'Other' }
  ]

  return (
    <div className="prayer-page">
      <div className="container">
        <section className="prayer-header">
          <h1 className="fade-up">We Would Love to Pray With You</h1>
          <p className="prayer-subtitle fade-up">
            You don't have to walk through life's challenges alone.
          </p>
          <p className="prayer-subtitle fade-up">
            Share your prayer request with us, and allow our church family to stand with you in prayer, encouragement, and support.
          </p>
        </section>

        <section className="prayer-content">
          <div className="prayer-info">
            <div className="glass-card fade-up">
              <h2>How We Pray</h2>
              <div className="prayer-steps">
                <div className="glass-card fade-up">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h3>Submit Your Request</h3>
                    <p>Fill out the prayer request form with your needs and concerns.</p>
                  </div>
                </div>
                <div className="glass-card fade-up">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h3>Prayer Team Prays</h3>
                    <p>Our dedicated prayer team will pray for your request during our weekly prayer meetings.</p>
                  </div>
                </div>
                <div className="glass-card fade-up">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h3>Follow Up</h3>
                    <p>If you choose, we can follow up with you to see how you're doing.</p>
                  </div>
                </div>
              </div>

              <div className="prayer-promise">
                <div className="promise-icon">🙏</div>
                <h3>God Hears Your Prayers</h3>
                <p>
                  "The Lord is near to all who call on him, to all who call on him in truth." 
                  <span className="scripture-reference"> - Psalm 145:18</span>
                </p>
              </div>
            </div>
          </div>

          <div className="prayer-form-container">
            <div className="glass-card fade-up">
              <h2>Submit Your Prayer Request</h2>
            
            {success && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Prayer Request Submitted</h3>
                <p>Thank you for sharing your prayer request. Our prayer team will be praying for you.</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <div className="error-icon">✕</div>
                <p>{error}</p>
              </div>
            )}

            </div>
            <form onSubmit={handleSubmit} className="prayer-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 700 000 000"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prayerRequest">Prayer Request *</label>
                <textarea
                  id="prayerRequest"
                  name="prayerRequest"
                  value={formData.prayerRequest}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="Share your prayer request here..."
                  disabled={loading}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Privacy Preference</label>
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="privacy"
                      value="public"
                      checked={formData.privacy === 'public'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>Public - Share with the congregation</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="privacy"
                      value="private"
                      checked={formData.privacy === 'private'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>Private - Prayer team only</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="privacy"
                      value="pastor"
                      checked={formData.privacy === 'pastor'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>Pastor Only - Confidential</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-premium btn-premium-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Prayer Request'}
              </button>
            </form>

            <div className="glass-card form-note fade-up">
              <p>
                <strong>Note:</strong> Your prayer request will be treated with care and confidentiality 
                according to your privacy preference. For urgent prayer needs, please contact the church 
                office directly.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Prayer
