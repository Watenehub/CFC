import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as eventsApi from '../api/events'
import * as settingsApi from '../api/settings'
import './EventDetail.css'

function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [contactEmail, setContactEmail] = useState('hello@cornerstonechapel.org')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEvent()
    settingsApi.getSettings()
      .then((data) => {
        if (data.email) setContactEmail(data.email)
      })
      .catch(() => {})
  }, [id])

  const loadEvent = async () => {
    try {
      const data = await eventsApi.getEvent(id)
      setEvent(data)
    } catch (err) {
      setError('Failed to load event')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
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

  if (loading) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="loading-state">Loading event...</div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="event-detail-page">
        <div className="container">
          <div className="error-state">{error || 'Event not found'}</div>
        </div>
      </div>
    )
  }

  const eventData = event
  const isPastEvent = new Date(eventData.date) < new Date()

  const addToCalendar = () => {
    const start = `${eventData.date.replaceAll('-', '')}T${eventData.start_time.replace(':', '')}00`
    const end = `${eventData.date.replaceAll('-', '')}T${eventData.end_time.replace(':', '')}00`
    const calendarEvent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Cornerstone Family Chapel//Events//EN',
      'BEGIN:VEVENT',
      `UID:event-${eventData.id}@cornerstonechapel.org`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${eventData.title}`,
      `DESCRIPTION:${eventData.description}`,
      `LOCATION:${eventData.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n')
    const link = document.createElement('a')
    link.href = `data:text/calendar;charset=utf-8,${encodeURIComponent(calendarEvent)}`
    link.download = `${eventData.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
    link.click()
  }

  return (
    <div className="event-detail-page">
      <div className="container">
        <Link to="/events" className="back-link">
          ← Back to Events
        </Link>

        <div className="event-detail-content">
          <div className="event-detail-image">
            <img src={eventData.image || '/CFC_CHURCH_PHOTO.jpg'} alt={eventData.title} />
            {isPastEvent && (
              <div className="event-badge past">Past Event</div>
            )}
          </div>

          <div className="event-detail-info">
            <div className="event-organizer">{eventData.organizer}</div>
            <h1>{eventData.title}</h1>

            <div className="event-detail-meta">
              <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                <div className="meta-text">
                  <strong>Date</strong>
                  <span>{formatDate(eventData.date)}</span>
                </div>
              </div>
              <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                <div className="meta-text">
                  <strong>Time</strong>
                  <span>{formatTime(eventData.start_time)} - {formatTime(eventData.end_time)}</span>
                </div>
              </div>
              <div className="meta-item">
                        <span className="meta-icon image-icon" aria-hidden="true"></span>
                <div className="meta-text">
                  <strong>Location</strong>
                  <span>{eventData.location}</span>
                </div>
              </div>
            </div>

            <div className="event-detail-description">
              <h2>About This Event</h2>
              <p>{eventData.description}</p>
            </div>

            <button type="button" className="btn btn-calendar" onClick={addToCalendar}>
              Add to Calendar
            </button>

            {!isPastEvent && eventData.registration_status === 'open' && (
              <div className="event-registration">
                <h2>Registration</h2>
                <div className="registration-info">
                  <div className="registration-item">
                    <strong>Status:</strong>
                    <span className="status-open">Open</span>
                  </div>
                  {eventData.max_participants && (
                    <div className="registration-item">
                      <strong>Capacity:</strong>
                      <span>{eventData.max_participants} participants</span>
                    </div>
                  )}
                  {eventData.registration_deadline && (
                    <div className="registration-item">
                      <strong>Deadline:</strong>
                      <span>{formatDate(eventData.registration_deadline)}</span>
                    </div>
                  )}
                </div>
                <Link to="/contact" className="btn btn-primary btn-large">
                  Contact to register
                </Link>
                <p className="registration-note">
                  Reach out to the church office to reserve your place for this event.
                </p>
              </div>
            )}

            {isPastEvent && (
              <div className="event-past-notice">
                <h2>This Event Has Passed</h2>
                <p>Thank you to everyone who attended! Check our events page for upcoming activities.</p>
              </div>
            )}

            <div className="event-contact">
              <h2>Need More Information?</h2>
              <p>
                For questions about this event, please contact us at{' '}
                <a href={`mailto:${contactEmail}`} className="contact-link">
                  {contactEmail}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail
