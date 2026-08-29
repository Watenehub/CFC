import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css'

const NAV = {
  admin: [
    { path: '/admin', label: 'Overview', exact: true },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/events/create', label: 'Create Event' },
    { path: '/admin/sermons/create', label: 'Add Sermon' },
    { path: '/admin/enquiries', label: 'Enquiries' },
    { path: '/admin/giving', label: 'Giving' },
    { path: '/admin/settings', label: 'Settings' },
  ],
  media: [
    { path: '/media', label: 'Overview', exact: true },
    { path: '/media/gallery', label: 'Gallery' },
    { path: '/sermons', label: 'Sermons' },
    { path: '/watch-live', label: 'Watch Live' },
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
  const links = NAV[role] || []

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path
    return location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  }

  return (
    <div className="dashboard-page">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar" aria-label={`${TITLES[role] || role} navigation`}>
          <div className="dashboard-sidebar-header">
            <h3>{TITLES[role] || role}</h3>
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
