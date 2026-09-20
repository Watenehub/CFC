import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { STAFF_ROLES, dashboardPath } from './utils/permissions'
import Home from './pages/Home'

const GivingDetail = lazy(() => import('./pages/GivingDetail'))
const About = lazy(() => import('./pages/About'))
const Ministries = lazy(() => import('./pages/Ministries'))
const Sermons = lazy(() => import('./pages/Sermons'))
const SermonDetail = lazy(() => import('./pages/SermonDetail'))
const WatchLive = lazy(() => import('./pages/WatchLive'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Events = lazy(() => import('./pages/Events'))
const EventDetail = lazy(() => import('./pages/EventDetail'))
const Giving = lazy(() => import('./pages/Giving'))
const Prayer = lazy(() => import('./pages/Prayer'))
const Contact = lazy(() => import('./pages/Contact'))
const Login = lazy(() => import('./pages/Login'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const Pastors = lazy(() => import('./pages/Pastors'))
const Deacons = lazy(() => import('./pages/Deacons'))
const Staff = lazy(() => import('./pages/Staff'))
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/Users'))
const AdminEventCreate = lazy(() => import('./pages/admin/EventsCreate'))
const AdminSermonsCreate = lazy(() => import('./pages/admin/SermonsCreate'))
const AdminEnquiries = lazy(() => import('./pages/admin/Enquiries'))
const AdminGiving = lazy(() => import('./pages/admin/Giving'))
const AdminSettings = lazy(() => import('./pages/admin/Settings'))
const AdminPeople = lazy(() => import('./pages/admin/PeopleManager'))
const GalleryManager = lazy(() => import('./pages/admin/GalleryManager'))
const AdminPrayer = lazy(() => import('./pages/admin/PrayerRequests'))
const AdminAnnouncements = lazy(() => import('./pages/admin/Announcements'))
const AdminServices = lazy(() => import('./pages/admin/Services'))
const MediaDashboard = lazy(() => import('./pages/media/Dashboard'))
const SecretaryDashboard = lazy(() => import('./pages/secretary/Dashboard'))
const MemberDashboard = lazy(() => import('./pages/member/Dashboard'))
const NotFound = lazy(() => import('./pages/NotFound'))

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

const staffRoles = STAFF_ROLES

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Suspense fallback={<div className="route-loading" role="status">Loading page...</div>}>
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
      <Route path="/give/:id" element={<GivingDetail />} />
      <Route path="/prayer" element={<Prayer />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/register" element={<Navigate to="/login" replace />} />
      <Route path="/pastors" element={<Pastors />} />
      <Route path="/deacons" element={<Deacons />} />
      <Route path="/staff" element={<Staff />} />

      <Route path="/admin" element={<ProtectedRoute allowedRoles={staffRoles}><AdminDashboard /></ProtectedRoute>} />
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

      <Route path="/media" element={<ProtectedRoute allowedRoles={staffRoles}><MediaDashboard /></ProtectedRoute>} />
      <Route path="/media/gallery" element={<Navigate to="/admin/gallery" replace />} />
      <Route path="/media/*" element={<Navigate to="/media" replace />} />

      <Route path="/secretary" element={<ProtectedRoute allowedRoles={staffRoles}><SecretaryDashboard /></ProtectedRoute>} />
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
          user ? <Navigate to={dashboardPath(user.role)} replace /> :
          <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes
