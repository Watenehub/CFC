import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

function MediaDashboard() {
  const stats = [
    { label: 'Sermons', value: '48' },
    { label: 'Livestreams', value: '12' },
    { label: 'Videos', value: '156' },
    { label: 'Audio files', value: '89' },
    { label: 'Photos', value: '234' },
  ]

  const recentActivity = [
    { action: 'Sermon uploaded: Walking in Faith', time: '2 hours ago' },
    { action: 'Livestream ended', time: '5 hours ago' },
    { action: 'Photos added to the gallery', time: '3 days ago' },
  ]

  return (
    <DashboardLayout role="media" title="Media ministry">
      <section className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </section>

      <section className="dashboard-section">
        <h2>Media tools</h2>
        <div className="quick-actions-grid">
          <Link to="/admin/gallery" className="action-card"><span className="action-label">Gallery Studio</span></Link>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent media activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.action} className="activity-item">
              <div className="activity-indicator" />
              <div className="activity-content">
                <div className="activity-action">{activity.action}</div>
                <div className="activity-time">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  )
}

export default MediaDashboard
