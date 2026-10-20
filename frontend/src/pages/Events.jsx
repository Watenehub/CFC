import { fitStyle } from '../utils/fitStyle'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as eventsApi from '../api/events'
import './Events.css'
import PageHero from '../components/PageHero'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeEvent, setActiveEvent] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      const data = await eventsApi.getEvents()
      setEvents(data)
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="loading-state">Loading events...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="events-page">
        <div className="container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    )
  }

  const upcomingEvents = events.filter(event => new Date(event.date) >= new Date())
  const pastEvents = events.filter(event => new Date(event.date) < new Date())

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const formattedHour = hour % 12 || 12
    return `${formattedHour}:${minutes} ${ampm}`
  }

  return (
    <div className="events-page">
      <PageHero eyebrow="Gather" title="Life Together" subtitle="Church is more than a weekly gathering. It is a community where we learn, fellowship, serve, and grow together." image="/images/cornerstone/page_03/page03_photo014_conference_audience.jpg" />
      <div className="container">
        <section className="events-header">
          <p className="events-subtitle fade-up">
            Throughout the year, Cornerstone Family Chapel participates in Bible conferences, leadership conferences, family-focused programs, membership classes, worship events, and community outreach initiatives.
          </p>
          <p className="events-subtitle fade-up">
            Our events create opportunities to strengthen relationships, gain understanding, and encourage one another in our walk of faith.
          </p>
        </section>

        {[['Upcoming Events', upcomingEvents, 'No upcoming events at this time. Check back soon!'], ['Past Events', pastEvents, '']].map(([title, list, emptyText]) => (
          (list.length > 0 || emptyText) && (
            <section key={title} className="events-section">
              <h2 className="section-title">{title}</h2>
              {list.length === 0 ? (
                <div className="empty-state"><p>{emptyText}</p></div>
              ) : (
                <div className="ev-grid">
                  {list.map((event) => (
                    <article key={event.id} className="ev-card fade-up">
                      <div className="ev-card-media fit-media" style={fitStyle(event.image || '/chapel.jpg')}>
                        <img src={event.image || '/chapel.jpg'} alt={event.title} loading="lazy" decoding="async" onError={(e) => { e.target.src = '/chapel.jpg' }} />
                      </div>
                      <div className="ev-card-body">
                        <h3>{event.title}</h3>
                        <p className="ev-card-date">{formatDate(event.date)}</p>
                        <button type="button" className="ev-btn" onClick={() => setActiveEvent(event)}>View Details</button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        ))}

        {activeEvent && (
          <div className="ev-overlay" onClick={() => setActiveEvent(null)}>
            <div className="ev-modal" role="dialog" aria-modal="true" aria-label={activeEvent.title} onClick={(e) => e.stopPropagation()}>
              <button type="button" className="ev-close" onClick={() => setActiveEvent(null)} aria-label="Close">&times;</button>
              <img className="ev-modal-image" src={activeEvent.image || '/chapel.jpg'} alt={activeEvent.title} onError={(e) => { e.target.src = '/chapel.jpg' }} />
              <div className="ev-modal-body">
                {activeEvent.organizer && <div className="event-organizer">{activeEvent.organizer}</div>}
                <h2>{activeEvent.title}</h2>
                <p><strong>Date:</strong> {formatDate(activeEvent.date)}</p>
                {(activeEvent.start_time || activeEvent.end_time) && (
                  <p><strong>Time:</strong> {formatTime(activeEvent.start_time)} - {formatTime(activeEvent.end_time)}</p>
                )}
                {activeEvent.location && <p><strong>Location:</strong> {activeEvent.location}</p>}
                <p>{activeEvent.description}</p>
                <div className="event-footer">
                  <span className={`registration-status ${new Date(activeEvent.date) < new Date() ? 'past' : activeEvent.registration_status}`}>
                    {new Date(activeEvent.date) < new Date() ? 'Past Event' : activeEvent.registration_status === 'open' ? 'Registration Open' : 'Registration Closed'}
                  </span>
                  <Link to={`/events/${activeEvent.id}`} className="ev-btn">Full Page</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Events
