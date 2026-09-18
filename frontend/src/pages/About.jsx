import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import './About.css'

function About() {
  useEffect(() => {
    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    document.querySelectorAll('.fade-up').forEach(el => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="about">
      {/* HERO SECTION */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <h1 className="about-hero-title">Cornerstone Family Chapel</h1>
          <p className="about-hero-subtitle">A Family Church That Worships in Truth and in Spirit</p>
          <p className="about-hero-description">
            We exist to nurture people toward Christlikeness and equip them to live their everyday lives for Christ.
          </p>
          <div className="about-hero-ctas">
            <Link to="#our-story" className="btn btn-primary">Our Story</Link>
            <Link to="/contact" className="btn btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section about-section--white">
        <div className="container">
          <div className="section-header fade-up">
            <h2>Who We Are</h2>
            <p className="section-intro">
              Cornerstone Family Chapel is a Christ-centered church committed to nurturing believers into Christlikeness through biblical teaching, discipleship, prayer, fellowship, and service.
            </p>
          </div>
          <div className="who-we-are-grid">
            <div className="who-we-are-card fade-up">
              <div className="who-we-are-icon">✝</div>
              <h3>CORNERSTONE</h3>
              <p>Jesus Christ is our foundation.</p>
            </div>
            <div className="who-we-are-card fade-up">
              <div className="who-we-are-icon">❤</div>
              <h3>FAMILY</h3>
              <p>We are a family marked by truth, love, and genuine fellowship.</p>
            </div>
            <div className="who-we-are-card fade-up">
              <div className="who-we-are-icon">⛪</div>
              <h3>CHAPEL</h3>
              <p>A place to grow in relationship with God and with one another.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VISION & MISSION */}
      <section className="about-section about-section--gradient">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-mission-card fade-up">
              <h3>OUR VISION</h3>
              <p>To nurture people to Christlikeness so that they reflect Christ in their daily lives.</p>
            </div>
            <div className="vision-mission-card fade-up">
              <h3>OUR MISSION</h3>
              <p>To equip people to live their everyday ordinary lives for Christ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR SLOGAN */}
      <section className="about-section about-section--slogan">
        <div className="container">
          <div className="slogan-statement fade-up">
            BIBLE PLUS NOTHING.
            <br />
            BIBLE MINUS NOTHING.
          </div>
        </div>
      </section>

      {/* WHAT DEFINES US */}
      <section className="about-section about-section--white">
        <div className="container">
          <div className="section-header fade-up">
            <h2>What Defines Us</h2>
          </div>
          <div className="defines-grid">
            <div className="defines-item fade-up">
              <div className="defines-bullet">•</div>
              <p>We are centered on Jesus Christ.</p>
            </div>
            <div className="defines-item fade-up">
              <div className="defines-bullet">•</div>
              <p>We are committed to biblical truth.</p>
            </div>
            <div className="defines-item fade-up">
              <div className="defines-bullet">•</div>
              <p>We live out the Great Commandment and Great Commission.</p>
            </div>
            <div className="defines-item fade-up">
              <div className="defines-bullet">•</div>
              <p>We pursue unity and discipleship.</p>
            </div>
            <div className="defines-item fade-up">
              <div className="defines-bullet">•</div>
              <p>We seek to serve God and others.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="our-story" className="about-section about-section--light">
        <div className="container">
          <div className="section-header fade-up">
            <h2>Our Story</h2>
          </div>
          <div className="timeline">
            <div className="timeline-item fade-up">
              <div className="timeline-year">2021</div>
              <div className="timeline-content">
                <p>Cornerstone's vision aligned with Rabbit Creek Church, with its leadership supporting the ministry. The church began as the RCC Kenya Campus through an online church model.</p>
              </div>
            </div>
            <div className="timeline-item fade-up">
              <div className="timeline-year">October 2, 2022</div>
              <div className="timeline-content">
                <p>Cornerstone Family Chapel was officially launched at Kihunguro Secondary School with 135 people in attendance.</p>
              </div>
            </div>
            <div className="timeline-item fade-up">
              <div className="timeline-year">TODAY</div>
              <div className="timeline-content">
                <p>A continuing story of God's faithfulness as Cornerstone grows in Christ, community, and service.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOD'S FAITHFULNESS */}
      <section className="about-section about-section--faithfulness">
        <div className="container">
          <div className="faithfulness-content fade-up">
            <h2>God's Faithfulness</h2>
            <p>From its beginnings during a challenging season, Cornerstone has continued to grow through God's faithfulness.</p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="about-section about-section--white">
        <div className="container">
          <div className="section-header fade-up">
            <h2>Core Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-card fade-up">
              <div className="value-icon">❤</div>
              <h3>LOVE</h3>
              <p>We demonstrate Christ's love toward God and one another.</p>
              <span className="value-reference">John 13:35; 1 Corinthians 13</span>
            </div>
            <div className="value-card fade-up">
              <div className="value-icon">🙏</div>
              <h3>PRAYER</h3>
              <p>We depend entirely on God through prayer.</p>
              <span className="value-reference">Philippians 4:6; Matthew 7:7</span>
            </div>
            <div className="value-card fade-up">
              <div className="value-icon">📖</div>
              <h3>DISCIPLE MAKING</h3>
              <p>We are committed to making mature followers of Jesus Christ.</p>
              <span className="value-reference">Matthew 28:20; Ephesians 4:12</span>
            </div>
            <div className="value-card fade-up">
              <div className="value-icon">🤝</div>
              <h3>SERVANTHOOD</h3>
              <p>We use our gifts and abilities to serve God and people.</p>
              <span className="value-reference">1 Corinthians 15:58</span>
            </div>
            <div className="value-card fade-up">
              <div className="value-icon">👥</div>
              <h3>TEAMWORK</h3>
              <p>We work together as one body for God's glory.</p>
              <span className="value-reference">1 Corinthians 12:12-27</span>
            </div>
          </div>
        </div>
      </section>

      {/* OUR LIFE TOGETHER */}
      <section className="about-section about-section--light">
        <div className="container">
          <div className="section-header fade-up">
            <h2>Our Life Together</h2>
            <p className="section-intro">
              We are a fellowship devoted to the apostles' teaching, fellowship, breaking of bread, and prayer.
            </p>
          </div>
          <div className="life-together-grid">
            <div className="life-together-item fade-up">
              <div className="life-together-number">01</div>
              <h3>Biblical Teaching</h3>
            </div>
            <div className="life-together-item fade-up">
              <div className="life-together-number">02</div>
              <h3>Fellowship</h3>
            </div>
            <div className="life-together-item fade-up">
              <div className="life-together-number">03</div>
              <h3>Breaking of Bread</h3>
            </div>
            <div className="life-together-item fade-up">
              <div className="life-together-number">04</div>
              <h3>Prayer</h3>
            </div>
          </div>
          <p className="life-together-closing fade-up">
            Every member matters. We seek to grow together in unity, love, service, and mutual encouragement.
          </p>
          <p className="life-together-references fade-up">
            <span>Ephesians 4:3</span>
            <span>Romans 14:19</span>
            <span>John 17</span>
          </p>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="about-section about-section--cta">
        <div className="container">
          <div className="cta-content fade-up">
            <h2>Come Be Part of Our Story</h2>
            <p>Join us as we worship, grow, serve, and follow Jesus together.</p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-primary">Visit Us</Link>
              <Link to="/contact" className="btn btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
