import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Ministries from './pages/Ministries'
import Sermons from './pages/Sermons'
import SermonDetail from './pages/SermonDetail'
import WatchLive from './pages/WatchLive'
import Gallery from './pages/Gallery'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import Giving from './pages/Giving'
import Prayer from './pages/Prayer'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Pastors from './pages/Pastors'
import Deacons from './pages/Deacons'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminEventCreate from './pages/admin/EventsCreate'
import AdminSermonsCreate from './pages/admin/SermonsCreate'
import AdminEnquiries from './pages/admin/Enquiries'
import AdminGiving from './pages/admin/Giving'
import AdminSettings from './pages/admin/Settings'
import AdminPeople from './pages/admin/PeopleManager'
import GalleryManager from './pages/admin/GalleryManager'
import AdminPrayer from './pages/admin/PrayerRequests'
import AdminAnnouncements from './pages/admin/Announcements'
import AdminServices from './pages/admin/Services'
import MediaDashboard from './pages/media/Dashboard'
import SecretaryDashboard from './pages/secretary/Dashboard'
import MemberDashboard from './pages/member/Dashboard'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children, allowedRoles, permission }) {
  const { user, loading, hasPermission } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

const staffRoles = ['admin', 'media', 'secretary']

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/ministries" element={<Ministries />} />
      <Route path="/sermons" element={<Sermons />} />
      <Route path="/sermons/:id" element={<SermonDetail />} />
      <Route path="/watch-live" element={<WatchLive />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/give" element={<Giving />} />
      <Route path="/prayer" element={<Prayer />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/pastors" element={<Pastors />} />
      <Route path="/deacons" element={<Deacons />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/events/create" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_events"><AdminEventCreate /></ProtectedRoute>} />
      <Route path="/admin/events/manage" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_events"><AdminEventCreate /></ProtectedRoute>} />
      <Route path="/admin/sermons/create" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_sermons"><AdminSermonsCreate /></ProtectedRoute>} />
      <Route path="/admin/sermons/manage" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_sermons"><AdminSermonsCreate /></ProtectedRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_enquiries"><AdminEnquiries /></ProtectedRoute>} />
      <Route path="/admin/prayer" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_enquiries"><AdminPrayer /></ProtectedRoute>} />
      <Route path="/admin/giving" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_giving"><AdminGiving /></ProtectedRoute>} />
      <Route path="/admin/announcements" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_notifications"><AdminAnnouncements /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_services"><AdminServices /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/ministries" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_ministries"><AdminPeople type="ministries" /></ProtectedRoute>} />
      <Route path="/admin/pastors" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_pastors"><AdminPeople type="pastors" /></ProtectedRoute>} />
      <Route path="/admin/deacons" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_deacons"><AdminPeople type="deacons" /></ProtectedRoute>} />
      <Route path="/admin/gallery" element={<ProtectedRoute allowedRoles={staffRoles} permission="manage_gallery"><GalleryManager /></ProtectedRoute>} />

      <Route path="/media" element={<ProtectedRoute allowedRoles={['admin', 'media']}><MediaDashboard /></ProtectedRoute>} />
      <Route path="/media/gallery" element={<Navigate to="/admin/gallery" replace />} />
      <Route path="/media/*" element={<Navigate to="/media" replace />} />

      <Route path="/secretary" element={<ProtectedRoute allowedRoles={['admin', 'secretary']}><SecretaryDashboard /></ProtectedRoute>} />
      <Route path="/secretary/*" element={<Navigate to="/secretary" replace />} />

      <Route
        path="/member/*"
        element={
          <ProtectedRoute allowedRoles={['admin', 'media', 'secretary', 'member']}>
            <MemberDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          user?.role === 'admin' ? <Navigate to="/admin" replace /> :
          user?.role === 'media' ? <Navigate to="/media" replace /> :
          user?.role === 'secretary' ? <Navigate to="/secretary" replace /> :
          user?.role === 'member' ? <Navigate to="/member" replace /> :
          <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
