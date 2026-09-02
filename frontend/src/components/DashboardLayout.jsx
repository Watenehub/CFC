import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canManage } from '../utils/permissions'
import '../styles/Dashboard.css'

const NAV = {
  admin: [
    { path: '/admin', label: 'Overview', exact: true },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/events/manage', label: 'Events Hub' },
    { path: '/admin/sermons/manage', label: 'Sermon Library' },
    { path: '/admin/giving', label: 'Giving Center' },
    { path: '/admin/enquiries', label: 'Enquiries' },
    { path: '/admin/settings', label: 'Settings' },
  ],
  media: [
    { path: '/media', label: 'Overview', exact: true },
    { path: '/admin/gallery', label: 'Gallery Studio' },
  ],
  secretary: [
    { path: '/secretary', label: 'Overview', exact: true },
    { path: '/contact', label: 'Contact page' },
    { path: '/give', label: 'Giving page' },
    { path: '/events', label: 'Events' },
  ],
  member: [
    { path: '/member', label: 'Overview', exact: true },
    { path: '/sermons', label: 'Sermons' },
    { path: '/events', label: 'Events' },
    { path: '/prayer', label: 'Prayer' },
    { path: '/give', label: 'Give' },
  ],
}

const TITLES = {
  admin: 'Admin',
  media: 'Media',
  secretary: 'Secretary',
  member: 'Member',
}

function DashboardLayout({ role, title, children }) {
  const { user } = useAuth()
  const location = useLocation()
  const activeRole = user?.role || role
  const managementLinks = [
        { path: '/admin/events/manage', label: 'Events Hub' },
        { path: '/admin/sermons/manage', label: 'Sermon Library' },
        { path: '/admin/giving', label: 'Giving Center' },
        { path: '/admin/ministries', label: 'Ministries' },
        { path: '/admin/pastors', label: 'Pastors' },
        { path: '/admin/deacons', label: 'Deacons' },
        { path: '/admin/gallery', label: 'Gallery Studio' },
      ].filter((item) => activeRole === 'admin' || canManage(user, {
        '/admin/events/manage': 'manage_events',
        '/admin/sermons/manage': 'manage_sermons',
        '/admin/giving': 'manage_giving',
        '/admin/ministries': 'manage_ministries',
        '/admin/pastors': 'manage_pastors',
        '/admin/deacons': 'manage_deacons',
        '/admin/gallery': 'manage_gallery',
      }[item.path]))
  const links = activeRole === 'admin' ? [...NAV.admin.slice(0, 2), ...managementLinks, ...NAV.admin.slice(5)] : [...(NAV[activeRole] || []), ...managementLinks]

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
