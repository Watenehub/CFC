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
      const progress = Math.max(0, Math.min(1, scrolled / totalScroll))

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
  const activeIndex = Math.min(Math.floor(scrollProgress * sectionCount), sectionCount - 1)
  const sectionProgress = (scrollProgress * sectionCount) % 1

  // Calculate opacity and transform for each item
  const getItemStyles = (index) => {
    const progress = scrollProgress * sectionCount - index

    if (progress < 0) {
      // Item hasn't entered yet
      return {
        opacity: 0,
        transform: 'translateY(60px)',
      }
    } else if (progress > 1) {
      // Item has exited
      return {
        opacity: 0,
        transform: 'translateY(-60px)',
      }
    } else {
      // Item is transitioning
      const opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2
      const translateY = progress < 0.5 ? 60 - progress * 120 : -60 + (1 - progress) * 120
      return {
        opacity: Math.max(0, Math.min(1, opacity)),
        transform: `translateY(${translateY}px)`,
      }
    }
  }

  return (
    <section className="foundation">

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
                className="foundation-item"
                style={getItemStyles(index)}
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
