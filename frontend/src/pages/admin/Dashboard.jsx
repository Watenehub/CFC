import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Dashboard.css'

function AdminDashboard() {
  const { user } = useAuth()

  const stats = [
    { label: 'Total Users', value: '156', icon: '👥', color: 'blue' },
    { label: 'Events', value: '12', icon: '📅', color: 'green' },
    { label: 'Sermons', value: '48', icon: '📺', color: 'purple' },
    { label: 'Enquiries', value: '23', icon: '💬', color: 'orange' },
    { label: 'Prayer Requests', value: '67', icon: '🙏', color: 'pink' },
    { label: 'Giving Records', value: '89', icon: '💰', color: 'teal' }
  ]

  const quickActions = [
    { label: 'Manage Users', path: '/admin/users', icon: '👥' },
    { label: 'Create Event', path: '/admin/events/create', icon: '📅' },
    { label: 'Add Sermon', path: '/admin/sermons/create', icon: '📺' },
    { label: 'View Enquiries', path: '/admin/enquiries', icon: '💬' },
    { label: 'Manage Giving', path: '/admin/giving', icon: '💰' },
    { label: 'System Settings', path: '/admin/settings', icon: '⚙️' }
  ]

  const recentActivity = [
    { action: 'New user registered', time: '2 hours ago', type: 'user' },
    { action: 'New enquiry submitted', time: '3 hours ago', type: 'enquiry' },
    { action: 'Sermon uploaded', time: '5 hours ago', type: 'sermon' },
    { action: 'Event created', time: '1 day ago', type: 'event' },
    { action: 'Giving donation received', time: '1 day ago', type: 'giving' }
  ]

  return (
    <div className="admin-dashboard">
      <div className="container admin-layout">
        <aside className="admin-sidebar" aria-label="Admin navigation">
          <div className="sidebar-header">
            <h3>Admin</h3>
            <p className="sidebar-sub">{user?.name}</p>
          </div>
          <nav className="sidebar-nav">
            {quickActions.map((action, idx) => (
              <Link key={idx} to={action.path} className="sidebar-link">
                <span className="sidebar-icon">{action.icon}</span>
                <span className="sidebar-label">{action.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="admin-main">
          <div className="dashboard-header">
            <h1>Admin Dashboard</h1>
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
            <h2>Management Sections</h2>
            <div className="management-grid">
              <Link to="/admin/users" className="management-card">
                <div className="management-icon">👥</div>
                <h3>User Management</h3>
                <p>Manage users, roles, and permissions</p>
              </Link>
              <Link to="/admin/events" className="management-card">
                <div className="management-icon">📅</div>
                <h3>Events</h3>
                <p>Create and manage church events</p>
              </Link>
              <Link to="/admin/sermons" className="management-card">
                <div className="management-icon">📺</div>
                <h3>Sermons</h3>
                <p>Upload and manage sermon content</p>
              </Link>
              <Link to="/admin/ministries" className="management-card">
                <div className="management-icon">👥</div>
                <h3>Ministries</h3>
                <p>Manage church ministries</p>
              </Link>
              <Link to="/admin/giving" className="management-card">
                <div className="management-icon">💰</div>
                <h3>Giving</h3>
                <p>Manage giving campaigns and records</p>
              </Link>
              <Link to="/admin/enquiries" className="management-card">
                <div className="management-icon">💬</div>
                <h3>Enquiries</h3>
                <p>Respond to contact enquiries</p>
              </Link>
              <Link to="/admin/prayer" className="management-card">
                <div className="management-icon">🙏</div>
                <h3>Prayer Requests</h3>
                <p>View and manage prayer requests</p>
              </Link>
              <Link to="/admin/livestreams" className="management-card">
                <div className="management-icon">📡</div>
                <h3>Livestreams</h3>
                <p>Manage live streaming setup</p>
              </Link>
              <Link to="/admin/content" className="management-card">
                <div className="management-icon">📝</div>
                <h3>Website Content</h3>
                <p>Manage website content and pages</p>
              </Link>
              <Link to="/admin/notifications" className="management-card">
                <div className="management-icon">🔔</div>
                <h3>Notifications</h3>
                <p>Send notifications to users</p>
              </Link>
              <Link to="/admin/settings" className="management-card">
                <div className="management-icon">⚙️</div>
                <h3>System Settings</h3>
                <p>Configure system settings</p>
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
