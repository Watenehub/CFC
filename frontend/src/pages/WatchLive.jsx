import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as settingsApi from '../api/settings'
import * as sermonsApi from '../api/sermons'
import './WatchLive.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function WatchLive() {
  const [settings, setSettings] = useState({ livestream_url: '', is_live: false })
  const [previousStreams, setPreviousStreams] = useState([])

  useEffect(() => {
    settingsApi.getSettings().then(setSettings).catch(console.error)
    sermonsApi.getSermons()
      .then((sermons) => {
        const withVideo = sermons
          .filter((sermon) => sermon.video_url)
          .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
          .slice(0, 6)
        setPreviousStreams(withVideo)
      })
      .catch(console.error)
  }, [])

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    if (url.includes('/embed/')) return url
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  const isLive = Boolean(settings.is_live)
  const liveEmbed = getYouTubeEmbedUrl(settings.livestream_url)

  return (
    <div className="watch-live-page">
      <div className="container">
        <section className="live-header">
          <h1 className="fade-up">Worship With Us Wherever You Are</h1>
          <p className="live-subtitle fade-up">
            Join the live stream when we are broadcasting, or catch up with recent messages below.
          </p>
        </section>

        {isLive && liveEmbed ? (
          <section className="live-now-section">
            <div className="live-badge">
              <span className="live-dot"></span>
              LIVE NOW
            </div>
            <h2 className="section-title">Sunday Morning Worship</h2>
            <div className="live-player-container">
              <iframe
                width="100%"
                height="500"
                src={liveEmbed}
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="live-player"
              ></iframe>
            </div>
          </section>
        ) : (
          <section className="upcoming-service-section">
            <div className="upcoming-badge">Stream offline</div>
            <h2 className="section-title">We are not live right now</h2>
            <p className="service-date-time">
              When a service is broadcasting, it will appear here automatically. In the meantime, watch a recent sermon below.
            </p>
            <Link to="/sermons" className="btn btn-primary">Browse sermons</Link>
          </section>
        )}

        <section className="previous-streams">
          <h2 className="section-title fade-up">Recent messages</h2>
          {previousStreams.length === 0 ? (
            <div className="empty-state"><p>No sermon videos published yet.</p></div>
          ) : (
            <div className="streams-grid">
              {previousStreams.map((stream) => (
                <Link key={stream.id} to={`/sermons/${stream.id}`} className="ministry-feature-frame fade-up">
                  <img src={stream.thumbnail || '/chapel.jpg'} alt={stream.title} className="ministry-feature-image" />
                  <div className="ministry-feature-content">
                    <h3 className="ministry-feature-title">{stream.title}</h3>
                    <p className="stream-date">{stream.speaker}{stream.date ? ` · ${new Date(stream.date).toLocaleDateString()}` : ''}</p>
                    <span className="ministry-feature-button">Watch Now</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default WatchLive
