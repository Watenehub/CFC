import { useState, useEffect } from 'react'
import './WatchLive.css'
import '../styles/ModernDesignSystem.css'
import '../utils/scrollAnimations'

function WatchLive() {
  const [isLive, setIsLive] = useState(true)
  const [nextService, setNextService] = useState({
    title: 'Sunday Morning Worship',
    date: 'September 1, 2026',
    time: '9:00 AM'
  })

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })

  useEffect(() => {
    if (!isLive) {
      const targetDate = new Date('2026-09-01T09:00:00')
      const interval = setInterval(() => {
        const now = new Date()
        const difference = targetDate - now

        if (difference > 0) {
          setCountdown({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          })
        }
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isLive])

  const previousStreams = [
    {
      id: 1,
      title: 'Sunday Service - August 25, 2026',
      thumbnail: '/images/cornerstone/page_08/page08_photo042_media_control_room.jpg',
      date: 'August 25, 2026',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 2,
      title: 'Sunday Service - August 18, 2026',
      thumbnail: '/images/cornerstone/page_08/page08_photo042_media_control_room.jpg',
      date: 'August 18, 2026',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      id: 3,
      title: 'Sunday Service - August 11, 2026',
      thumbnail: '/images/cornerstone/page_08/page08_photo042_media_control_room.jpg',
      date: 'August 11, 2026',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    }
  ]

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  return (
    <div className="watch-live-page">
      <div className="container">
        <section className="live-header">
          <h1 className="fade-up">Worship With Us Wherever You Are</h1>
          <p className="live-subtitle fade-up">
            Technology has opened another way for our church family to stay connected.
          </p>
          <p className="live-subtitle fade-up">
            Through live broadcasts, those who cannot attend in person can still participate in our services and feel part of the church community. Our media team works diligently to make these broadcasts engaging and accessible.
          </p>
          <p className="live-subtitle fade-up">
            Join us online and worship with us from wherever you are.
          </p>
        </section>

        {isLive ? (
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
                src="https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw"
                title="Live Stream"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="live-player"
              ></iframe>
            </div>
            <div className="live-info">
              <p><strong>Current Service:</strong> Sunday Morning Worship</p>
              <p><strong>Started:</strong> 9:00 AM</p>
              <p><strong>Speaker:</strong> Nahashon Wachira</p>
            </div>
          </section>
        ) : (
          <section className="upcoming-service-section">
            <div className="upcoming-badge">Next Service</div>
            <h2 className="section-title">{nextService.title}</h2>
            <p className="service-date-time">
              {nextService.date} at {nextService.time}
            </p>
            
            <div className="countdown">
              <div className="countdown-item">
                <div className="countdown-value">{countdown.days}</div>
                <div className="countdown-label">Days</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{countdown.hours}</div>
                <div className="countdown-label">Hours</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{countdown.minutes}</div>
                <div className="countdown-label">Minutes</div>
              </div>
              <div className="countdown-item">
                <div className="countdown-value">{countdown.seconds}</div>
                <div className="countdown-label">Seconds</div>
              </div>
            </div>

            <div className="service-details">
              <div className="service-detail-item">
                <div className="detail-icon">📍</div>
                <div className="detail-text">
                  <h3>Location</h3>
                  <p>123 Church Street, Nairobi, Kenya</p>
                </div>
              </div>
              <div className="service-detail-item">
                <div className="detail-icon">👨‍👩‍👧‍👦</div>
                <div className="detail-text">
                  <h3>Speaker</h3>
                  <p>Nahashon Wachira</p>
                </div>
              </div>
              <div className="service-detail-item">
                <div className="detail-icon">📖</div>
                <div className="detail-text">
                  <h3>Scripture</h3>
                  <p>TBA</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="previous-streams">
          <h2 className="section-title fade-up">Previous Services</h2>
          <div className="streams-grid">
            {previousStreams.map((stream) => {
              const embedUrl = getYouTubeEmbedUrl(stream.videoUrl)
              return (
                <div key={stream.id} className="ministry-feature-frame fade-up">
                  <img src={stream.thumbnail} alt={stream.title} className="ministry-feature-image" />
                  <div className="ministry-feature-content">
                    <h3 className="ministry-feature-title">{stream.title}</h3>
                    <p className="stream-date">{stream.date}</p>
                    {embedUrl && (
                      <button 
                        className="ministry-feature-button"
                        onClick={() => {
                          const player = document.getElementById(`player-${stream.id}`)
                          if (player) {
                            player.scrollIntoView({ behavior: 'smooth' })
                          }
                        }}
                      >
                        Watch Now
                      </button>
                    )}
                  </div>
                  {embedUrl && (
                    <div id={`player-${stream.id}`} className="stream-player">
                      <iframe
                        width="100%"
                        height="300"
                        src={embedUrl}
                        title={stream.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="live-info-section">
          <div className="info-cards">
            <div className="glass-card fade-up">
              <div className="info-icon">🌐</div>
              <h3>Watch Anywhere</h3>
              <p>Join our services from anywhere in the world through our live stream.</p>
            </div>
            <div className="glass-card fade-up">
              <div className="info-icon">💬</div>
              <h3>Interactive Chat</h3>
              <p>Connect with other viewers during the service through live chat.</p>
            </div>
            <div className="glass-card fade-up">
              <div className="info-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Watch on any device - phone, tablet, or computer.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default WatchLive
