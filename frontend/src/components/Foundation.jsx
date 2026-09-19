import { useEffect, useState } from "react"
import * as settingsApi from '../api/settings'
import "./Foundation.css"

export default function Foundation() {
  const [settings, setSettings] = useState(null)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(console.error)
  }, [])

  useEffect(() => {
    if (!settings) return

    const sections = document.querySelectorAll(".foundation-story")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index)
            setActiveSection(index)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: "-20% 0px -20% 0px",
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [settings])

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


      {/* STORY AREA */}
      <div className="foundation-story-wrapper">

        {/* LEFT STICKY IMAGE */}
        <div className="foundation-image-column">

          <div className="foundation-image-sticky">

            {foundationData.map((item, index) => (
              <img
                key={item.id}
                src={item.image}
                alt={item.title}
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

              <span>{String(foundationData.length).padStart(2, "0")}</span>
            </div>

          </div>

        </div>


        {/* RIGHT CONTENT */}
        <div className="foundation-content">

          {foundationData.map((item, index) => (
            <article
              key={item.id}
              data-index={index}
              className={`foundation-story ${
                activeSection === index ? "active" : ""
              }`}
            >

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

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}
