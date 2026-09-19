import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './About.css'

function About() {
  useEffect(() => {
    const elements = document.querySelectorAll('.about-reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
      }
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])

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
              THAT WORSHIPS IN
              <br />
              TRUTH AND IN
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
                src="/images/cornerstone/page_01/751563519_871022072748257_3613845665156140829_n.jpg"
                alt="Cornerstone Family Chapel worship service"
              />
            </div>
          </div>

        </div>

      </section>


      {/* =====================================================
          WHO WE ARE
      ====================================================== */}
      <section className="about-who">

        <div className="about-container">

          <div className="about-section-title about-reveal">
            <h2>
              Who We
              <br />
              Are
            </h2>
          </div>

          <div className="about-who-grid">

            <div className="about-who-image about-reveal">

              <div className="about-photo-angle">
                <img
                  src="/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg"
                  alt="Cornerstone Family Chapel fellowship"
                />
              </div>

              <div className="about-dot about-dot-left" />

            </div>

            <div className="about-who-content about-reveal">

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

          <div className="about-defines-content about-reveal">

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


          <div className="about-defines-image about-reveal">

            <div className="about-defines-photo">

              <img
                src="/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg"
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

          <div className="about-slogan about-reveal">

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


          <div className="about-faith-content about-reveal">

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
                src="/images/cornerstone/page_07/page07_photo030_praise_and_worship_team_group.jpg"
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

          <h2 className="about-story-title about-reveal">
            Our Story
          </h2>

          <div className="about-story-grid">

            <div className="about-story-text about-reveal">

              <p>
                Cornerstone's vision aligned with Rabbit Creek Church,
                with its leadership supporting the ministry. The church
                began through an online church model as the RCC Kenya
                Campus.
              </p>

            </div>


            <div className="about-story-photo about-reveal">

              <img
                src="/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg"
                alt="Cornerstone church gathering"
              />

            </div>


            <div className="about-story-photo about-reveal">

              <img
                src="/images/cornerstone/page_02/page02_photo006_conference_participants.jpg"
                alt="Cornerstone Family Chapel community"
              />

            </div>


            <div className="about-story-text about-reveal">

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

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ====================================================== */}
      <section className="about-final">

        <div className="about-container about-final-grid">

          <div className="about-final-photo about-reveal">

            <img
              src="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
              alt="Cornerstone Family Chapel pastor"
            />

          </div>


          <div className="about-final-content about-reveal">

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
