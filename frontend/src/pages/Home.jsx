import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { initScrollAnimations, cleanupScrollAnimations } from '../utils/scrollAnimations'
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
  {
    title: 'Prayer',
    subtitle: 'Share a request with our church family',
    link: '/prayer',
    image: '/images/cornerstone/page_03/page03_photo010_pastors_leaders_conference_prayer.jpg',
  },
  {
    title: 'Events',
    subtitle: 'Conferences, classes, and gatherings',
    link: '/events',
    image: '/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg',
  },
  {
    title: 'Giving',
    subtitle: 'Support ministry, missions, and outreach',
    link: '/give',
    image: '/images/cornerstone/page_09/page09_photo047_medical_camp_health_outreach.jpg',
  },
  {
    title: 'Gallery',
    subtitle: 'Photos from life at Cornerstone',
    link: '/gallery',
    image: '/images/cornerstone/page_07/page07_photo032_music_extravaganza.jpg',
  },
]

const ministries = [
  {
    title: 'Children & Teens',
    tagline: 'Bible stories, fellowship, and room to grow.',
    description: 'We want young people to feel known, welcomed, and rooted in the Word.',
    link: '/ministries',
    image: '/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg',
  },
  {
    title: 'Praise & Worship',
    tagline: 'Music that helps the church lift its voice to God.',
    description: 'Our team prepares each week so we can worship together with heart and unity.',
    link: '/ministries',
    image: '/images/cornerstone/page_07/page07_photo030_praise_and_worship_team_group.jpg',
  },
  {
    title: 'Community Outreach',
    tagline: 'Compassion that goes beyond our walls.',
    description: 'Medical camps, neighbourhood projects, and simple acts of care for people around us.',
    link: '/ministries',
    image: '/images/cornerstone/page_11/page11_photo072_community_outreach_team.jpg',
  },
  {
    title: 'Media Ministry',
    tagline: 'Helping the congregation stay connected.',
    description: 'Cameras, sound, and live broadcast so those at home can still share in the service.',
    link: '/ministries',
    image: '/images/cornerstone/page_08/page08_photo044_media_technical_team.jpg',
  },
]

const events = [
  {
    date: 'Sep 5',
    title: 'Youth Revival Night',
    time: '6:00 PM – 9:00 PM',
    location: 'Main Sanctuary',
    image: '/images/cornerstone/page_07/page07_photo033_worship_night.jpg',
  },
  {
    date: 'Sep 12',
    title: "Men's Breakfast",
    time: '8:00 AM – 10:00 AM',
    location: 'Church Hall',
    image: '/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg',
  },
  {
    date: 'Sep 15',
    title: 'Bible Study Launch',
    time: '7:00 PM – 8:30 PM',
    location: 'Classroom A',
    image: '/images/cornerstone/page_05/page05_photo022_membership_class_group.jpg',
  },
]

const getInvolved = [
  {
    title: 'Serve on a team',
    description: 'Worship, media, hospitality, children, and outreach all need willing hands.',
    link: '/ministries',
  },
  {
    title: 'Ask for prayer',
    description: 'Tell us how we can stand with you. You do not have to carry it alone.',
    link: '/prayer',
  },
  {
    title: 'Give',
    description: 'Your gifts help us teach the Word, care for people, and keep the work of the church going.',
    link: '/give',
  },
]

function Home() {
  useEffect(() => {
    const observer = initScrollAnimations()
    return () => cleanupScrollAnimations(observer)
  }, [])

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-bg">
          <img
            src="/images/cornerstone/hero-main.jpg"
            alt="Congregation gathered at Cornerstone Family Chapel"
            className="hero-bg-image"
          />
          <div className="hero-overlay" />
        </div>
        <div className="hero-content container">
          <h1 className="hero-title fade-up">Growing in Faith. Serving with Love.</h1>
          <p className="hero-subtitle fade-up">
            Cornerstone Family Chapel is a church family committed to God&apos;s Word, genuine fellowship, and sharing Christ&apos;s love with our community.
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

      <section className="section sermon-feature">
        <div className="container">
          <div className="sermon-feature-grid fade-up">
            <div className="sermon-feature-media">
              <img
                src="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
                alt="Pastor Nahashon Wachira"
              />
            </div>
            <div className="sermon-feature-content">
              <span className="section-eyebrow">From the pulpit</span>
              <h2 className="section-heading">Walking in Faith: Trusting God&apos;s Plan</h2>
              <p className="sermon-meta">Nahashon Wachira · August 25, 2026 · Proverbs 3:5-6</p>
              <p className="sermon-description">
                A reminder that we can trust the Lord with all our heart, even when we cannot yet see the next step.
              </p>
              <div className="sermon-actions">
                <Link to="/sermons" className="btn btn-dark">Watch this message</Link>
                <Link to="/sermons" className="sermon-link-secondary">All sermons →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      <section className="section ministries-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">Ministries</span>
            <h2 className="section-heading">Where our church family serves</h2>
            <p className="section-subheading">
              Children, worship, outreach, and media — each ministry helps us grow together and bless others.
            </p>
          </div>
          <div className="ministries-grid">
            {ministries.map((ministry) => (
              <Link key={ministry.title} to={ministry.link} className="ministry-card fade-up">
                <img src={ministry.image} alt={ministry.title} loading="lazy" />
                <div className="ministry-card-content">
                  <p className="ministry-tagline">{ministry.tagline}</p>
                  <h3>{ministry.title}</h3>
                  <p className="ministry-desc">{ministry.description}</p>
                  <span className="ministry-link">Learn more →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section events-section">
        <div className="container">
          <div className="section-header fade-up">
            <span className="section-eyebrow">Calendar</span>
            <h2 className="section-heading">Coming up at the chapel</h2>
            <p className="section-subheading">
              Bible conferences, membership classes, worship nights, and outreach throughout the year.
            </p>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <Link key={event.title} to="/events" className="event-card fade-up">
                <div className="event-card-image">
                  <img src={event.image} alt={event.title} loading="lazy" />
                  <span className="event-date-badge">{event.date}</span>
                </div>
                <div className="event-card-body">
                  <h3>{event.title}</h3>
                  <p>{event.time}</p>
                  <p className="event-location">{event.location}</p>
                </div>
              </Link>
            ))}
          </div>
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
            <p className="section-subheading">
              Every member has a place in the life of this church.
            </p>
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
