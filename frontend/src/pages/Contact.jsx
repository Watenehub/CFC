import { useState } from 'react'
import * as enquiriesApi from '../api/enquiries'
import './Contact.css'

function Contact() {
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
      const response = await enquiriesApi.createEnquiry(formData)
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
          <h1>Contact Us</h1>
          <p className="contact-subtitle">
            We'd love to hear from you. Get in touch with us today.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-info">
            <h2>Get in Touch</h2>
            
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon image-icon" aria-hidden="true"></div>
                <div className="contact-text">
                  <h3>Address</h3>
                  <p>123 Church Street</p>
                  <p>Nairobi, Kenya</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-text">
                  <h3>Phone</h3>
                  <p>+254 700 000 000</p>
                  <p>+254 700 000 001</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-text">
                  <h3>Email</h3>
                  <p>info@cornerstonechapel.org</p>
                  <p>enquiries@cornerstonechapel.org</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon image-icon" aria-hidden="true"></div>
                <div className="contact-text">
                  <h3>Office Hours</h3>
                  <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            <div className="service-times-contact">
              <h3>Service Times</h3>
              <div className="service-time-item">
                <span className="service-day">Sunday Worship</span>
                <span className="service-time">9:00 AM - 11:00 AM</span>
              </div>
              <div className="service-time-item">
                <span className="service-day">Sunday School</span>
                <span className="service-time">10:30 AM - 11:30 AM</span>
              </div>
              <div className="service-time-item">
                <span className="service-day">Wednesday Bible Study</span>
                <span className="service-time">7:00 PM - 8:30 PM</span>
              </div>
              <div className="service-time-item">
                <span className="service-day">Friday Prayer Meeting</span>
                <span className="service-time">6:00 PM - 7:30 PM</span>
              </div>
            </div>
          </div>

          <div className="contact-form-container">
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
                className="btn btn-primary btn-full"
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
              <div className="map-icon">🗺️</div>
              <h3>Interactive Map</h3>
              <p>Map integration coming soon</p>
              <p className="map-address">123 Church Street, Nairobi, Kenya</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contact
