import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const NAV = {
  admin: [
    { path: '/admin', label: 'Overview', exact: true, permission: null },
    { path: '/admin/users', label: 'Users', permission: 'manage_users' },
    { path: '/admin/events/manage', label: 'Events Hub', permission: 'manage_events' },
    { path: '/admin/sermons/manage', label: 'Sermon Library', permission: 'manage_sermons' },
    { path: '/admin/giving', label: 'Giving Center', permission: 'manage_giving' },
    { path: '/admin/enquiries', label: 'Enquiries', permission: 'manage_enquiries' },
    { path: '/admin/ministries', label: 'Ministries', permission: 'manage_ministries' },
    { path: '/admin/pastors', label: 'Pastors', permission: 'manage_pastors' },
    { path: '/admin/deacons', label: 'Deacons', permission: 'manage_deacons' },
    { path: '/admin/gallery', label: 'Gallery Studio', permission: 'manage_gallery' },
    { path: '/admin/settings', label: 'Settings', permission: 'manage_users' },
  ],
  media: [
    { path: '/media', label: 'Overview', exact: true, permission: null },
    { path: '/admin/events/manage', label: 'Events Hub', permission: 'manage_events' },
    { path: '/admin/sermons/manage', label: 'Sermon Library', permission: 'manage_sermons' },
    { path: '/admin/gallery', label: 'Gallery Studio', permission: 'manage_gallery' },
  ],
  secretary: [
    { path: '/secretary', label: 'Overview', exact: true, permission: null },
    { path: '/admin/giving', label: 'Giving Center', permission: 'manage_giving' },
    { path: '/admin/enquiries', label: 'Enquiries', permission: 'manage_enquiries' },
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
  const { user, hasPermission } = useAuth()
  const location = useLocation()
  const activeRole = user?.role || role
  
  const links = NAV[activeRole]?.filter(item => 
    !item.permission || hasPermission(item.permission)
  ) || []

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  }

  return (
    <div className="dashboard-page">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar" aria-label={`${TITLES[activeRole] || activeRole} navigation`}>
          <div className="dashboard-sidebar-header">
            <h3>{TITLES[activeRole] || activeRole}</h3>
            <p>{user?.name}</p>
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
        </aside>
        <div className="dashboard-main">
          {title && (
            <div className="dashboard-header">
              <h1>{title}</h1>
              <p className="dashboard-subtitle">Signed in as {user?.name}</p>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
