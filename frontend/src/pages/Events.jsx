import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as eventsApi from '../api/events'
import './Events.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
      <div className="container">
        <section className="events-header">
          <h1 className="fade-up">Life Together</h1>
          <p className="events-subtitle fade-up">
            Church is more than a weekly gathering. It is a community where we learn, fellowship, serve, and grow together.
          </p>
          <p className="events-subtitle fade-up">
            Throughout the year, Cornerstone Family Chapel participates in Bible conferences, leadership conferences, family-focused programs, membership classes, worship events, and community outreach initiatives.
          </p>
          <p className="events-subtitle fade-up">
            Our events create opportunities to strengthen relationships, gain understanding, and encourage one another in our walk of faith.
          </p>
        </section>

        <section className="events-section">
          <h2 className="section-title">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="empty-state">
              <p>No upcoming events at this time. Check back soon!</p>
            </div>
          ) : (
            <div className="events-grid">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="conference-showcase-frame fade-up">
                  <div className="conference-label">Upcoming</div>
                  <img src={event.image || '/chapel.jpg'} alt={event.title} className="conference-image" />
                  <div className="conference-content">
                    <div className="event-organizer">{event.organizer}</div>
                    <h3 className="conference-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="conference-description">{event.description}</p>
                    <div className="event-footer">
                      <span className={`registration-status ${event.registration_status}`}>
                        {event.registration_status === 'open' ? 'Registration Open' : 'Registration Closed'}
                      </span>
                      <Link to={`/events/${event.id}`} className="btn-premium btn-premium-primary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {pastEvents.length > 0 && (
          <section className="events-section">
            <h2 className="section-title">Past Events</h2>
            <div className="events-grid">
              {pastEvents.map((event) => (
                <div key={event.id} className="event-card event-card-past">
                  <div className="event-image">
                    <img src={event.image || '/chapel.jpg'} alt={event.title} />
                    <div className="event-date-badge past">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className="event-content">
                    <div className="event-organizer">{event.organizer}</div>
                    <h3>{event.title}</h3>
                    <div className="event-meta">
                      <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="event-description">{event.description}</p>
                    <div className="event-footer">
                      <span className="registration-status past">Past Event</span>
                      <Link to={`/events/${event.id}`} className="btn-premium btn-premium-outline">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Events
