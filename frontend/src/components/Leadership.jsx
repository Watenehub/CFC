import { useEffect, useState } from "react"
import "./Foundation.css"

export default function Leadership({ title, subtitle, members }) {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    if (!members || members.length === 0) return

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
        threshold: 0.55,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [members])

  // Don't render if no members
  if (!members || members.length === 0) {
    return null
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


      {/* STORY AREA */}
      <div className="foundation-story-wrapper">

        {/* LEFT STICKY IMAGE */}
        <div className="foundation-image-column">

          <div className="foundation-image-sticky">

            {members.map((member, index) => (
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

              <span>{String(members.length).padStart(2, "0")}</span>
            </div>

          </div>

        </div>


        {/* RIGHT CONTENT */}
        <div className="foundation-content">

          {members.map((member, index) => (
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

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}
