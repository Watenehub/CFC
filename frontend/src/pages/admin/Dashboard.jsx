import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'

function AdminDashboard() {
  const stats = [
    { label: 'Users', value: '156' },
    { label: 'Events', value: '12' },
    { label: 'Sermons', value: '48' },
    { label: 'Enquiries', value: '23' },
    { label: 'Prayer requests', value: '67' },
    { label: 'Giving records', value: '89' },
  ]

  const quickActions = [
    { label: 'Manage users', path: '/admin/users' },
    { label: 'Create event', path: '/admin/events/create' },
    { label: 'Add sermon', path: '/admin/sermons/create' },
    { label: 'View enquiries', path: '/admin/enquiries' },
    { label: 'Manage giving', path: '/admin/giving' },
    { label: 'Settings', path: '/admin/settings' },
  ]

  const recentActivity = [
    { action: 'New user registered', time: '2 hours ago' },
    { action: 'New enquiry submitted', time: '3 hours ago' },
    { action: 'Sermon uploaded', time: '5 hours ago' },
    { action: 'Event created', time: '1 day ago' },
    { action: 'Giving record added', time: '1 day ago' },
  ]

  return (
    <DashboardLayout role="admin" title="Church administration">
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
        <h2>Shortcuts</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path} className="action-card">
              <div className="action-label">{action.label}</div>
            </Link>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <h2>Recent activity</h2>
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

export default AdminDashboard
