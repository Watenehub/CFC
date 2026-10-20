import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as givingApi from '../api/giving'
import * as megapayApi from '../api/megapay'
import './Giving.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Giving() {
  const [givingOptions, setGivingOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeOption, setActiveOption] = useState(null)
  const [showPay, setShowPay] = useState(false)
  const [payPhone, setPayPhone] = useState('')
  const [payAmount, setPayAmount] = useState('')
  const [paying, setPaying] = useState(false)
  const [payMessage, setPayMessage] = useState('')

  useEffect(() => {
    setShowPay(false)
    setPayMessage('')
  }, [activeOption])

  const handlePay = async (event) => {
    event.preventDefault()
    setPaying(true)
    setPayMessage('')
    try {
      const result = await megapayApi.initiateMegapayPayment({
        phone: payPhone,
        amount: payAmount,
        reference: activeOption?.title || 'Church giving',
      })
      setPayMessage(result.message || 'Check your phone to complete the payment.')
    } catch (err) {
      setPayMessage(err.message || 'Payment could not be started. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  useEffect(() => {
    if (!activeOption) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setActiveOption(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeOption])

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
      <header className="gv-head">
        <h1>Give to Our Ministry</h1>
        <p>Your generosity helps us serve our community and continue the work of the ministry.</p>
      </header>

      <section className="gv-banner" aria-label="Lipa na M-PESA paybill">
        <div className="gv-banner-img">
          <img src="/chapel.jpg" alt="Cornerstone Family Chapel building" decoding="async" fetchpriority="high" />
        </div>
        <div className="gv-banner-pay">
          <div className="gv-mpesa">LIPA NA M-PESA</div>
          <div className="gv-label"><span />PAYBILL NUMBER<span /></div>
          <div className="gv-boxes">
            {'400222'.split('').map((digit, index) => (
              <div key={index}>{digit}</div>
            ))}
          </div>
          <div className="gv-label"><span />ACCOUNT NUMBER<span /></div>
          <p className="gv-note">Use the appropriate giving category as your account reference when making your contribution.</p>
        </div>
      </section>

      <div className="container">
        <section className="giving-filters">
          <h2 className="gv-cat-title">Choose What You Would Like to Give Towards</h2>
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
            <div className="gv-grid">
              {filteredOptions.map((option) => (
                <article key={option.id} className="gv-card fade-up">
                  <div className="gv-card-media">
                    <img
                      src={option.poster || '/chapel.jpg'}
                      alt={option.title}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.target.src = '/chapel.jpg' }}
                    />
                    {option.category && <span className="gv-badge">{option.category}</span>}
                  </div>
                  <div className="gv-card-body">
                    <h3>{option.title}</h3>
                    <p>{option.description}</p>
                    <button type="button" className="gv-btn" onClick={() => setActiveOption(option)}>
                      How to give
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {activeOption && (
          <div className="gv-overlay" onClick={() => setActiveOption(null)}>
            <div
              className="gv-modal"
              role="dialog"
              aria-modal="true"
              aria-label={`How to give: ${activeOption.title}`}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className="gv-close" onClick={() => setActiveOption(null)} aria-label="Close">&times;</button>
              <div className="gv-intro">
                <span className="giving-eyebrow">Generosity in action</span>
                <h2>Give With Purpose</h2>
                <p>Your generosity helps us continue serving God, strengthening our ministries, supporting our community, and creating opportunities for people to grow in faith.</p>
                <p>Whether supporting the church's ministry, missions, community outreach, or a specific project, every contribution can help us serve others and extend the impact of the church.</p>
                                {!showPay ? (
                                  <button type="button" className="gv-btn gv-paybtn" onClick={() => setShowPay(true)}>Pay Digitally</button>
                                ) : (
                                  <form className="gv-payform" onSubmit={handlePay}>
                                    <input type="tel" placeholder="M-PESA number (07XXXXXXXX)" value={payPhone} onChange={(e) => setPayPhone(e.target.value)} required />
                                    <input type="number" min="1" placeholder="Amount (KSh)" value={payAmount} onChange={(e) => setPayAmount(e.target.value)} required />
                                    <button type="submit" className="gv-btn gv-paybtn" disabled={paying}>{paying ? 'Sending...' : 'Send M-PESA Prompt'}</button>
                                    {payMessage && <p className="gv-paymsg">{payMessage}</p>}
                                  </form>
                                )}
                              </div>
              <div className="gv-side">
              <img
                className="gv-modal-image"
                src={activeOption.poster || '/chapel.jpg'}
                alt={activeOption.title}
                onError={(e) => { e.target.src = '/chapel.jpg' }}
              />
              <div className="gv-detail">
                {activeOption.category && <span className="gv-tag">{activeOption.category}</span>}
                <h3>{activeOption.title}</h3>
                <p>{activeOption.description}</p>
                <div className="gv-pay">
                  <h4>How to Give</h4>
                  <p><strong>Payment Method:</strong> {activeOption.payment_method}</p>
                  <strong>Payment Details:</strong>
                  <pre>{activeOption.payment_details}</pre>
                </div>
              </div>
              </div>
            </div>
          </div>
        )}

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
