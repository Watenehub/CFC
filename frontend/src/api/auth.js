import { apiCall } from './client'

export const login = async (email, password) => {
  const result = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  // resetCsrfToken() - CSRF disabled temporarily
  return result
}

export const register = async (userData) =>
  apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

export const getCurrentUser = async () => apiCall('/api/auth/me')

export const logout = async () => {
  const result = await apiCall('/api/auth/logout', { method: 'POST' })
  // resetCsrfToken() - CSRF disabled temporarily
  return result
}

export const getUsers = async () => apiCall('/api/auth/users')

export const createUser = async (userData) =>
  apiCall('/api/auth/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

export const updateUser = async (userId, userData) =>
  apiCall(`/api/auth/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) })

export const deleteUser = async (userId) =>
  apiCall(`/api/auth/users/${userId}`, { method: 'DELETE' })

export const changePassword = async (oldPassword, newPassword) =>
  apiCall('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
  })

export const requestPasswordReset = async (email) =>
  apiCall('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })

export const resetPassword = async (token, newPassword) =>
  apiCall('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, new_password: newPassword }),
  })
