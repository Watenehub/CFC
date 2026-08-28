import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function MediaDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Sermons', value: '48', icon: '📺', color: 'purple' },
    { label: 'Livestreams', value: '12', icon: '📡', color: 'blue' },
    { label: 'Videos', value: '156', icon: '🎬', color: 'green' },
    { label: 'Audio Files', value: '89', icon: '🎵', color: 'orange' },
    { label: 'Photos', value: '234', icon: '📷', color: 'pink' },
    { label: 'Media Gallery', value: '45', icon: '🖼️', color: 'teal' }
  ]

  const quickActions = [
    { label: 'Upload Sermon', path: '/media/sermons/upload', icon: '📺' },
    { label: 'Setup Livestream', path: '/media/livestreams/setup', icon: '📡' },
    { label: 'Add Video', path: '/media/videos/add', icon: '🎬' },
    { label: 'Upload Audio', path: '/media/audio/upload', icon: '🎵' },
    { label: 'Add Photos', path: '/media/photos/add', icon: '📷' },
    { label: 'View Gallery', path: '/media/gallery', icon: '🖼️' }
  ]

  const recentActivity = [
    { action: 'Sermon uploaded: Walking in Faith', time: '2 hours ago', type: 'sermon' },
    { action: 'Livestream ended', time: '5 hours ago', type: 'livestream' },
    { action: 'New video added to gallery', time: '1 day ago', type: 'video' },
    { action: 'Audio file uploaded', time: '2 days ago', type: 'audio' },
    { action: 'Photos added to album', time: '3 days ago', type: 'photo' }
  ]

  return (
    <div className="media-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Media Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
        </div>

        <section className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            </div>
          ))}
        </section>

        <section className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.path} className="action-card">
                <div className="action-icon">{action.icon}</div>
                <div className="action-label">{action.label}</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            {recentActivity.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className={`activity-indicator activity-${activity.type}`}></div>
                <div className="activity-content">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-time">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-section">
          <h2>Media Management</h2>
          <div className="management-grid">
            <Link to="/media/sermons" className="management-card">
              <div className="management-icon">📺</div>
              <h3>Sermons</h3>
              <p>Upload and manage sermon videos and audio</p>
            </Link>
            <Link to="/media/livestreams" className="management-card">
              <div className="management-icon">📡</div>
              <h3>Livestreams</h3>
              <p>Setup and manage live streaming</p>
            </Link>
            <Link to="/media/videos" className="management-card">
              <div className="management-icon">🎬</div>
              <h3>Videos</h3>
              <p>Manage video content and library</p>
            </Link>
            <Link to="/media/audio" className="management-card">
              <div className="management-icon">🎵</div>
              <h3>Audio</h3>
              <p>Manage audio files and podcasts</p>
            </Link>
            <Link to="/media/photos" className="management-card">
              <div className="management-icon">📷</div>
              <h3>Photos</h3>
              <p>Manage photo galleries and albums</p>
            </Link>
            <Link to="/media/gallery" className="management-card">
              <div className="management-icon">🖼️</div>
              <h3>Media Gallery</h3>
              <p>View and organize all media</p>
            </Link>
            <Link to="/media/announcements" className="management-card">
              <div className="management-icon">📢</div>
              <h3>Broadcast Announcements</h3>
              <p>Create and manage broadcast announcements</p>
            </Link>
            <Link to="/media/statistics" className="management-card">
              <div className="management-icon">📊</div>
              <h3>Media Statistics</h3>
              <p>View media engagement statistics</p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default MediaDashboard
