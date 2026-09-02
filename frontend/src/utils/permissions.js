import { readSiteContent } from '../data/siteContent'

export function canManage(user, permission) {
  if (!user) return false
  if (user.role === 'admin') return true
  if (user.permissions?.includes(permission)) return true
  const managedUser = readSiteContent().users.find((item) => item.email === user.email)
  return managedUser?.permissions?.includes(permission) || false
}

export function managementRole(user) {
  return user?.role || 'admin'
}
