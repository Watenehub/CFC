import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { initScrollAnimations, cleanupScrollAnimations } from '../utils/scrollAnimations'
import * as sermonsApi from '../api/sermons'
import * as eventsApi from '../api/events'
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

const fallbackEvent = {
  id: 'chapel-fallback',
  title: 'Bible conferences, membership classes, worship nights, and outreach',
  description: 'There is always something happening at the chapel. Explore the full calendar for what is coming next.',
  image: '/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg',
  link: '/events',
}

function formatEventDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTimeRange(start, end) {
  if (!start) return ''
  return end ? `${start} – ${end}` : start
}

function Home() {
  const [latestSermon, setLatestSermon] = useState(null)
  const [upcomingEvents, setUpcomingEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [activeEvent, setActiveEvent] = useState(0)

  useEffect(() => {
    const observer = initScrollAnimations()
    return () => cleanupScrollAnimations(observer)
  }, [])

  useEffect(() => {
    const elements = document.querySelectorAll('.home-reveal, .section-tectonic')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('visible', entry.isIntersecting)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      try {
        // Load critical content first
        const [sermonsData, eventsData, notesData] = await Promise.allSettled([
          sermonsApi.getSermons(),
          eventsApi.getEvents(),
          notificationsApi.getNotifications(true),
        ])

        if (isMounted) {
          if (sermonsData.status === 'fulfilled' && sermonsData.value?.length) {
            const sorted = [...sermonsData.value].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
            setLatestSermon(sorted[0])
          }
          if (eventsData.status === 'fulfilled') {
            const now = new Date()
            const upcoming = eventsData.value
              .filter((event) => !event.date || new Date(event.date) >= now)
              .sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')))
              .slice(0, 6)
            setUpcomingEvents(upcoming)
          }
          if (notesData.status === 'fulfilled') {
            setAnnouncements(notesData.value.slice(0, 6))
          }
        }

      } catch (err) {
        console.error('Failed to load home page data:', err)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const eventSlides = useMemo(() => {
    const apiEvents = upcomingEvents.map((event) => ({
      ...event,
      type: 'event',
      description: event.description || event.location || 'Join us at Cornerstone Family Chapel.',
      image: event.image || fallbackEvent.image,
    }))

    const noticeSlides = announcements
      .filter((note) => note.image)
      .map((note) => ({
        ...note,
        id: `announcement-${note.id || note.title}`,
        type: 'announcement',
        description: note.message,
        image: note.image,
      }))

    const slides = [...apiEvents, ...noticeSlides]
    return slides.length ? slides.slice(0, 6) : [fallbackEvent]
  }, [upcomingEvents, announcements])

  useEffect(() => {
    setActiveEvent((current) => Math.min(current, Math.max(eventSlides.length - 1, 0)))

    if (eventSlides.length <= 1) return undefined

    const timer = window.setInterval(() => {
      setActiveEvent((current) => (current + 1) % eventSlides.length)
    }, 3500)

    return () => window.clearInterval(timer)
  }, [eventSlides.length])

  const currentEvent = eventSlides[activeEvent] || fallbackEvent

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <img
            src="/images/cornerstone/about/landing-page.jpg"
            alt="Congregation gathered at Cornerstone Family Chapel"
            className="hero-bg-image"
            loading="eager"
            decoding="async"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <p className="hero-brand fade-up">Cornerstone Family Chapel</p>
          <h1 className="hero-title hero-typewriter">A family of faith, rooted in Christ</h1>
        </div>
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </section>

      <section className="section experiences section-tectonic">
        <div className="experiences-container">
          <div className="experience-decoration experience-decoration-top" aria-hidden="true" />
          <div className="experiences-heading">
            <h2>Ways to be part of<br />Cornerstone</h2>
            <p>
              Come in person, join us online, serve on a team, or walk with us as we serve our neighbours.
            </p>
          </div>
          <div className="experience-stage">
            {experiences.map((item, index) => (
              <Link key={item.title} to={item.link} className={`experience-card experience-card-${index + 1}`}>
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
          <div className="experience-decoration experience-decoration-bottom" aria-hidden="true" />
        </div>
      </section>

      <section className="section sermon-feature section-tumble">
          <div className="container">
            <div className="sermon-feature-grid home-reveal merge-text">
              <div className="sermon-feature-media">
                <img className="motion-image" src={latestSermon?.thumbnail || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'} alt={latestSermon?.title || 'Cornerstone Family Chapel sermon'} />
              </div>
              <div className="sermon-feature-content">
                <span className="section-eyebrow">From the pulpit</span>
                <h2 className="section-heading">{latestSermon?.title || 'More than a Name'}</h2>
                <p className="sermon-meta">
                  {[latestSermon?.speaker || 'PIT NASH', latestSermon?.date && new Date(latestSermon.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), latestSermon?.scripture || 'Genesis 32:27–31'].filter(Boolean).join(' · ')}
                </p>
                <p className="sermon-description">{latestSermon?.description || 'A message from the pulpit to help us know Christ and live as His people.'}</p>
                <div className="sermon-actions">
                  <Link to={latestSermon ? `/sermons/${latestSermon.id}` : '/sermons'} className="btn btn-dark">Watch this message</Link>
                  <Link to="/sermons" className="sermon-link-secondary">All sermons →</Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      <section className="section connect section-pan">
        <div className="container">
          <div className="connect-stage">
            <div className="section-header home-reveal burst-text">
              <span className="section-eyebrow"># Stay</span>
              <h2 className="section-heading">Connected</h2>
            </div>
            <div className="connect-scroll">
              {connectCards.map((card) => (
                <Link key={card.title} to={card.link} className="connect-card home-reveal skate-text">
                  <img src={card.image} alt={card.title} loading="lazy" />
                  <div className="connect-card-overlay">
                    <h3>{card.title}</h3>
                    <p>{card.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

        <section className="section events-section section-tumble">
          <div className="container events-layout">
            <div className="events-copy home-reveal ascend-text">
              <span className="section-eyebrow">Calendar</span>
              <h2 className="section-heading">Coming up at the chapel</h2>
              <div className="events-copy-dynamic" key={`event-copy-${currentEvent.id}`}>
                <p className="events-description">{currentEvent.description || 'Bible conferences, membership classes, worship nights, and outreach throughout the year.'}</p>
                <div className="event-current-details">
                  {currentEvent.title && currentEvent.title !== fallbackEvent.title && <strong>{currentEvent.title}</strong>}
                  {currentEvent.type === 'event' && <span>{[formatEventDate(currentEvent.date), formatTimeRange(currentEvent.start_time, currentEvent.end_time)].filter(Boolean).join(' · ')}</span>}
                </div>
              </div>
              <Link to="/events" className="btn btn-primary events-calendar-button">Full calendar</Link>
            </div>
            <div className="event-showcase home-reveal merge-text" aria-live="polite">
              <div className="event-showcase-image">
                {eventSlides.map((event, index) => (
                  <div
                    className={`event-slide ${index === activeEvent ? 'is-active' : ''}`}
                    key={event.id}
                    aria-hidden={index !== activeEvent}
                    style={{ '--event-image': `url("${event.image || fallbackEvent.image}")` }}
                  >
                    <div className="event-slide-background" aria-hidden="true" />
                    <img className="motion-image" src={event.image || fallbackEvent.image} alt={event.title || 'Upcoming Cornerstone event'} loading={index === 0 ? 'eager' : 'lazy'} />
                  </div>
                ))}
              </div>
              <div className="event-dots" aria-label="Upcoming events">
                {eventSlides.map((event, index) => <button key={event.id} type="button" className={index === activeEvent ? 'active' : ''} aria-label={`Show ${event.title || `event ${index + 1}`}`} onClick={() => setActiveEvent(index)} />)}
              </div>
            </div>
          </div>
        </section>

      <section className="section get-involved section-pan">
        <div className="container">
          <div className="section-header home-reveal bounce-text">
            <span className="section-eyebrow">Take part</span>
            <h2 className="section-heading">Serve, pray, and give</h2>
            <p className="section-subheading">Every member has a place in the life of this church.</p>
          </div>
          <div className="involved-grid">
            {getInvolved.map((item) => (
              <Link key={item.title} to={item.link} className="involved-card home-reveal burst-text">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="involved-link">Learn more →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
