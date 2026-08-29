import { Link } from 'react-router-dom'
import './Home.css'
import '../styles/ModernDesignSystem.css'

function Home() {
  return (
    <div className="home">
      <section className="hero-chapel">
        <div className="chapel-image-container">
          <div className="hero-showcase-frame">
            <span className="cross-accent cross-accent-1">✝</span>
            <span className="cross-accent cross-accent-2">✝</span>
            <img src="/chapel.jpg" alt="Cornerstone Family Chapel Building" className="chapel-hero-image hero-showcase-image" />
          </div>
        </div>
      </section>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title fade-up">Growing in Faith. Serving with Love.</h1>
          <p className="hero-subtitle fade-up">
            At Cornerstone Family Chapel, we are committed to growing together in the Word of God, strengthening one another in fellowship, and sharing Christ's love with our community.
          </p>
          <div className="hero-actions fade-up">
            <Link to="/watch-live" className="btn-premium btn-premium-primary">
              Watch Live
            </Link>
            <Link to="/about" className="btn-premium btn-premium-gold">
              Plan Your Visit
            </Link>
          </div>
        </div>
        <div className="hero-image fade-up">
          <div className="hero-showcase-frame">
            <img src="/chapel.jpg" alt="Cornerstone Family Chapel" className="hero-showcase-image" />
          </div>
        </div>
      </section>

      <section className="welcome-section">
        <div className="wave-divider wave-divider-top">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="var(--color-light-gray)"></path>
          </svg>
        </div>
        <div className="container">
          <div className="welcome-content">
            <h2 className="section-title fade-up">Welcome to Cornerstone Family Chapel</h2>
            <p className="welcome-text fade-up">
              We are a growing church family seeking to deepen our faith, learn from God's Word, and serve one another with open hearts. Through worship, Bible teaching, fellowship, and community outreach, we seek to be a source of hope, encouragement, and love to those around us.
            </p>
            <p className="welcome-text fade-up">
              Our journey is one of growing together—learning, serving, and reaching beyond our walls to touch lives with the love of Christ.
            </p>
          </div>
        </div>
        <div className="wave-divider">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="var(--color-light-gray)"></path>
          </svg>
        </div>
      </section>

      <section className="watch-live-cta">
        <div className="container">
          <div className="watch-live-content">
            <h2 className="section-title">Worship With Us Wherever You Are</h2>
            <p className="watch-live-text">
              Technology has opened another way for our church family to stay connected.
            </p>
            <p className="watch-live-text">
              Through live broadcasts, those who cannot attend in person can still participate in our services and feel part of the church community. Our media team works diligently to make these broadcasts engaging and accessible.
            </p>
            <p className="watch-live-text">
              Join us online and worship with us from wherever you are.
            </p>
            <Link to="/watch-live" className="btn-premium btn-premium-primary">
              Watch Live
            </Link>
          </div>
        </div>
      </section>

      <section className="featured-sermon">
        <div className="container">
          <h2 className="section-title">Featured Sermon</h2>
          <div className="sermon-card">
            <div className="sermon-thumbnail">
              <img src="/chapel.jpg" alt="Sermon thumbnail" />
            </div>
            <div className="sermon-info">
              <h3>Walking in Faith: Trusting God's Plan</h3>
              <p className="sermon-speaker">Pastor John Doe</p>
              <p className="sermon-date">August 25, 2026</p>
              <p className="sermon-scripture">Proverbs 3:5-6</p>
              <p className="sermon-description">
                Discover how to trust God completely and walk in faith, even when the path is unclear.
              </p>
              <Link to="/sermons" className="btn btn-outline">
                Watch Sermon
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="upcoming-events">
        <div className="container">
          <h2 className="section-title">Life Together</h2>
          <p className="events-intro">
            Church is more than a weekly gathering. It is a community where we learn, fellowship, serve, and grow together.
          </p>
          <p className="events-intro">
            Throughout the year, Cornerstone Family Chapel participates in Bible conferences, leadership conferences, family-focused programs, membership classes, worship events, and community outreach initiatives.
          </p>
          <p className="events-intro">
            Our events create opportunities to strengthen relationships, gain understanding, and encourage one another in our walk of faith.
          </p>
          <h3 className="events-subtitle">Upcoming Events</h3>
          <div className="events-grid">
            <div className="event-card">
              <div className="event-image">
                <img src="/chapel.jpg" alt="Event" />
              </div>
              <div className="event-details">
                <div className="event-date">Sep 5</div>
                <h3>Youth Revival Night</h3>
                <p className="event-time">6:00 PM - 9:00 PM</p>
                <p className="event-location">Main Sanctuary</p>
                <Link to="/events" className="event-link">
                  View Details →
                </Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-image">
                <img src="/chapel.jpg" alt="Event" />
              </div>
              <div className="event-details">
                <div className="event-date">Sep 12</div>
                <h3>Men's Breakfast</h3>
                <p className="event-time">8:00 AM - 10:00 AM</p>
                <p className="event-location">Church Hall</p>
                <Link to="/events" className="event-link">
                  View Details →
                </Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-image">
                <img src="/chapel.jpg" alt="Event" />
              </div>
              <div className="event-details">
                <div className="event-date">Sep 15</div>
                <h3>Bible Study Launch</h3>
                <p className="event-time">7:00 PM - 8:30 PM</p>
                <p className="event-location">Classroom A</p>
                <Link to="/events" className="event-link">
                  View Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-ministries">
        <div className="container">
          <h2 className="section-title fade-up">Our Ministries</h2>
          <div className="ministries-grid">
            <div className="ministry-feature-frame fade-up">
              <img src="/chapel.jpg" alt="Children & Teens Ministry" className="ministry-feature-image" />
              <div className="ministry-feature-content">
                <h3 className="ministry-feature-title">Children & Teens Ministry</h3>
                <p className="ministry-feature-description">We desire to create an environment where children and young people can feel welcomed, connected, and encouraged to grow in their faith.</p>
                <p className="ministry-feature-description">Through Bible stories, interactive activities, fellowship, and service opportunities, the ministry seeks to nurture spiritual, social, and emotional growth while helping young people develop meaningful relationships within the church.</p>
                <Link to="/ministries" className="ministry-feature-button">Learn More</Link>
              </div>
            </div>
            <div className="ministry-feature-frame fade-up">
              <img src="/chapel.jpg" alt="Praise & Worship" className="ministry-feature-image" />
              <div className="ministry-feature-content">
                <h3 className="ministry-feature-title">Praise & Worship</h3>
                <p className="ministry-feature-description">Our Praise & Worship ministry serves with dedication, giving their time, talents, and hearts to help create meaningful worship experiences.</p>
                <p className="ministry-feature-description">Through music, preparation, rehearsal, and service, the team seeks to uplift the congregation and help us connect more deeply in worship.</p>
                <Link to="/ministries" className="ministry-feature-button">Learn More</Link>
              </div>
            </div>
            <div className="ministry-feature-frame fade-up">
              <img src="/chapel.jpg" alt="Community Outreach" className="ministry-feature-image" />
              <div className="ministry-feature-content">
                <h3 className="ministry-feature-title">Community Outreach</h3>
                <p className="ministry-feature-description">Community outreach is an important part of who we are. We believe that faith is expressed not only through worship, but also through compassion, kindness, generosity, and practical service.</p>
                <p className="ministry-feature-description">From supporting people in need to participating in community initiatives, we seek opportunities to uplift others and build meaningful relationships.</p>
                <Link to="/ministries" className="ministry-feature-button">Learn More</Link>
              </div>
            </div>
          </div>
          <div className="section-cta fade-up">
            <Link to="/ministries" className="btn-premium btn-premium-outline">
              Explore All Ministries
            </Link>
          </div>
        </div>
      </section>

      <section className="community-outreach">
        <div className="container">
          <div className="outreach-content">
            <h2 className="section-title">Serving Beyond Our Walls</h2>
            <p className="outreach-text">
              Community outreach is an important part of who we are. We believe that faith is expressed not only through worship, but also through compassion, kindness, generosity, and practical service.
            </p>
            <p className="outreach-text">
              From supporting people in need to participating in community initiatives, we seek opportunities to uplift others and build meaningful relationships. Our desire is to be a beacon of hope in our community and beyond.
            </p>
            <Link to="/ministries" className="btn-premium btn-premium-primary">
              Explore Our Outreach
            </Link>
          </div>
        </div>
      </section>

      <section className="prayer-cta">
        <div className="container">
          <div className="prayer-cta-content">
            <h2 className="section-title">We Would Love to Pray With You</h2>
            <p className="prayer-cta-text">
              You don't have to walk through life's challenges alone.
            </p>
            <p className="prayer-cta-text">
              Share your prayer request with us, and allow our church family to stand with you in prayer, encouragement, and support.
            </p>
            <Link to="/prayer" className="btn-premium btn-premium-primary">
              Submit a Prayer Request
            </Link>
          </div>
        </div>
      </section>

      <section className="giving-cta">
        <div className="container">
          <div className="giving-cta-content">
            <h2 className="section-title">Give With Purpose</h2>
            <p className="giving-cta-text">
              Your generosity helps us continue serving God, strengthening our ministries, supporting our community, and creating opportunities for people to grow in faith.
            </p>
            <p className="giving-cta-text">
              Whether supporting the church's ministry, missions, community outreach, or a specific project, every contribution can help us serve others and extend the impact of the church.
            </p>
            <Link to="/give" className="btn-premium btn-premium-gold">
              Give Today
            </Link>
          </div>
        </div>
      </section>

      <section className="final-cta">
        <div className="container">
          <h2 className="section-title">Take Your Next Step</h2>
          <div className="cta-grid">
            <Link to="/about" className="cta-card">
              <div className="cta-icon">🏠</div>
              <h3>Visit Us</h3>
              <p>Plan your first visit to Cornerstone</p>
            </Link>
            <Link to="/sermons" className="cta-card">
              <div className="cta-icon">📺</div>
              <h3>Watch Sermons</h3>
              <p>Browse our sermon archive</p>
            </Link>
            <Link to="/ministries" className="cta-card">
              <div className="cta-icon">👥</div>
              <h3>Join a Ministry</h3>
              <p>Find your place to serve</p>
            </Link>
            <Link to="/contact" className="cta-card">
              <div className="cta-icon">💬</div>
              <h3>Get in Touch</h3>
              <p>We'd love to hear from you</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
