import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as ministriesApi from '../api/ministries'
import PageHero from '../components/PageHero'
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
        <PageHero eyebrow="Serve" title="Our Ministries" subtitle="Find your place to serve and grow" />
        <div className="page-body">
          <div className="container">
            <div className="loading-state">Loading ministries...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ministries-page">
        <PageHero eyebrow="Serve" title="Our Ministries" subtitle="Find your place to serve and grow" />
        <div className="page-body">
          <div className="container">
            <div className="error-state">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="ministries-page">
      <PageHero
        eyebrow="Serve"
        title="Our Ministries"
        subtitle="Find your place to serve and grow"
      />
      <div className="page-body">
        <div className="container">
          {ministries.length === 0 ? (
            <div className="empty-state"><p>No ministries listed yet. Check back soon.</p></div>
          ) : (
            <div className="ministries-grid">
              {ministries.map((ministry) => (
                <div key={ministry.id} className="ministry-feature-frame fade-up">
                  <img src={ministry.image || '/chapel.jpg'} alt={ministry.name} className="ministry-feature-image" />
                  <div className="ministry-feature-content">
                    <h3 className="ministry-feature-title">{ministry.name}</h3>
                    <p className="ministry-feature-description">{ministry.description}</p>
                    {ministry.encouragement && <p className="leader-encouragement">{ministry.encouragement}</p>}
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
                    <Link to="/contact" className="btn btn-primary">Get involved</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Ministries
