import { useEffect, useState, useRef } from "react"
import * as settingsApi from '../api/settings'
import "./Foundation.css"

export default function Foundation() {
  const [settings, setSettings] = useState(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollSectionRef = useRef(null)

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(console.error)
  }, [])

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

  // Don't render if no foundation data exists
  if (!settings || (!settings.vision && !settings.mission && !settings.motto)) {
    return null
  }

  const foundationData = [
    {
      id: "vision",
      number: "01",
      title: "Our Vision",
      description: settings.vision || "",
      image: "/images/cornerstone/page_01/751563519_871022072748257_3613845665156140829_n.jpg",
      icon: "◉",
    },
    {
      id: "mission",
      number: "02",
      title: "Our Mission",
      description: settings.mission || "",
      image: "/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg",
      icon: "◎",
    },
    {
      id: "motto",
      number: "03",
      title: "Our Motto",
      description: settings.motto || "",
      image: "/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg",
      icon: "✦",
    },
  ].filter(item => item.description) // Only include items with content

  // Don't render if no items have content
  if (foundationData.length === 0) {
    return null
  }

  // Calculate which section is active based on scroll progress
  const sectionCount = foundationData.length
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
          OUR FOUNDATION
        </div>

        <h1>
          Mission, Vision <span>&amp; Motto</span>
        </h1>

        <p>
          The principles that guide us in shaping lives for Christ.
        </p>

      </div>


      {/* SCROLL SECTION */}
      <div className="foundation-scroll-section" ref={scrollSectionRef}>

        {/* STICKY CONTAINER */}
        <div className="foundation-sticky-container">

          <div className="foundation-content-wrapper">

            {foundationData.map((item, index) => (
              <div
                key={item.id}
                className="foundation-item"
                style={getItemStyles(index)}
              >

                {/* IMAGE */}
                <div className="foundation-item-image">
                  <img
                    src={item.image}
                    alt={item.title}
                  />
                </div>

                {/* CONTENT */}
                <div className="foundation-item-content">

                  <div className="story-number">
                    {item.number}
                  </div>

                  <div className="story-icon">
                    {item.icon}
                  </div>

                  <h2>{item.title}</h2>

                  <p>{item.description}</p>

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
