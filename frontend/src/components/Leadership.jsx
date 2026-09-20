import { useEffect, useState, useRef } from "react"
import "./Foundation.css"

export default function Leadership({ title, subtitle, members }) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollSectionRef = useRef(null)

  useEffect(() => {
    if (!scrollSectionRef.current) return

    const handleScroll = () => {
      const section = scrollSectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const sectionHeight = section.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate how far we've scrolled through the section
      const scrolled = -rect.top
      const totalScroll = sectionHeight - viewportHeight
      const progress = totalScroll > 0
        ? Math.max(0, Math.min(1, scrolled / totalScroll))
        : 0

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Don't render if no members
  if (!members || members.length === 0) {
    return null
  }

  // Calculate which section is active based on scroll progress
  const sectionCount = members.length
  const activeIndex = Math.min(
    sectionCount - 1,
    Math.round(scrollProgress * (sectionCount - 1))
  )

  // Continuous crossfade identical to the About page's Mission/Vision/Motto
  // scroll story: each item slides, scales, and blurs based on its distance
  // from the active position instead of abruptly swapping in/out.
  const getItemStyles = (index) => {
    const offset = index - scrollProgress * (sectionCount - 1)
    const distance = Math.min(Math.abs(offset), 1)
    return {
      '--mvm-offset': offset,
      '--mvm-distance': distance,
    }
  }

  return (
    <section className="foundation" style={{ '--leadership-count': members.length }}>

      {/* HEADER */}
      <div className="foundation-header">

        <div className="foundation-label">
          <span>◎</span>
          LEADERSHIP
        </div>

        <h1>
          {title} <span>&amp; Team</span>
        </h1>

        <p>
          {subtitle}
        </p>

      </div>


      {/* SCROLL SECTION */}
      <div className="foundation-scroll-section" ref={scrollSectionRef}>

        {/* STICKY CONTAINER */}
        <div className="foundation-sticky-container">

          <div className="foundation-content-wrapper">

            {members.map((member, index) => (
              <div
                key={member.id || `${member.name}-${index}`}
                className={`foundation-item${index === activeIndex ? ' is-active' : ''}`}
                style={getItemStyles(index)}
                aria-hidden={index !== activeIndex}
              >

                {/* IMAGE */}
                <div className="foundation-item-image">
                  <img
                    src={member.image || '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg'}
                    alt={member.name}
                  />
                </div>

                {/* CONTENT */}
                <div className="foundation-item-content">

                  <div className="story-number">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="story-icon">
                    {index === 0 ? "◉" : index === 1 ? "◎" : "✦"}
                  </div>

                  <h2>{member.name}</h2>

                  <p className="leader-role">{member.title || member.role}</p>

                  <p>{member.bio || member.encouragement || ""}</p>

                  <div className="story-bottom">

                    <div className="story-line"></div>

                    <button className="story-arrow">
                      →
                    </button>

                  </div>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
