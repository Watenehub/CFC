import { useState, useEffect } from 'react'
import * as givingApi from '../api/giving'
import { readSiteContent } from '../data/siteContent'
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

    const handleContentUpdate = () => loadGivingOptions()
    window.addEventListener('cornerstone-content-updated', handleContentUpdate)

    return () => window.removeEventListener('cornerstone-content-updated', handleContentUpdate)
  }, [])

  const loadGivingOptions = async () => {
    try {
      const localContent = readSiteContent()
      if (localContent.giving?.length) {
        setGivingOptions(localContent.giving)
        return
      }

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

  const givingList = givingOptions.length > 0 ? givingOptions : [
    {
      id: 1,
      title: 'Missions Support',
      description: 'Support our global missions partners as they spread the gospel around the world. Your contribution helps fund missionaries, church planting, and humanitarian efforts in underserved communities.',
      category: 'Missions',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    },
    {
      id: 2,
      title: 'General Offering',
      description: 'Your general offering supports the day-to-day operations of the church, including facility maintenance, staff support, and ministry programs.',
      category: 'Offering',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    },
    {
      id: 3,
      title: 'Tithe',
      description: 'Bring your tithes to the storehouse. The tithe is 10% of your income and supports the work of the ministry.',
      category: 'Tithe',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    },
    {
      id: 4,
      title: 'Building Fund',
      description: 'Help us expand our facilities to better serve our growing congregation. Contributions go toward building renovations, new construction, and facility improvements.',
      category: 'Building Fund',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    },
    {
      id: 5,
      title: 'Benevolent Fund',
      description: 'Support families in need within our church and community. This fund provides emergency assistance for food, rent, medical bills, and other critical needs.',
      category: 'Donations',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    },
    {
      id: 6,
      title: 'Youth Camp Scholarship',
      description: 'Sponsor a young person to attend youth camp. Your donation helps cover camp fees for youth who cannot afford to attend.',
      category: 'Missions',
      payment_method: '<em>To be updated</em>',
      payment_details: '<em>To be updated</em>',
      poster: '/chapel.jpg'
    }
  ]

  const displayOptions = givingOptions.length > 0 ? filteredOptions : givingList.filter(option => 
    selectedCategory === '' || option.category === selectedCategory
  )

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
          {displayOptions.length === 0 ? (
            <div className="empty-state">
              <p>No giving options found for this category.</p>
            </div>
          ) : (
            <div className="giving-grid">
              {displayOptions.map((option) => (
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

                    <button className="ministry-feature-button">
                      Give Now
                    </button>
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
              <div className="security-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>All payments are processed through secure, encrypted channels</p>
            </div>
            <div className="glass-card fade-up">
              <div className="security-icon">📋</div>
              <h3>Transparent Records</h3>
              <p>Regular financial reports are available to church members</p>
            </div>
            <div className="glass-card fade-up">
              <div className="security-icon">✅</div>
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
              <p><em>Contact information to be updated</em></p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Giving
