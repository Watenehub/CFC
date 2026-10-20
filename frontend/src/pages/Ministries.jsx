import { fitStyle } from '../utils/fitStyle'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as ministriesApi from '../api/ministries'
import PageHero from '../components/PageHero'
import './Ministries.css'

function Ministries() {
  const [ministries, setMinistries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => {
    loadMinistries()
  }, [])

  useEffect(() => {
    if (!active) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setActive(null) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false)
        setError('Loading took too long. Please refresh the page.')
      }
    }, 15000) // 15 second timeout

    return () => clearTimeout(timeout)
  }, [loading])

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
                <div key={ministry.id} className="ministry-feature-frame ministry-card fade-up">
                  <div className="fit-media fit-media--card" style={fitStyle(ministry.image || '/chapel.jpg')}>
                    <img
                      src={ministry.image || '/chapel.jpg'}
                      alt={ministry.name}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="ministry-feature-content">
                    <h3 className="ministry-feature-title">{ministry.name}</h3>
                    <p className="ministry-card-time">{ministry.meeting_time || 'No meeting time scheduled'}</p>
                    <button type="button" className="btn btn-primary" onClick={() => setActive(ministry)}>Learn more</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {active && (
            <div className="min-overlay" onClick={() => setActive(null)}>
              <div className="min-modal" role="dialog" aria-modal="true" aria-label={active.name} onClick={(e) => e.stopPropagation()}>
                <button type="button" className="min-close" onClick={() => setActive(null)} aria-label="Close">&times;</button>
                <img className="min-modal-image" src={active.image || '/chapel.jpg'} alt={active.name} onError={(e) => { e.target.src = '/chapel.jpg' }} />
                <div className="min-modal-body">
                  <h2>{active.name}</h2>
                  {active.description && <p>{active.description}</p>}
                  {active.encouragement && <p className="leader-encouragement">{active.encouragement}</p>}
                  <dl className="min-details">
                    {active.leader && <div><dt>Leader</dt><dd>{active.leader}</dd></div>}
                    {active.meeting_time && <div><dt>Meeting time</dt><dd>{active.meeting_time}</dd></div>}
                    {active.location && <div><dt>Location</dt><dd>{active.location}</dd></div>}
                    {active.contact && <div><dt>Contact</dt><dd>{active.contact}</dd></div>}
                  </dl>
                  <Link to="/contact" className="btn btn-primary" onClick={() => setActive(null)}>Get involved</Link>
                </div>
              </div>
            </div>
          )}        </div>
      </div>
    </div>
  )
}

export default Ministries
