import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as settingsApi from '../api/settings'
import './About.css'

function About() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 })
  const [mvmProgress, setMvmProgress] = useState(0)
  const [mvmActiveIndex, setMvmActiveIndex] = useState(0)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(console.error)
  }, [])

  useEffect(() => {
    // Scroll reveal animation that works both ways
    const elements = document.querySelectorAll('.about-reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          } else {
            entry.target.classList.remove('visible')
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    )

    elements.forEach((element) => observer.observe(element))

    // Scroll-driven Mission / Vision / Motto story.
    // The outer section is 145vh tall and its inner stage is sticky.
    // This converts the user's scroll position into a 0 -> 1 progress value.
    const handleMvmScroll = () => {
      const section = document.querySelector('.mvm-scroll-section')
      if (!section) return

      const rect = section.getBoundingClientRect()
      const scrollableDistance = section.offsetHeight - window.innerHeight

      if (scrollableDistance <= 0) return

      const progress = Math.min(
        1,
        Math.max(0, -rect.top / scrollableDistance)
      )

      setMvmProgress(progress)

      const mvmItems = [
        settings?.vision,
        settings?.mission,
        settings?.motto
      ].filter(Boolean)

      const activeIndex = Math.min(
        mvmItems.length - 1,
        Math.round(progress * (mvmItems.length - 1))
      )

      setMvmActiveIndex(activeIndex)
    }

    handleMvmScroll()
    window.addEventListener('scroll', handleMvmScroll, { passive: true })
    window.addEventListener('resize', handleMvmScroll)

    // Cursor tracking for parallax effects
    const handleMouseMove = (e) => {
      setCursorPosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleMvmScroll)
      window.removeEventListener('resize', handleMvmScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [settings])

  // Build MVM items from the values saved in admin settings.
  const mvmItems = settings ? [
    {
      key: 'vision',
      title: 'Our Vision',
      text: settings.vision,
      image: '/images/cornerstone/page_01/751563519_871022072748257_3613845665156140829_n.jpg',
      imageAlt: 'Cornerstone Family Chapel worship service',
    },
    {
      key: 'mission',
      title: 'Our Mission',
      text: settings.mission,
      image: '/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg',
      imageAlt: 'Cornerstone Family Chapel fellowship',
    },
    {
      key: 'motto',
      title: 'Our Motto',
      text: settings.motto,
      image: '/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg',
      imageAlt: 'Cornerstone Family Chapel gathering',
    },
  ].filter(item => item.text?.trim()) : []

  return (
    <main className="about-page">

      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="about-hero">

        <div className="about-hero-circle" />

        <div className="about-container about-hero-grid">

          <div className="about-hero-content about-reveal">

            <div className="about-church-mark">
              <span>CORNERSTONE</span>
              <span>FAMILY</span>
              <span>CHAPEL</span>
            </div>

            <h1>
              A FAMILY CHURCH
              <br />
              THAT WORSHIPS
              <br />
              IN TRUTH AND IN
              <br />
              SPIRIT
            </h1>

            <p>
              We exist to nurture people toward Christlikeness and equip them
              to live their everyday lives for Christ.
            </p>

          </div>

          <div className="about-hero-image-wrap about-reveal">
            <div className="about-hero-image">
              <img
                src="/images/cornerstone/about/hero.jpg"
                alt="Cornerstone Family Chapel worship service"
              />
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          MISSION / VISION / MOTTO — SCROLL STORY
          The section stays pinned while the user's scroll
          moves through Vision -> Mission -> Motto.
      ====================================================== */}
      {mvmItems.length > 0 && (
        <section className="mvm-scroll-section" aria-label="Mission, Vision and Motto">
          <div className="mvm-sticky">
            <div className="mvm-container">
              <div className="mvm-heading">
                <h2>
                  Mission, Vision <span>&amp; Motto</span>
                </h2>
                <p>The principles that guide us in shaping lives for Christ.</p>
              </div>

              <div className="mvm-stage">
                <div className="mvm-progress" aria-hidden="true">
                  <span
                    className="mvm-progress-fill"
                    style={{ height: `${mvmProgress * 100}%` }}
                  />
                </div>

                <div className="mvm-slides">
                  {mvmItems.map((item, index) => {
                    const offset = index - mvmProgress * (mvmItems.length - 1)
                    const distance = Math.min(Math.abs(offset), 1)

                    return (
                      <article
                        className={`mvm-slide ${index === mvmActiveIndex ? 'is-active' : ''}`}
                        key={item.key}
                        aria-hidden={index !== mvmActiveIndex}
                        style={{
                          '--mvm-offset': offset,
                          '--mvm-distance': Math.min(distance, 1),
                        }}
                      >
                        <div className="mvm-image-wrap">
                          <img src={item.image} alt={item.imageAlt} />
                        </div>

                        <div className="mvm-copy">
                          <span className="mvm-number">0{index + 1}</span>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                        </div>
                      </article>
                    )
                  })}
                </div>
              </div>

              <div className="mvm-dots" aria-label="Section progress">
                {mvmItems.map((item, index) => (
                  <span
                    key={item.key}
                    className={index === mvmActiveIndex ? 'is-active' : ''}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}


      {/* =====================================================
          WHO WE ARE
      ====================================================== */}
      <section className="about-who">

        <div className="about-container">

          <div className="about-section-title about-reveal ascend-text">
            <h2>
              Who We
              <br />
              Are
            </h2>
          </div>

          <div className="about-who-grid">

            <div className="about-who-image about-reveal ascend-text">

              <div className="about-photo-angle">
                <img
                  src="/images/cornerstone/about/who-we-are.jpg"
                  alt="Cornerstone Family Chapel fellowship"
                />
              </div>

              <div className="about-dot about-dot-left" />

            </div>

            <div className="about-who-content about-reveal ascend-text">

              <div className="about-mint-card">

                <p>
                  Cornerstone Family Chapel is a Christ-centered church
                  committed to nurturing believers into Christlikeness through
                  biblical teaching, discipleship, prayer, fellowship, and
                  service.
                </p>

              </div>

              <div className="about-family-block">
                <h3>FAMILY</h3>

                <p>
                  We are a family marked by truth, love,
                  and genuine fellowship.
                </p>
              </div>

              <div className="about-chapel-block">

                <h3>CHAPEL</h3>

                <p>
                  A place to grow in relationship with God
                  and with one another.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          WHAT DEFINES US
      ====================================================== */}
      <section className="about-defines">

        <div className="about-container about-defines-grid">

          <div className="about-defines-content about-reveal skate-text">

            <h2>
              What Defines
              <br />
              Us
            </h2>

            <div className="about-defines-list">

              <p>We are centered on Jesus Christ.</p>

              <p>We are committed to biblical truth.</p>

              <p>We pursue unity and discipleship.</p>

              <p>
                We live out the Great Commandment and
                Great Commission.
              </p>

              <p>We seek to serve God and others.</p>

            </div>

          </div>


          <div className="about-defines-image about-reveal skate-text">

            <div className="about-defines-photo">

              <img
                src="/images/cornerstone/about/what-defines-us.jpg"
                alt="Cornerstone Family Chapel gathering"
              />

            </div>

            <div className="about-dot about-dot-defines" />

          </div>

        </div>

      </section>


      {/* =====================================================
          BIBLE PLUS NOTHING
      ====================================================== */}
      <section className="about-faithfulness">

        <div className="about-container about-faith-grid">

          <div className="about-slogan about-reveal merge-text">

            <h2>
              BIBLE PLUS
              <br />
              NOTHING.
              <br />
              BIBLE MINUS
              <br />
              NOTHING.
            </h2>

          </div>


          <div className="about-faith-content about-reveal merge-text">

            <div className="about-faith-card">

              <h3>God's Faithfulness</h3>

              <p>
                From its beginnings during a challenging season,
                Cornerstone has continued to grow through God's
                faithfulness.
              </p>

            </div>

            <div className="about-faith-image">

              <img
                src="/images/cornerstone/about/faithfulness.jpg"
                alt="Cornerstone Family Chapel worship team"
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          OUR STORY
      ====================================================== */}
      <section className="about-story" id="our-story">

        <div className="about-container">

          <h2 className="about-story-title about-reveal burst-text">
            Our Story
          </h2>

          <div className="about-story-grid">

            <div className="about-story-text about-reveal burst-text">

              <p>
                Cornerstone's vision aligned with Rabbit Creek Church,
                with its leadership supporting the ministry. The church
                began through an online church model as the RCC Kenya
                Campus.
              </p>

            </div>


            <div className="about-story-photo about-reveal burst-text">

              <img
                src="/images/cornerstone/about/rabbit-creek-church.webp"
                alt="Cornerstone church gathering"
              />

            </div>


            <div className="about-story-photo about-reveal burst-text">

              <img
                src="/images/cornerstone/page_02/page02_photo006_conference_participants.jpg"
                alt="Cornerstone Family Chapel community"
              />

            </div>


            <div className="about-story-text about-reveal burst-text">

              <div className="about-story-date">
                October 2, 2022
              </div>

              <p>
                Cornerstone Family Chapel was officially launched
                at Kihunguro Secondary School with 135 people in
                attendance.
              </p>

              <strong>TODAY</strong>

              <p>
                A continuing story of God's faithfulness as Cornerstone
                grows in Christ, community, and service.
              </p>

              <p>By the Grace of God we are currently located at Ruiru Kamakis.</p>

              <a
                className="about-story-location"
                href="https://maps.app.goo.gl/X1ipVVPMVysJwD4L7"
                target="_blank"
                rel="noreferrer"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 21s7-6.1 7-12A7 7 0 1 0 5 9c0 5.9 7 12 7 12Z" />
                  <circle cx="12" cy="9" r="2.25" />
                </svg>
                <span>Ruiru Kamakis, behind Gatongora Police Station</span>
              </a>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="about-final">

        <div className="about-container about-final-grid">

          <div className="about-final-photo about-reveal bounce-text">

            <img
              src="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
              alt="Cornerstone Family Chapel pastor"
            />

          </div>


          <div className="about-final-content about-reveal bounce-text">

            <div className="about-final-message">

              <h2>
                Come Be Part of
                <br />
                Our Story
              </h2>

              <p>
                Join us as we worship, grow, serve,
                and follow Jesus together.
              </p>

            </div>

            <Link
              to="/contact"
              className="about-final-button"
            >
              Get in touch
              <span>→</span>
            </Link>

          </div>

          <div className="about-dot about-final-dot" />

        </div>

      </section>

    </main>
  )
}

export default About
