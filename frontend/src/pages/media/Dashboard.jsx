import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function MediaDashboard() {
  const { user, hasPermission } = useAuth()

  const stats = [
    { label: 'Sermons', value: '48', icon: '📺', color: 'purple', permission: 'manage_sermons' },
    { label: 'Livestreams', value: '12', icon: '📡', color: 'blue', permission: 'manage_events' },
    { label: 'Videos', value: '156', icon: '🎬', color: 'green', permission: 'manage_gallery' },
    { label: 'Audio Files', value: '89', icon: '🎵', color: 'orange', permission: 'manage_sermons' },
    { label: 'Photos', value: '234', icon: '📷', color: 'pink', permission: 'manage_gallery' },
    { label: 'Media Gallery', value: '45', icon: '🖼️', color: 'teal', permission: 'manage_gallery' }
  ]

  const quickActions = [
    { label: 'Upload Sermon', path: '/media/sermons/upload', icon: '📺', permission: 'manage_sermons' },
    { label: 'Setup Livestream', path: '/media/livestreams/setup', icon: '📡', permission: 'manage_events' },
    { label: 'Add Video', path: '/media/videos/add', icon: '🎬', permission: 'manage_gallery' },
    { label: 'Upload Audio', path: '/media/audio/upload', icon: '🎵', permission: 'manage_sermons' },
    { label: 'Add Photos', path: '/media/photos/add', icon: '📷', permission: 'manage_gallery' },
    { label: 'View Gallery', path: '/media/gallery', icon: '🖼️', permission: 'manage_gallery' }
  ]

  const recentActivity = [
    { action: 'Sermon uploaded: Walking in Faith', time: '2 hours ago', type: 'sermon' },
    { action: 'Livestream ended', time: '5 hours ago', type: 'livestream' },
    { action: 'New video added to gallery', time: '1 day ago', type: 'video' },
    { action: 'Audio file uploaded', time: '2 days ago', type: 'audio' },
    { action: 'Photos added to album', time: '3 days ago', type: 'photo' }
  ]

  const managementCards = [
    { label: 'Sermons', icon: '📺', description: 'Upload and manage sermon videos and audio', path: '/media/sermons', permission: 'manage_sermons' },
    { label: 'Livestreams', icon: '📡', description: 'Setup and manage live streaming', path: '/media/livestreams', permission: 'manage_events' },
    { label: 'Videos', icon: '🎬', description: 'Manage video content and library', path: '/media/videos', permission: 'manage_gallery' },
    { label: 'Audio', icon: '🎵', description: 'Manage audio files and podcasts', path: '/media/audio', permission: 'manage_sermons' },
    { label: 'Photos', icon: '📷', description: 'Manage photo galleries and albums', path: '/media/photos', permission: 'manage_gallery' },
    { label: 'Media Gallery', icon: '🖼️', description: 'View and organize all media', path: '/media/gallery', permission: 'manage_gallery' },
    { label: 'Broadcast Announcements', icon: '📢', description: 'Create and manage broadcast announcements', path: '/media/announcements', permission: 'manage_notifications' },
    { label: 'Media Statistics', icon: '📊', description: 'View media engagement statistics', path: '/media/statistics', permission: 'manage_events' }
  ]

  return (
    <div className="media-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Media Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.name}</p>
        </div>

        <section className="stats-grid">
          {stats.filter(stat => hasPermission(stat.permission)).map((stat, index) => (
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
            {quickActions.filter(action => hasPermission(action.permission)).map((action, index) => (
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
            {managementCards.filter(card => hasPermission(card.permission)).map((card, index) => (
              <Link key={index} to={card.path} className="management-card">
                <div className="management-icon">{card.icon}</div>
                <h3>{card.label}</h3>
                <p>{card.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default MediaDashboard
