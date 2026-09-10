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

  useEffect(() => {
    loadGivingOptions()
  }, [])

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
                  <img src={option.poster || '/chapel.jpg'} alt={option.title} className="ministry-feature-image" />
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
