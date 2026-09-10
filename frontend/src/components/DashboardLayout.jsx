import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'
import '../pages/admin/AdminPage.css'

const NAV = {
  admin: [
    { path: '/admin', label: 'Overview', exact: true, permission: null },
    { path: '/admin/users', label: 'Users', permission: 'manage_users' },
    { path: '/admin/events/manage', label: 'Events', permission: 'manage_events' },
    { path: '/admin/sermons/manage', label: 'Sermons', permission: 'manage_sermons' },
    { path: '/admin/giving', label: 'Giving', permission: 'manage_giving' },
    { path: '/admin/enquiries', label: 'Enquiries', permission: 'manage_enquiries' },
    { path: '/admin/prayer', label: 'Prayer', permission: 'manage_enquiries' },
    { path: '/admin/announcements', label: 'Announcements', permission: 'manage_notifications' },
    { path: '/admin/services', label: 'Services', permission: 'manage_services' },
    { path: '/admin/ministries', label: 'Ministries', permission: 'manage_ministries' },
    { path: '/admin/pastors', label: 'Pastors', permission: 'manage_pastors' },
    { path: '/admin/deacons', label: 'Deacons', permission: 'manage_deacons' },
    { path: '/admin/gallery', label: 'Gallery', permission: 'manage_gallery' },
    { path: '/admin/settings', label: 'Settings', permission: 'manage_users' },
  ],
  media: [
    { path: '/media', label: 'Overview', exact: true, permission: null },
    { path: '/admin/events/manage', label: 'Events', permission: 'manage_events' },
    { path: '/admin/sermons/manage', label: 'Sermons', permission: 'manage_sermons' },
    { path: '/admin/gallery', label: 'Gallery', permission: 'manage_gallery' },
    { path: '/admin/announcements', label: 'Announcements', permission: 'manage_notifications' },
  ],
  secretary: [
    { path: '/secretary', label: 'Overview', exact: true, permission: null },
    { path: '/admin/giving', label: 'Giving', permission: 'manage_giving' },
    { path: '/admin/enquiries', label: 'Enquiries', permission: 'manage_enquiries' },
    { path: '/admin/prayer', label: 'Prayer', permission: 'manage_enquiries' },
    { path: '/admin/services', label: 'Services', permission: 'manage_services' },
  ],
  member: [
    { path: '/member', label: 'Overview', exact: true, permission: null },
    { path: '/sermons', label: 'Sermons', permission: null },
    { path: '/events', label: 'Events', permission: null },
    { path: '/prayer', label: 'Prayer', permission: null },
    { path: '/give', label: 'Give', permission: null },
  ],
}

const TITLES = {
  admin: 'Admin',
  media: 'Media',
  secretary: 'Secretary',
  member: 'Member',
}

function DashboardLayout({ role, title, children }) {
  const { user, hasPermission, logout } = useAuth()
  const location = useLocation()
  const activeRole = user?.role || role

  const links = NAV[activeRole]?.filter((item) =>
    !item.permission || hasPermission(item.permission)
  ) || []

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  }

  const handleLogout = async () => {
    try {
      await logout()
      window.location.href = '/login'
    } catch (error) {
      console.error(error)
      window.location.href = '/login'
    }
  }

  return (
    <div className="dashboard-page">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar" aria-label={`${TITLES[activeRole] || activeRole} navigation`}>
          <div className="dashboard-sidebar-header">
            <p className="dashboard-role-badge">{TITLES[activeRole] || activeRole}</p>
            <h3>{user?.name || 'Staff'}</h3>
            <p className="dashboard-sidebar-email">{user?.email}</p>
          </div>
          <nav className="dashboard-sidebar-nav">
            {links.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`dashboard-sidebar-link${isActive(item) ? ' active' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="dashboard-sidebar-footer">
            <Link to="/" className="dashboard-sidebar-link">View website</Link>
            <button type="button" className="dashboard-logout-btn" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </aside>
        <div className="dashboard-main">
          {title && (
            <div className="dashboard-header">
              <div>
                <h1>{title}</h1>
                <p className="dashboard-subtitle">Manage content that appears on the public website.</p>
              </div>
              <Link to="/" className="btn btn-secondary dashboard-header-link">Open site</Link>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
