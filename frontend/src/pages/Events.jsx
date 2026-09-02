import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as eventsApi from '../api/events'
import { readSiteContent } from '../data/siteContent'
import './Events.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadEvents()

    const handleContentUpdate = () => loadEvents()
    window.addEventListener('cornerstone-content-updated', handleContentUpdate)

    return () => window.removeEventListener('cornerstone-content-updated', handleContentUpdate)
  }, [])

  const loadEvents = async () => {
    try {
      const localContent = readSiteContent()
      if (localContent.events?.length) {
        setEvents(localContent.events)
        return
      }

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

  const eventsList = events.length > 0 ? events : [
    {
      id: 1,
      title: 'Youth Revival Night',
      description: 'An evening of worship, teaching, and fellowship for the youth. Join us for an inspiring night of music and message.',
      date: '2026-09-05',
      start_time: '18:00',
      end_time: '21:00',
      location: 'Main Sanctuary',
      image: '/images/cornerstone/page_07/page07_photo033_worship_night.jpg',
      organizer: 'Youth Ministry',
      registration_status: 'open',
      max_participants: 100,
      registration_deadline: '2026-09-04'
    },
    {
      id: 2,
      title: 'Men\'s Breakfast',
      description: 'Monthly gathering for men to connect over breakfast and discuss faith, life, and leadership.',
      date: '2026-09-12',
      start_time: '08:00',
      end_time: '10:00',
      location: 'Church Hall',
      image: '/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg',
      organizer: 'Men\'s Ministry',
      registration_status: 'open',
      max_participants: 50,
      registration_deadline: '2026-09-11'
    },
    {
      id: 3,
      title: 'Bible Study Launch',
      description: 'Kick off our new Bible study series focusing on the book of Romans. All are welcome to join.',
      date: '2026-09-15',
      start_time: '19:00',
      end_time: '20:30',
      location: 'Classroom A',
      image: '/images/cornerstone/page_05/page05_photo022_membership_class_group.jpg',
      organizer: 'Adult Ministry',
      registration_status: 'open',
      max_participants: 30,
      registration_deadline: '2026-09-14'
    },
    {
      id: 4,
      title: 'Women\'s Retreat',
      description: 'A weekend retreat for women to rest, recharge, and grow in faith together.',
      date: '2026-09-23',
      start_time: '09:00',
      end_time: '17:00',
      location: 'Retreat Center',
      image: '/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg',
      organizer: 'Women\'s Ministry',
      registration_status: 'open',
      max_participants: 40,
      registration_deadline: '2026-09-20'
    },
    {
      id: 5,
      title: 'Community Outreach Day',
      description: 'Join us as we serve our local community through various outreach activities.',
      date: '2026-10-01',
      start_time: '10:00',
      end_time: '14:00',
      location: 'Various Locations',
      image: '/images/cornerstone/page_10/page10_photo064_community_outreach_group.jpg',
      organizer: 'Outreach Ministry',
      registration_status: 'open',
      max_participants: null,
      registration_deadline: null
    },
    {
      id: 6,
      title: 'Worship Night',
      description: 'An evening of extended worship and prayer. Come and experience God\'s presence.',
      date: '2026-10-08',
      start_time: '19:00',
      end_time: '21:00',
      location: 'Main Sanctuary',
      image: '/images/cornerstone/page_07/page07_photo033_worship_night.jpg',
      organizer: 'Worship Ministry',
      registration_status: 'open',
      max_participants: 200,
      registration_deadline: '2026-10-07'
    }
  ]

  const upcomingEvents = eventsList.filter(event => new Date(event.date) >= new Date())
  const pastEvents = eventsList.filter(event => new Date(event.date) < new Date())

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
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
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
