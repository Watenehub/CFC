import React, { useEffect, useState } from "react";
import "./Foundation.css";
import * as settingsApi from '../api/settings';

export default function Foundation() {
  const [activeSection, setActiveSection] = useState(0);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    settingsApi.getSettings().then(data => {
      setSettings(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch settings:', err);
      setSettings({}); // Set empty object on error to allow default rendering
      setLoading(false);
    });
  }, []);

  // Don't render if still loading
  if (loading) {
    return null;
  }

  const foundationData = [
    {
      id: "vision",
      number: "01",
      title: "Our Vision",
      description: settings?.vision || "To nurture people to Christlikeness in order for them to reflect Christ in their daily life's.",
      image: "/images/cornerstone/page_01/page01_photo001_praise_and_worship_team_group.jpg",
      icon: "◉",
    },
    {
      id: "mission",
      number: "02",
      title: "Our Mission",
      description: settings?.mission || "To equip people to live their everyday ordinary life for Christ.",
      image: "/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg",
      icon: "◎",
    },
    {
      id: "motto",
      number: "03",
      title: "Our Motto",
      description: settings?.motto || "A family church that worships in truth and in spirit.",
      image: "/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg",
      icon: "✦",
    },
  ].filter(item => {
    // Only include items that have data (if settings exists)
    if (settings && item.id === "vision") return settings.vision;
    if (settings && item.id === "mission") return settings.mission;
    if (settings && item.id === "motto") return settings.motto;
    return true;
  });

  // If no data after filtering and settings exists, don't render
  if (foundationData.length === 0 && settings) {
    return null;
  }

  useEffect(() => {
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
  }, [foundationData]);

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
