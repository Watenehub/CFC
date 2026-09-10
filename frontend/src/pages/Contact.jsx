import { useState, useEffect } from 'react'
import * as enquiriesApi from '../api/enquiries'
import * as settingsApi from '../api/settings'
import './Contact.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Contact() {
  const [settings, setSettings] = useState({
    address: '',
    phone: '',
    email: '',
    office_hours: '',
    service_times: '',
  })
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    settingsApi.getSettings()
      .then(setSettings)
      .catch((err) => console.error(err))
  }, [])

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
      await enquiriesApi.createEnquiry(formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      setError(err.message || 'Failed to submit enquiry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="container">
        <section className="contact-header">
          <h1 className="fade-up">Contact Us</h1>
          <p className="contact-subtitle fade-up">
            We'd love to hear from you. Whether you have questions about our church, want to learn more about our ministries, or simply want to connect with our community, we're here to help.
          </p>
          <p className="contact-subtitle fade-up">
            Reach out to us and we'll get back to you as soon as possible.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-info">
            <div className="glass-card fade-up">
              <h2>Get in Touch</h2>
              
              <div className="contact-details">
                <div className="contact-item">
                  <div className="contact-icon image-icon" aria-hidden="true"></div>
                  <div className="contact-text">
                    <h3>Address</h3>
                    <p>{settings.address}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">📞</div>
                  <div className="contact-text">
                    <h3>Phone</h3>
                    <p>{settings.phone}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon">✉️</div>
                  <div className="contact-text">
                    <h3>Email</h3>
                    <p>{settings.email}</p>
                  </div>
                </div>

                <div className="contact-item">
                  <div className="contact-icon image-icon" aria-hidden="true"></div>
                  <div className="contact-text">
                    <h3>Office Hours</h3>
                    <p>{settings.office_hours}</p>
                  </div>
                </div>
              </div>

              <div className="service-times-contact">
                <h3>Service Times</h3>
                <p>{settings.service_times}</p>
              </div>

              {settings.map_url && (
                <div className="contact-map">
                  <h3>Find us</h3>
                  <a href={settings.map_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                    Open in Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="contact-form-container">
            <div className="glass-card fade-up">
              <h2>Send Us a Message</h2>
            
            {success && (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Message Sent Successfully</h3>
                <p>Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <div className="error-icon image-icon" aria-hidden="true"></div>
                <p>{error}</p>
              </div>
            )}

            </div>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
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
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
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
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  placeholder="How can we help you?"
                  disabled={loading}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn-premium btn-premium-primary btn-full"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="form-note">
              <p>
                <strong>Note:</strong> Enquiries are managed by our church secretary. 
                We typically respond within 1-2 business days. For urgent matters, 
                please call us directly.
              </p>
            </div>
          </div>
        </section>

        <section className="map-section">
          <h2>Find Us</h2>
          <div className="map-placeholder">
            <div className="map-content">
              <h3>{settings.church_name || 'Cornerstone Family Chapel'}</h3>
              <p className="map-address">{settings.address}</p>
              {settings.map_url ? (
                <a
                  href={settings.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium btn-premium-primary"
                >
                  Open in Google Maps
                </a>
              ) : (
                <p>Map link will appear once it is set in site settings.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
