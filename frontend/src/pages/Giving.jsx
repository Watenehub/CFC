import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as givingApi from '../api/giving'
import * as mpesaApi from '../api/mpesa'
import './Giving.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Giving() {
  const [givingOptions, setGivingOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDigitalGiving, setSelectedDigitalGiving] = useState('')

  // Digital giving form state
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState('')
  const [paymentPhone, setPaymentPhone] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    loadGivingOptions()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setError('Loading took too long. Please refresh the page.')
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

  const loadGivingOptions = async () => {
    try {
      const data = await givingApi.getGiving()
      setGivingOptions(data)
    } catch (err) {
      setError('Failed to load giving options')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Offering', 'Tithe', 'Missions', 'Building Fund', 'Donations', 'Other']

  const filteredOptions = selectedCategory
    ? givingOptions.filter(option => option.category === selectedCategory)
    : givingOptions

  /*
   * When the visitor selects a giving option
   * from "Give Digitally", show the payment form.
   *
   * Later this is where we can connect the
   * M-PESA/Daraja payment process.
   */
  const handleDigitalGivingChange = (event) => {
    const givingId = event.target.value

    setSelectedDigitalGiving(givingId)

    if (!givingId) {
      setShowPaymentForm(false)
      setPaymentAmount('')
      setPaymentPhone('')
      setFormErrors({})
      return
    }

    setShowPaymentForm(true)
  }

  const validateForm = () => {
    const errors = {}

    // Validate giving option
    if (!selectedDigitalGiving) {
      errors.giving = 'Please select a giving option'
    }

    // Validate amount
    if (!paymentAmount) {
      errors.amount = 'Please enter an amount'
    } else {
      const amount = parseFloat(paymentAmount)
      if (isNaN(amount) || amount <= 0) {
        errors.amount = 'Amount must be greater than 0'
      }
    }

    // Validate phone number
    if (!paymentPhone) {
      errors.phone = 'Please enter your M-PESA phone number'
    } else {
      // Remove spaces and common formatting
      const cleanPhone = paymentPhone.replace(/\s/g, '')

      // Validate Kenyan phone number format
      // Accept formats: 07XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
      const phoneRegex = /^(\+?254|0)[17]\d{8}$/

      if (!phoneRegex.test(cleanPhone)) {
        errors.phone = 'Please enter a valid Kenyan phone number (e.g., 07XXXXXXXX or 2547XXXXXXXX)'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const formatPhoneNumber = (phone) => {
    // Convert to Daraja format: 2547XXXXXXXX or 2541XXXXXXXX
    const cleanPhone = phone.replace(/\s/g, '')

    if (cleanPhone.startsWith('+254')) {
      return cleanPhone.substring(1) // Remove +, keep 254
    } else if (cleanPhone.startsWith('0')) {
      return '254' + cleanPhone.substring(1) // Replace 0 with 254
    } else if (cleanPhone.startsWith('254')) {
      return cleanPhone // Already in correct format
    }

    return cleanPhone
  }

  const handlePaymentSubmit = async (event) => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setFormErrors({})

    try {
      const selectedGiving = givingOptions.find(option => option.id === parseInt(selectedDigitalGiving))

      const paymentData = {
        giving_id: parseInt(selectedDigitalGiving),
        amount: parseFloat(paymentAmount),
        phone: formatPhoneNumber(paymentPhone)
      }

      const response = await mpesaApi.initiateMpesaPayment(paymentData)

      // Show success message from backend
      alert(response.message || response.customer_message || 'STK Push initiated successfully')

      // Reset form after successful submission
      closePaymentForm()

    } catch (error) {
      console.error('Payment submission error:', error)
      console.error('Error status:', error.status)
      console.error('Error payload:', error.payload)

      // Handle different error types
      if (error.status === 404) {
        setFormErrors({ giving: 'Giving option not found' })
      } else if (error.status === 400) {
        setFormErrors({ general: error.payload?.error || error.payload?.details || 'Invalid payment details' })
      } else if (error.status === 503) {
        setFormErrors({ general: 'Payment service unavailable. Please check your Daraja credentials.' })
      } else if (error.status === 502) {
        setFormErrors({ general: 'Payment service error. Please try again.' })
      } else {
        setFormErrors({ general: `Failed to initiate payment: ${error.message || 'Unknown error'}` })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePaymentForm = () => {
    setShowPaymentForm(false)
    setSelectedDigitalGiving('')
    setPaymentAmount('')
    setPaymentPhone('')
    setFormErrors({})
  }

  if (loading) {
    return (
      <div className="giving-page">
        <div className="container">
          <div className="loading-state">Loading giving options...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="giving-page">
        <div className="container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="giving-page">
      <div className="container">
        <section className="giving-header">
          <div className="giving-header-copy">
            <span className="giving-eyebrow">Generosity in action</span>
            <h1 className="fade-up">Give With Purpose</h1>
            <p className="giving-subtitle fade-up">
              Your generosity helps us continue serving God, strengthening our ministries, supporting our community, and creating opportunities for people to grow in faith.
            </p>
            <p className="giving-subtitle fade-up">
              Whether supporting the church's ministry, missions, community outreach, or a specific project, every contribution can help us serve others and extend the impact of the church.
            </p>

            {/* =========================================
                DIGITAL GIVING DROPDOWN
            ========================================= */}
            <div className="digital-giving-wrapper fade-up">
              <label
                htmlFor="digital-giving"
                className="digital-giving-label"
              >
                Give Digitally
              </label>

              <select
                id="digital-giving"
                className="digital-giving-select"
                value={selectedDigitalGiving}
                onChange={handleDigitalGivingChange}
              >
                <option value="">
                  Select how you would like to give
                </option>

                {givingOptions.map((option) => (
                  <option
                    key={option.id}
                    value={option.id}
                  >
                    {option.title}
                  </option>
                ))}
              </select>

              <p className="digital-giving-helper">
                Choose a giving option to continue.
              </p>
            </div>

            {/* =========================================
                DIGITAL GIVING PAYMENT FORM
            ========================================= */}
            {showPaymentForm && (
              <div className="digital-payment-form fade-up">
                <div className="payment-form-header">
                  <h3>Digital Giving</h3>
                  <button
                    type="button"
                    className="close-form-button"
                    onClick={closePaymentForm}
                    aria-label="Close payment form"
                  >
                    ×
                  </button>
                </div>

                {formErrors.general && (
                  <div className="form-general-error">
                    {formErrors.general}
                  </div>
                )}

                <form onSubmit={handlePaymentSubmit}>
                  {/* Selected Giving Type */}
                  <div className="form-group">
                    <label htmlFor="giving-type" className="form-label">
                      Giving
                    </label>
                    <div className="form-value">
                      {givingOptions.find(option => option.id === parseInt(selectedDigitalGiving))?.title || 'Not selected'}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="form-group">
                    <label htmlFor="payment-amount" className="form-label">
                      Amount (KSh)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="payment-amount"
                      className={`form-input ${formErrors.amount ? 'error' : ''}`}
                      value={paymentAmount}
                      onChange={(e) => {
                        // Only allow numbers and decimal point
                        const value = e.target.value.replace(/[^0-9.]/g, '')
                        setPaymentAmount(value)
                      }}
                      placeholder=""
                      disabled={isSubmitting}
                    />
                    {formErrors.amount && (
                      <span className="form-error">{formErrors.amount}</span>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="form-group">
                    <label htmlFor="payment-phone" className="form-label">
                      M-PESA Phone Number
                    </label>
                    <input
                      type="tel"
                      id="payment-phone"
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      placeholder="07XXXXXXXX"
                      disabled={isSubmitting}
                    />
                    {formErrors.phone && (
                      <span className="form-error">{formErrors.phone}</span>
                    )}
                    <span className="form-hint">
                      Enter your M-PESA number (e.g., 07XXXXXXXX or 2547XXXXXXXX)
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="payment-submit-button"
                    disabled={isSubmitting || !paymentAmount}
                  >
                    {isSubmitting ? 'Processing...' : paymentAmount ? `Give KSh ${paymentAmount}` : 'Give'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>

        <section className="giving-intro">
          <img src="/giving.png" alt="Cornerstone Family Chapel giving information" className="giving-banner-image" />
        </section>

        <section className="giving-filters">
          <h3>Filter by Category</h3>
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <section className="giving-options">
          {filteredOptions.length === 0 ? (
            <div className="empty-state">
              <p>No giving options found for this category.</p>
            </div>
          ) : (
            <div className="giving-grid">
              {filteredOptions.map((option) => (
                <div key={option.id} className="ministry-feature-frame fade-up">
                  {option.poster ? (
                    <img 
                      src={option.poster} 
                      alt={option.title} 
                      className="ministry-feature-image"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('Failed to load image:', option.poster)
                        e.target.src = '/chapel.jpg'
                      }}
                    />
                  ) : (
                    <img 
                      src="/chapel.jpg" 
                      alt={option.title} 
                      className="ministry-feature-image"
                      loading="lazy"
                      decoding="async"
                    />
                  )}
                  <div className="giving-category-badge">{option.category}</div>
                  <div className="ministry-feature-content">
                    <h3 className="ministry-feature-title">{option.title}</h3>
                    <p className="giving-description">{option.description}</p>
                    
                    <div className="giving-payment">
                      <h4>How to Give</h4>
                      <div className="payment-method">
                        <strong>Payment Method:</strong>
                        <span>{option.payment_method}</span>
                      </div>
                      <div className="payment-details">
                        <strong>Payment Details:</strong>
                        <pre>{option.payment_details}</pre>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ministry-feature-button"
                      onClick={() => {
                        const details = document.getElementById(`giving-details-${option.id}`)
                        details?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                      }}
                    >
                      How to give
                    </button>
                    <div id={`giving-details-${option.id}`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="giving-security">
          <h2 className="fade-up">Secure & Trusted Giving</h2>
          <div className="security-features">
            <div className="glass-card fade-up">
              <div className="security-icon" aria-hidden="true">S</div>
              <h3>Secure Transactions</h3>
              <p>All payments are processed through secure, encrypted channels</p>
            </div>
            <div className="glass-card fade-up">
              <div className="security-icon" aria-hidden="true">R</div>
              <h3>Transparent Records</h3>
              <p>Regular financial reports are available to church members</p>
            </div>
            <div className="glass-card fade-up">
              <div className="security-icon" aria-hidden="true">A</div>
              <h3>Accountability</h3>
              <p>Financial oversight by the church leadership and board</p>
            </div>
          </div>
        </section>

        <section className="giving-contact">
          <div className="giving-contact-content">
            <h2>Questions About Giving?</h2>
            <p>
              If you have questions about giving, payment methods, or how your contributions are used,
              please contact our church office.
            </p>
            <div className="contact-info">
              <p><Link to="/contact">Contact the church office</Link></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Giving
