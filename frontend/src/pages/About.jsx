import { useEffect, useState } from 'react'
import PageHero from '../components/PageHero'
import * as settingsApi from '../api/settings'
import * as servicesApi from '../api/services'
import './About.css'

function About() {
  const [settings, setSettings] = useState(null)
  const [services, setServices] = useState([])

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(console.error)
    servicesApi.getServices().then(setServices).catch(console.error)
  }, [])

  return (
    <div className="about">
      <PageHero
        eyebrow="Our Church"
        title={settings?.church_name || 'About Cornerstone Family Chapel'}
        subtitle="A community of faith committed to worship, growth, and service"
      />
      <div className="page-body">
        <div className="container">
          <div id="our-church" className="content-card fade-up">
            <h2>A Church Growing Together</h2>
            <p>
              Cornerstone Family Chapel continues to grow through the dedication and commitment of its congregation. We are grateful for the way members come together to support one another, deepen their faith, and serve others.
            </p>
            <p>
              Our church life includes Bible teaching, membership development, worship, conferences, family enrichment, children&apos;s ministry, and community outreach. Through these activities, we seek to create an environment where people can learn, connect, serve, and grow.
            </p>
          </div>

          <div className="content-card fade-up">
            <h2>Growing Deeper in God&apos;s Word</h2>
            <p>The Word of God is central to our growth as a church.</p>
            <p>
              Through Bible studies, teaching sessions, membership classes, and conferences, we create opportunities for people to explore Scripture, ask questions, share insights, and apply God&apos;s teachings to everyday life.
            </p>
            <p>
              Our use of The Good Soil as Bible-study material reflects our desire for the whole church to continually soak in God&apos;s Word and grow together in understanding and faith.
            </p>
          </div>

          <div className="content-card fade-up">
            <h2>Our Mission & Vision</h2>
            <p><strong>Mission:</strong> {settings?.mission || 'Loading...'}</p>
            <p><strong>Vision:</strong> {settings?.vision || 'Loading...'}</p>
          </div>

          <div className="content-card fade-up">
            <h2>What We Believe</h2>
            <p>{settings?.beliefs || 'Loading...'}</p>
          </div>

          <div className="content-card fade-up">
            <h2>Service Times</h2>
            {services.length > 0 ? (
              <div className="service-schedule-list">
                {services.map((service) => (
                  <div key={service.id} className="service-schedule-item">
                    <strong>{service.name}</strong>
                    <span>{service.day} · {service.time}{service.location ? ` · ${service.location}` : ''}</span>
                    {service.description && <p>{service.description}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ whiteSpace: 'pre-line' }}>{settings?.service_times || 'Service times will be posted soon.'}</p>
            )}
          </div>

          <div className="content-card fade-up">
            <h2>Our Location</h2>
            <p>{settings?.address}</p>
            <p>{settings?.phone}</p>
            <p>{settings?.email}</p>
            <p>{settings?.office_hours}</p>
            {settings?.map_url && (
              <p><a href={settings.map_url} target="_blank" rel="noopener noreferrer">Open in Google Maps</a></p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
