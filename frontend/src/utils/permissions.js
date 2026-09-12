export const ALL_PERMISSIONS = [
  'manage_users',
  'manage_events',
  'manage_sermons',
  'manage_giving',
  'manage_enquiries',
  'manage_ministries',
  'manage_pastors',
  'manage_deacons',
  'manage_gallery',
  'manage_services',
  'manage_notifications',
]

export const ROLE_PERMISSIONS = {
  admin: [...ALL_PERMISSIONS],
  media: [
    'manage_events',
    'manage_sermons',
    'manage_gallery',
    'manage_notifications',
  ],
  secretary: [
    'manage_giving',
    'manage_enquiries',
    'manage_services',
  ],
  guest: [],
}

export const STAFF_ROLES = ['admin', 'media', 'secretary', 'guest']

export function permissionsForRole(role, permissions) {
  if (Array.isArray(permissions)) return permissions
  return ROLE_PERMISSIONS[role] || []
}

export function canManage(user, permission) {
  if (!user) return false
  if (user.role === 'admin') return true
  return permissionsForRole(user.role, user.permissions).includes(permission)
}

export function dashboardPath(role) {
  if (role === 'media') return '/media'
  if (role === 'secretary') return '/secretary'
  if (role === 'member') return '/member'
  if (STAFF_ROLES.includes(role)) return '/admin'
  return '/login'
}

export function permissionLabel(permission) {
  return permission.replace('manage_', '').replace(/_/g, ' ')
}
