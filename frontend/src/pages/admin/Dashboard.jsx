import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

function AdminDashboard() {
  const { hasPermission } = useAuth()

  const stats = [
    { label: 'Users', value: '156', permission: 'manage_users' },
    { label: 'Events', value: '12', permission: 'manage_events' },
    { label: 'Sermons', value: '48', permission: 'manage_sermons' },
    { label: 'Enquiries', value: '23', permission: 'manage_enquiries' },
    { label: 'Prayer requests', value: '67', permission: 'manage_enquiries' },
    { label: 'Giving records', value: '89', permission: 'manage_giving' },
  ]

  const quickActions = [
    { label: 'Manage users', path: '/admin/users', permission: 'manage_users' },
    { label: 'Create event', path: '/admin/events/create', permission: 'manage_events' },
    { label: 'Add sermon', path: '/admin/sermons/create', permission: 'manage_sermons' },
    { label: 'View enquiries', path: '/admin/enquiries', permission: 'manage_enquiries' },
    { label: 'Manage giving', path: '/admin/giving', permission: 'manage_giving' },
    { label: 'Manage ministries', path: '/admin/ministries', permission: 'manage_ministries' },
    { label: 'Manage pastors', path: '/admin/pastors', permission: 'manage_pastors' },
    { label: 'Manage deacons', path: '/admin/deacons', permission: 'manage_deacons' },
    { label: 'Gallery Studio', path: '/admin/gallery', permission: 'manage_gallery' },
    { label: 'Settings', path: '/admin/settings', permission: 'manage_users' },
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
        {stats.filter(stat => hasPermission(stat.permission)).map((stat) => (
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
          {quickActions.filter(action => hasPermission(action.permission)).map((action) => (
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
