import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Home from './pages/Home'
import About from './pages/About'
import Ministries from './pages/Ministries'
import Sermons from './pages/Sermons'
import SermonDetail from './pages/SermonDetail'
import WatchLive from './pages/WatchLive'
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
import MediaDashboard from './pages/media/Dashboard'
import SecretaryDashboard from './pages/secretary/Dashboard'
import MemberDashboard from './pages/member/Dashboard'

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

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
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="/give" element={<Giving />} />
      <Route path="/prayer" element={<Prayer />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/pastors" element={<Pastors />} />
      <Route path="/deacons" element={<Deacons />} />
      
      <Route 
        path="/admin/*" 
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/events/create" element={<ProtectedRoute allowedRoles={["admin"]}><AdminEventCreate /></ProtectedRoute>} />
      <Route path="/admin/sermons/create" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSermonsCreate /></ProtectedRoute>} />
      <Route path="/admin/enquiries" element={<ProtectedRoute allowedRoles={["admin"]}><AdminEnquiries /></ProtectedRoute>} />
      <Route path="/admin/giving" element={<ProtectedRoute allowedRoles={["admin"]}><AdminGiving /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminSettings /></ProtectedRoute>} />
      
      <Route 
        path="/media/*" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'media']}>
            <MediaDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/secretary/*" 
        element={
          <ProtectedRoute allowedRoles={['admin', 'secretary']}>
            <SecretaryDashboard />
          </ProtectedRoute>
        } 
      />
      
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
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
