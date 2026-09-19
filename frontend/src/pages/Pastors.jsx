import { useState, useEffect } from 'react'
import * as pastorsApi from '../api/pastors'
import PageHero from '../components/PageHero'
import '../components/Foundation.css'

function Pastors() {
  const [pastors, setPastors] = useState([])
  const [activeSection, setActiveSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPastors = async () => {
      try {
        const data = await pastorsApi.getPastors()
        setPastors(data)
      } catch (err) {
        setError('Failed to load pastors')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadPastors()
  }, [])

  useEffect(() => {
    if (pastors.length === 0) return;
    if (typeof document === 'undefined') return;
    
    const sections = document.querySelectorAll(".foundation-story");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index);
            setActiveSection(index);
          }
        });
      },
      {
        threshold: 0.55,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pastors]);

  if (loading) {
    return (
      <div className="about">
        <PageHero
          eyebrow="Leadership"
          title="Our Pastors"
          subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
          image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
        />
        <div className="page-body">
          <div className="container">
            <div className="loading-state">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="about">
        <PageHero
          eyebrow="Leadership"
          title="Our Pastors"
          subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
          image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
        />
        <div className="page-body">
          <div className="container">
            <div className="error-state">{error}</div>
          </div>
        </div>
      </div>
    )
  }

  if (pastors.length === 0) {
    return (
      <div className="about">
        <PageHero
          eyebrow="Leadership"
          title="Our Pastors"
          subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
          image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
        />
        <div className="page-body">
          <div className="container">
            <div className="empty-state"><p>No pastors listed yet.</p></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="about">
      <PageHero
        eyebrow="Leadership"
        title="Our Pastors"
        subtitle="Meet the pastors who shepherd Cornerstone Family Chapel."
        image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
      />
      
      <section className="foundation">

        {/* HEADER */}
        <div className="foundation-header">

          <div className="foundation-label">
            <span>◉</span>
            OUR LEADERSHIP
          </div>

          <h1>
            Pastors <span>&amp; Leaders</span>
          </h1>

          <p>
            Meet the pastors who shepherd Cornerstone Family Chapel.
          </p>

        </div>


        {/* STORY AREA */}
        <div className="foundation-story-wrapper">

          {/* LEFT STICKY IMAGE */}
          <div className="foundation-image-column">

            <div className="foundation-image-sticky">

              {pastors.map((pastor, index) => (
                <img
                  key={pastor.id || `${pastor.name}-${index}`}
                  src={pastor.image || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'}
                  alt={pastor.name}
                  className={
                    activeSection === index
                      ? "foundation-image active"
                      : "foundation-image"
                  }
                />
              ))}

              {/* Image counter */}
              <div className="image-counter">
                <span>
                  {String(activeSection + 1).padStart(2, "0")}
                </span>

                <div className="counter-line"></div>

                <span>{String(pastors.length).padStart(2, "0")}</span>
              </div>

            </div>

          </div>


          {/* RIGHT CONTENT */}
          <div className="foundation-content">

            {pastors.map((pastor, index) => (
              <article
                key={pastor.id || `${pastor.name}-${index}`}
                data-index={index}
                className={`foundation-story ${
                  activeSection === index ? "active" : ""
                }`}
              >

                <div className="story-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="story-icon">
                  ◉
                </div>

                <h2>{pastor.name}</h2>

                <p className="leader-title">{pastor.title}</p>

                <p>{pastor.bio}</p>

                {pastor.encouragement && (
                  <p className="leader-encouragement" style={{ fontStyle: 'italic', marginTop: '15px', color: 'var(--about-green, #22c879)' }}>
                    "{pastor.encouragement}"
                  </p>
                )}

                <div className="story-bottom">

                  <div className="story-line"></div>

                  <button className="story-arrow">
                    →
                  </button>

                </div>

              </article>
            ))}

          </div>

        </div>

      </section>
    </div>
  )
}

export default Pastors
