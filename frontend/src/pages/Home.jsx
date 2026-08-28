import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero-chapel">
        <div className="chapel-image-container">
          <img src="/CFC_CHURCH_PHOTO.jpg" alt="Cornerstone Family Chapel Building" className="chapel-hero-image" />
        </div>
      </section>

      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Cornerstone Family Chapel</h1>
          <p className="hero-subtitle">
            A place where faith grows, community thrives, and lives are transformed through Christ
          </p>
          <div className="hero-actions">
            <Link to="/watch-live" className="btn btn-primary">
              Watch Live
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Plan Your Visit
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/CFC_CHURCH_PHOTO.jpg" alt="Cornerstone Family Chapel" />
        </div>
      </section>

      <section className="service-info">
        <div className="container">
          <div className="service-info-content">
            <h2 className="section-title">Join Us This Sunday</h2>
            <div className="service-details">
              <div className="service-item">
                <div className="service-icon image-icon" aria-hidden="true"></div>
                <div className="service-text">
                  <h3>Sunday Worship</h3>
                  <p>9:00 AM - 11:00 AM</p>
                </div>
              </div>
              <div className="service-item">
                <div className="service-icon image-icon" aria-hidden="true"></div>
                <div className="service-text">
                  <h3>Location</h3>
                  <p>123 Church Street, Nairobi, Kenya</p>
                </div>
              </div>
              <div className="service-item">
                <div className="service-icon">👨‍👩‍👧‍👦</div>
                <div className="service-text">
                  <h3>Everyone Welcome</h3>
                  <p>Families, children, and visitors</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="live-service">
        <div className="container">
          <div className="live-service-content">
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE NOW
            </div>
            <h2 className="section-title">Watch Our Service Live</h2>
            <div className="live-player">
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw"
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-sermon">
        <div className="container">
          <h2 className="section-title">Featured Sermon</h2>
          <div className="sermon-card">
            <div className="sermon-thumbnail">
              <img src="/CFC_CHURCH_PHOTO.jpg" alt="Sermon thumbnail" />
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
          <h2 className="section-title">Upcoming Events</h2>
          <div className="events-grid">
            <div className="event-card">
              <div className="event-image">
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Event" />
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
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Event" />
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
                <img src="/CFC_CHURCH_PHOTO.jpg" alt="Event" />
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

      <section className="ministries">
        <div className="container">
          <h2 className="section-title">Our Ministries</h2>
          <div className="ministries-grid">
            <div className="ministry-card">
              <div className="ministry-icon">👦</div>
              <h3>Youth Ministry</h3>
              <p>Empowering the next generation</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">👶</div>
              <h3>Children's Ministry</h3>
              <p>Nurturing young hearts in faith</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🙏</div>
              <h3>Prayer Ministry</h3>
              <p>Interceding for our community</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🎵</div>
              <h3>Worship Ministry</h3>
              <p>Leading in praise and worship</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">📺</div>
              <h3>Media Ministry</h3>
              <p>Spreading the gospel digitally</p>
            </div>
            <div className="ministry-card">
              <div className="ministry-icon">🤝</div>
              <h3>Outreach Ministry</h3>
              <p>Serving our local community</p>
            </div>
          </div>
          <div className="section-cta">
            <Link to="/ministries" className="btn btn-secondary">
              Explore All Ministries
            </Link>
          </div>
        </div>
      </section>

      <section className="prayer-cta">
        <div className="container">
          <div className="prayer-cta-content">
            <h2 className="section-title">Need Prayer?</h2>
            <p className="prayer-cta-text">
              Our prayer team is here to pray with you. Share your prayer request and let us stand with you in faith.
            </p>
            <Link to="/prayer" className="btn btn-primary">
              Submit Prayer Request
            </Link>
          </div>
        </div>
      </section>

      <section className="giving-cta">
        <div className="container">
          <div className="giving-cta-content">
            <h2 className="section-title">Give with a Grateful Heart</h2>
            <p className="giving-cta-text">
              Your generous support helps us spread the gospel and serve our community.
            </p>
            <Link to="/give" className="btn btn-primary">
              Give Online
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
