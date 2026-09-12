import { apiCall } from './client'

export const login = async (email, password) =>
  apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const register = async (userData) =>
  apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })

export const getCurrentUser = async () => apiCall('/api/auth/me')

export const logout = async () => apiCall('/api/auth/logout', { method: 'POST' })

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
