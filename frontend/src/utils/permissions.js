export const ROLE_PERMISSIONS = {
  admin: [
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
  ],
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
}

export const ALL_PERMISSIONS = ROLE_PERMISSIONS.admin

export function permissionsForRole(role, permissions) {
  if (permissions?.length) return permissions
  return ROLE_PERMISSIONS[role] || []
}

export function canManage(user, permission) {
  if (!user) return false
  if (user.role === 'admin') return true
  return permissionsForRole(user.role, user.permissions).includes(permission)
}

export function managementRole(user) {
  return user?.role || 'admin'
}
