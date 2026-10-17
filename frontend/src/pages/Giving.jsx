import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as givingApi from '../api/giving'
import './Giving.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Giving() {
  const [givingOptions, setGivingOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [activeOption, setActiveOption] = useState(null)

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
      <section className="gv-hero">
        <img src="/giving.webp" alt="Lipa na M-PESA paybill number 400222" width="1200" decoding="async" fetchpriority="high" />
      </section>

      <div className="container">
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
