import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { initScrollAnimations, cleanupScrollAnimations } from '../utils/scrollAnimations'
import * as sermonsApi from '../api/sermons'
import * as eventsApi from '../api/events'
import * as ministriesApi from '../api/ministries'
import * as notificationsApi from '../api/notifications'
import './Home.css'

const experiences = [
  {
    title: 'Sunday Worship',
    description: 'Gather with us for singing, teaching from Scripture, and fellowship after the service.',
    link: '/about',
    linkText: 'Plan a visit',
    image: '/images/cornerstone/page_01/page01_photo002_worship_service_participants.jpg',
  },
  {
    title: 'Watch Online',
    description: 'If you cannot be with us in the chapel, our media team streams the service so you can still take part.',
    link: '/watch-live',
    linkText: 'Join the stream',
    image: '/images/cornerstone/page_08/page08_photo042_media_control_room.jpg',
  },
  {
    title: 'Ministries',
    description: 'From children and worship to outreach and media, there is a team where you can serve.',
    link: '/ministries',
    linkText: 'See ministries',
    image: '/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg',
  },
  {
    title: 'Community Outreach',
    description: 'We express our faith through practical care — medical camps, service projects, and neighbourly help.',
    link: '/ministries',
    linkText: 'How we serve',
    image: '/images/cornerstone/page_10/page10_photo064_community_outreach_group.jpg',
  },
]

const connectCards = [
  { title: 'Prayer', subtitle: 'Share a request with our church family', link: '/prayer', image: '/images/cornerstone/page_03/page03_photo010_pastors_leaders_conference_prayer.jpg' },
  { title: 'Events', subtitle: 'Conferences, classes, and gatherings', link: '/events', image: '/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg' },
  { title: 'Giving', subtitle: 'Support ministry, missions, and outreach', link: '/give', image: '/images/cornerstone/page_09/page09_photo047_medical_camp_health_outreach.jpg' },
  { title: 'Gallery', subtitle: 'Photos from life at Cornerstone', link: '/gallery', image: '/images/cornerstone/page_07/page07_photo032_music_extravaganza.jpg' },
]

const getInvolved = [
  { title: 'Serve on a team', description: 'Worship, media, hospitality, children, and outreach all need willing hands.', link: '/ministries' },
  { title: 'Ask for prayer', description: 'Tell us how we can stand with you. You do not have to carry it alone.', link: '/prayer' },
  { title: 'Give', description: 'Your gifts help us teach the Word, care for people, and keep the work of the church going.', link: '/give' },
]

function formatEventDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTimeRange(start, end) {
  if (!start) return ''
  return end ? `${start} – ${end}` : start
}

function Home() {
  const [latestSermon, setLatestSermon] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [ministries, setMinistries] = useState([])
  const [announcements, setAnnouncements] = useState([])

  useEffect(() => {
    const observer = initScrollAnimations()
    return () => cleanupScrollAnimations(observer)
  }, [])

  useEffect(() => {
    Promise.allSettled([
      sermonsApi.getSermons(),
      eventsApi.getEvents(),
      ministriesApi.getMinistries(),
      notificationsApi.getNotifications(true),
    ]).then(([sermonsRes, eventsRes, ministriesRes, notesRes]) => {
      if (sermonsRes.status === 'fulfilled' && sermonsRes.value?.length) {
        const sorted = [...sermonsRes.value].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
        setLatestSermon(sorted[0])
      }
      if (eventsRes.status === 'fulfilled') {
        const now = new Date()
        const upcoming = eventsRes.value
          .filter((event) => !event.date || new Date(event.date) >= now)
          .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
          .slice(0, 3)
        setUpcomingEvents(upcoming)
      }
      if (ministriesRes.status === 'fulfilled') {
        setMinistries(ministriesRes.value.slice(0, 4))
      }
      if (notesRes.status === 'fulfilled') {
        setAnnouncements(notesRes.value.slice(0, 3))
      }
    })
  }, [])

  return (
    <div className="home">
      {announcements.length > 0 && (
        <div className="home-announcement-bar">
          <div className="container home-announcement-stack">
            {announcements.map((note) => (
              <div key={note.id || note.title} className="home-announcement-inner">
                <span className="home-announcement-label">Announcement</span>
                <div className="home-announcement-copy">
                  <strong>{note.title}</strong>
                  <span>{note.message}</span>
                </div>
                {note.link && (
                  <Link to={note.link} className="home-announcement-link">Learn more</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <section className="hero">
        <div className="hero-bg">
          <img
            src="/hero-image.jpg"
            alt="Congregation gathered at Cornerstone Family Chapel"
            className="hero-bg-image"
            loading="eager"
            decoding="async"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <p className="hero-brand fade-up">Cornerstone Family Chapel</p>
          <h1 className="hero-title fade-up">A family of faith, rooted in Christ</h1>
          <p className="hero-subtitle fade-up">
            Join us for worship, teaching from Scripture, and a community that grows together in love.
          </p>
          <div className="hero-actions fade-up">
            <Link to="/about" className="btn btn-hero-solid">Plan a Visit</Link>
            <Link to="/watch-live" className="btn btn-outline-white">Watch Live</Link>
          </div>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <section className="section experiences">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">This week</span>
            <h2 className="section-heading">Ways to be part of Cornerstone</h2>
            <p className="section-subheading">
              Come in person, join us online, serve on a team, or walk with us as we serve our neighbours.
            </p>
          </div>
          <div className="experience-grid">
            {experiences.map((item) => (
              <Link key={item.title} to={item.link} className="experience-card fade-up">
                <div className="experience-card-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="experience-card-body">
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className="experience-card-link">{item.linkText} →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {latestSermon && (
        <section className="section sermon-feature">
          <div className="container">
            <div className="sermon-feature-grid fade-up">
              <div className="sermon-feature-media">
                <img
                  src={latestSermon.thumbnail || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'}
                  alt={latestSermon.title}
                />
              </div>
              <div className="sermon-feature-content">
                <span className="section-eyebrow">From the pulpit</span>
                <h2 className="section-heading">{latestSermon.title}</h2>
                <p className="sermon-meta">
                  {[latestSermon.speaker, latestSermon.date && new Date(latestSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), latestSermon.scripture].filter(Boolean).join(' · ')}
                </p>
                <p className="sermon-description">{latestSermon.description}</p>
                <div className="sermon-actions">
                  <Link to={`/sermons/${latestSermon.id}`} className="btn btn-dark">Watch this message</Link>
                  <Link to="/sermons" className="sermon-link-secondary">All sermons →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section connect">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">Stay connected</span>
            <h2 className="section-heading">Prayer, events, giving, and photos</h2>
          </div>
          <div className="connect-scroll">
            {connectCards.map((card) => (
              <Link key={card.title} to={card.link} className="connect-card fade-up">
                <img src={card.image} alt={card.title} loading="lazy" />
                <div className="connect-card-overlay">
                  <h3>{card.title}</h3>
                  <p>{card.subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {ministries.length > 0 && (
        <section className="section ministries-section">
          <div className="container">
            <div className="section-header fade-up">
              <span className="section-eyebrow">Ministries</span>
              <h2 className="section-heading">Where our church family serves</h2>
              <p className="section-subheading">
                Each ministry helps us grow together and bless others.
              </p>
            </div>
            <div className="ministries-grid">
              {ministries.map((ministry) => (
                <Link key={ministry.id} to="/ministries" className="ministry-card fade-up">
                  <img src={ministry.image || '/chapel.jpg'} alt={ministry.name} loading="lazy" />
                  <div className="ministry-card-content">
                    {ministry.leader && <p className="ministry-tagline">Led by {ministry.leader}</p>}
                    <h3>{ministry.name}</h3>
                    <p className="ministry-desc">{ministry.description}</p>
                    <span className="ministry-link">Learn more →</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="section-footer fade-up">
              <Link to="/ministries" className="btn btn-dark">All ministries</Link>
            </div>
          </div>
        </section>
      )}

      <section className="section events-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">Calendar</span>
            <h2 className="section-heading">Coming up at the chapel</h2>
            <p className="section-subheading">
              Bible conferences, membership classes, worship nights, and outreach throughout the year.
            </p>
          </div>
          
          {/* Display announcements with images */}
          {announcements.length > 0 && (
            <div className="announcements-grid fade-up">
              {announcements.map((note) => (
                <div key={note.id || note.title} className="announcement-card">
                  {note.image && (
                    <img 
                      src={note.image} 
                      alt={note.title} 
                      className="announcement-image" 
                      loading="lazy"
                      decoding="async"
                      width="300"
                      height="200"
                    />
                  )}
                  <div className="announcement-content">
                    <span className="announcement-label">Announcement</span>
                    <h3>{note.title}</h3>
                    <p>{note.message}</p>
                    {note.link && (
                      <Link to={note.link} className="btn btn-primary">Learn more</Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {upcomingEvents.length === 0 && announcements.length === 0 ? (
            <div className="empty-state fade-up"><p>No upcoming events or announcements posted yet. Check back soon.</p></div>
          ) : (
            <>
              {upcomingEvents.length > 0 && (
                <div className="events-grid">
                  {upcomingEvents.map((event) => (
                    <Link key={event.id} to={`/events/${event.id}`} className="event-card fade-up">
                      <div className="event-card-image">
                        <img 
                          src={event.image || '/chapel.jpg'} 
                          alt={event.title} 
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="250"
                        />
                        <span className="event-date-badge">{formatEventDate(event.date)}</span>
                      </div>
                      <div className="event-card-body">
                        <h3>{event.title}</h3>
                        <p>{formatTimeRange(event.start_time, event.end_time)}</p>
                        <p className="event-location">{event.location}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
          <div className="section-footer fade-up">
            <Link to="/events" className="btn btn-dark">Full calendar</Link>
          </div>
        </div>
      </section>

      <section className="section get-involved">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">Take part</span>
            <h2 className="section-heading">Serve, pray, and give</h2>
            <p className="section-subheading">Every member has a place in the life of this church.</p>
          </div>
          <div className="involved-grid">
            {getInvolved.map((item) => (
              <Link key={item.title} to={item.link} className="involved-card fade-up">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="involved-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <div className="cta-band-content fade-up">
            <h2>We would be glad to welcome you</h2>
            <p>Visit on Sunday, write to us, or watch a recent message from home.</p>
            <div className="cta-band-actions">
              <Link to="/about" className="btn btn-hero-solid">Plan a Visit</Link>
              <Link to="/contact" className="btn btn-outline-white">Contact the church</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
