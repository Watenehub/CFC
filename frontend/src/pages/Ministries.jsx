import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as ministriesApi from '../api/ministries'
import './Ministries.css'

function Ministries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadMinistries()
  }, [])

  const loadMinistries = async () => {
    try {
      const data = await ministriesApi.getMinistries()
      setMinistries(data)
    } catch (err) {
      setError('Failed to load ministries')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="ministries-page">
        <div className="container">
          <div className="loading-state">Loading ministries...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ministries-page">
        <div className="container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    )
  }

  const ministriesList = ministries.length > 0 ? ministries : [
    {
      id: 1,
      name: 'Youth Ministry',
      description: 'Empowering the next generation to grow in faith and serve with purpose.',
      leader: 'Pastor Michael Johnson',
      meeting_time: 'Fridays 6:00 PM',
      location: 'Youth Center',
      contact: 'youth@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 2,
      name: 'Children\'s Ministry',
      description: 'Nurturing young hearts in the love of Christ through engaging lessons and activities.',
      leader: 'Sarah Williams',
      meeting_time: 'Sundays 10:30 AM',
      location: 'Children\'s Wing',
      contact: 'children@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 3,
      name: 'Men\'s Ministry',
      description: 'Building strong men of faith through fellowship, study, and service.',
      leader: 'James Brown',
      meeting_time: 'Saturdays 8:00 AM',
      location: 'Church Hall',
      contact: 'men@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 4,
      name: 'Women\'s Ministry',
      description: 'Empowering women to grow in faith and support one another in community.',
      leader: 'Mary Davis',
      meeting_time: 'Tuesdays 6:00 PM',
      location: 'Fellowship Hall',
      contact: 'women@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 5,
      name: 'Worship Ministry',
      description: 'Leading the congregation in authentic praise and worship.',
      leader: 'David Wilson',
      meeting_time: 'Wednesdays 7:00 PM',
      location: 'Sanctuary',
      contact: 'worship@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 6,
      name: 'Media Ministry',
      description: 'Spreading the gospel through digital platforms and media production.',
      leader: 'Peter Kimani',
      meeting_time: 'Sundays 8:00 AM',
      location: 'Media Room',
      contact: 'media@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 7,
      name: 'Ushering & Hospitality',
      description: 'Creating a welcoming environment for all who visit our church.',
      leader: 'Grace Njoroge',
      meeting_time: 'Sundays 8:30 AM',
      location: 'Main Entrance',
      contact: 'hospitality@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 8,
      name: 'Security Ministry',
      description: 'Ensuring the safety and security of our congregation and facilities.',
      leader: 'Robert Ochieng',
      meeting_time: 'Sundays 8:00 AM',
      location: 'Security Office',
      contact: 'security@cornerstonechapel.org',
      image: '/CFC_CHURCH_PHOTO.jpg'
    },
    {
      id: 9,
      name: 'Outreach Ministry',
      description: 'Serving our local community and spreading the love of Christ.',
      leader: 'Esther Wanjiku',
      meeting_time: 'Saturdays 10:00 AM',
      location: 'Community Center',
      contact: 'outreach@cornerstonechapel.org',
      image: '/chapel.jpg'
    }
  ]

  return (
    <div className="ministries-page">
      <div className="container">
        <section className="ministries-header">
          <h1>Our Ministries</h1>
          <p className="ministries-subtitle">
            Find your place to serve and grow in faith
          </p>
        </section>

        <div className="ministries-grid">
          {ministriesList.map((ministry) => (
            <div key={ministry.id} className="ministry-card">
              <div className="ministry-image">
                <img src={ministry.image || '/CFC_CHURCH_PHOTO.jpg'} alt={ministry.name} />
              </div>
              <div className="ministry-content">
                <h3>{ministry.name}</h3>
                <p className="ministry-description">{ministry.description}</p>
                <div className="ministry-details">
                  <div className="ministry-detail">
                    <span className="detail-label">Leader:</span>
                    <span className="detail-value">{ministry.leader}</span>
                  </div>
                  <div className="ministry-detail">
                    <span className="detail-label">Meeting Time:</span>
                    <span className="detail-value">{ministry.meeting_time}</span>
                  </div>
                  <div className="ministry-detail">
                    <span className="detail-label">Location:</span>
                    <span className="detail-value">{ministry.location}</span>
                  </div>
                  <div className="ministry-detail">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{ministry.contact}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Ministries
