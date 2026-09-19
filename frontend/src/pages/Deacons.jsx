import { useState, useEffect } from 'react'
import * as deaconsApi from '../api/deacons'
import PageHero from '../components/PageHero'
import './Foundation.css'

function Deacons() {
  const [deacons, setDeacons] = useState([])
  const [activeSection, setActiveSection] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDeacons = async () => {
      try {
        const data = await deaconsApi.getDeacons()
        setDeacons(data)
      } catch (err) {
        setError('Failed to load deacons')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadDeacons()
  }, [])

  useEffect(() => {
    if (deacons.length === 0) return;
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
  }, [deacons]);

  if (loading) {
    return (
      <div className="about">
        <PageHero
          eyebrow="Leadership"
          title="Our Deacons"
          subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
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
          title="Our Deacons"
          subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
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

  if (deacons.length === 0) {
    return (
      <div className="about">
        <PageHero
          eyebrow="Leadership"
          title="Our Deacons"
          subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
          image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
        />
        <div className="page-body">
          <div className="container">
            <div className="empty-state"><p>No deacons listed yet.</p></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="about">
      <PageHero
        eyebrow="Leadership"
        title="Our Deacons"
        subtitle="Meet the deacons who serve our church family in care, hospitality, and outreach."
        image="/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg"
      />
      
      <section className="foundation">

        {/* HEADER */}
        <div className="foundation-header">

          <div className="foundation-label">
            <span>◎</span>
            OUR LEADERSHIP
          </div>

          <h1>
            Deacons <span>&amp; Servants</span>
          </h1>

          <p>
            Meet the deacons who serve our church family in care, hospitality, and outreach.
          </p>

        </div>


        {/* STORY AREA */}
        <div className="foundation-story-wrapper">

          {/* LEFT STICKY IMAGE */}
          <div className="foundation-image-column">

            <div className="foundation-image-sticky">

              {deacons.map((member, index) => (
                <img
                  key={member.id || `${member.name}-${index}`}
                  src={member.image || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'}
                  alt={member.name}
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

                <span>{String(deacons.length).padStart(2, "0")}</span>
              </div>

            </div>

          </div>


          {/* RIGHT CONTENT */}
          <div className="foundation-content">

            {deacons.map((member, index) => (
              <article
                key={member.id || `${member.name}-${index}`}
                data-index={index}
                className={`foundation-story ${
                  activeSection === index ? "active" : ""
                }`}
              >

                <div className="story-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="story-icon">
                  ◎
                </div>

                <h2>{member.name}</h2>

                <p className="leader-title">{member.role || member.title}</p>

                <p>{member.bio}</p>

                {member.encouragement && (
                  <p className="leader-encouragement" style={{ fontStyle: 'italic', marginTop: '15px', color: 'var(--about-green, #22c879)' }}>
                    "{member.encouragement}"
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

export default Deacons
