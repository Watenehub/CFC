import { useState, useEffect } from 'react'
import * as givingApi from '../api/giving'
import './Giving.css'

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

  const givingList = givingOptions.length > 0 ? givingOptions : [
    {
      id: 1,
      title: 'Missions Support',
      description: 'Support our global missions partners as they spread the gospel around the world. Your contribution helps fund missionaries, church planting, and humanitarian efforts in underserved communities.',
      category: 'Missions',
      payment_method: 'M-Pesa / Bank Transfer',
      payment_details: 'M-Pesa: Paybill 123456, Account: MISS\nBank: Equity Bank, Account: 0987654321',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 2,
      title: 'General Offering',
      description: 'Your general offering supports the day-to-day operations of the church, including facility maintenance, staff support, and ministry programs.',
      category: 'Offering',
      payment_method: 'M-Pesa / Cash / Bank Transfer',
      payment_details: 'M-Pesa: Paybill 123456, Account: OFFER\nBank: Equity Bank, Account: 0987654321',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 3,
      title: 'Tithe',
      description: 'Bring your tithes to the storehouse. The tithe is 10% of your income and supports the work of the ministry.',
      category: 'Tithe',
      payment_method: 'M-Pesa / Cash / Bank Transfer',
      payment_details: 'M-Pesa: Paybill 123456, Account: TITHE\nBank: Equity Bank, Account: 0987654321',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 4,
      title: 'Building Fund',
      description: 'Help us expand our facilities to better serve our growing congregation. Contributions go toward building renovations, new construction, and facility improvements.',
      category: 'Building Fund',
      payment_method: 'M-Pesa / Bank Transfer',
      payment_details: 'M-Pesa: Paybill 123456, Account: BUILD\nBank: Equity Bank, Account: 0987654321',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 5,
      title: 'Benevolent Fund',
      description: 'Support families in need within our church and community. This fund provides emergency assistance for food, rent, medical bills, and other critical needs.',
      category: 'Donations',
      payment_method: 'M-Pesa / Cash',
      payment_details: 'M-Pesa: Paybill 123456, Account: BENE\nIn-person: Church Office',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 6,
      title: 'Youth Camp Scholarship',
      description: 'Sponsor a young person to attend youth camp. Your donation helps cover camp fees for youth who cannot afford to attend.',
      category: 'Missions',
      payment_method: 'M-Pesa / Bank Transfer',
      payment_details: 'M-Pesa: Paybill 123456, Account: YOUTH\nBank: Equity Bank, Account: 0987654321',
      poster: '/CFC_CHURCH_PHOTO.jpg'
    }
  ]

  const displayOptions = givingOptions.length > 0 ? filteredOptions : givingList.filter(option => 
    selectedCategory === '' || option.category === selectedCategory
  )

  return (
    <div className="giving-page">
      <div className="container">
        <section className="giving-header">
          <h1>Give with a Grateful Heart</h1>
          <p className="giving-subtitle">
            Your generosity supports the work of the ministry and helps us serve our community
          </p>
        </section>

        <section className="giving-intro">
          <div className="giving-intro-content">
            <h2>Why We Give</h2>
            <p>
              Giving is an act of worship and trust in God's provision. When we give, we acknowledge that 
              everything we have comes from Him, and we participate in His work in the world. Your 
              contributions support our church's mission to make disciples, serve our community, and 
              spread the gospel.
            </p>
            <div className="giving-principles">
              <div className="principle-item">
                <div className="principle-icon">🙏</div>
                <h3>Worship</h3>
                <p>Giving is an act of worship and gratitude to God</p>
              </div>
              <div className="principle-item">
                <div className="principle-icon">🤝</div>
                <h3>Generosity</h3>
                <p>God calls us to be generous with what He has given us</p>
              </div>
              <div className="principle-item">
                <div className="principle-icon">🌱</div>
                <h3>Growth</h3>
                <p>Your giving helps the church grow and impact more lives</p>
              </div>
            </div>
          </div>
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
                <div key={option.id} className="giving-card">
                  <div className="giving-poster">
                    <img src={option.poster || '/chapel.jpg'} alt={option.title} />
                    <div className="giving-category-badge">{option.category}</div>
                  </div>
                  <div className="giving-content">
                    <h3>{option.title}</h3>
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

                    <button className="btn btn-primary btn-full">
                      Give Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="giving-security">
          <h2>Secure & Trusted Giving</h2>
          <div className="security-features">
            <div className="security-item">
              <div className="security-icon">🔒</div>
              <h3>Secure Transactions</h3>
              <p>All payments are processed through secure, encrypted channels</p>
            </div>
            <div className="security-item">
              <div className="security-icon">📋</div>
              <h3>Transparent Records</h3>
              <p>Regular financial reports are available to church members</p>
            </div>
            <div className="security-item">
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
              <p><strong>Email:</strong> finance@cornerstonechapel.org</p>
              <p><strong>Phone:</strong> +254 700 000 000</p>
              <p><strong>In-Person:</strong> Church Office during business hours</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Giving
