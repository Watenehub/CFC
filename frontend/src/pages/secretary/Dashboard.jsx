import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

function SecretaryDashboard() {
  const stats = [
    { label: 'Open enquiries', value: '23' },
    { label: 'Awaiting a reply', value: '8' },
    { label: 'Giving records', value: '89' },
    { label: 'This month', value: 'KES 245K' },
  ]

  const recentActivity = [
    { action: 'New enquiry from a visitor', time: '1 hour ago' },
    { action: 'Replied to an enquiry', time: '3 hours ago' },
    { action: 'Giving record received', time: '5 hours ago' },
  ]

  return (
    <DashboardLayout role="secretary" title="Church office">
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
        <h2>Office shortcuts</h2>
        <div className="quick-actions-grid">
          <Link to="/contact" className="action-card"><span className="action-label">Contact page</span></Link>
          <Link to="/give" className="action-card"><span className="action-label">Giving page</span></Link>
          <Link to="/events" className="action-card"><span className="action-label">Events calendar</span></Link>
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent office activity</h2>
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

export default SecretaryDashboard
