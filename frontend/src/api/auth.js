const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  }

  const response = await fetch(url, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred')
  }

  return data
}

export const login = async (email, password) => {
  return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export const register = async (userData) => {
  return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const getCurrentUser = async () => {
  return apiCall('/api/auth/me')
}

export const logout = async () => {
  return apiCall('/api/auth/logout', { method: 'POST' })
}

export const getUsers = async () => {
  return apiCall('/api/auth/users')
}

export const createUser = async (userData) => {
  return apiCall('/api/auth/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  })
}

export const updateUser = async (userId, userData) => {
  return apiCall(`/api/auth/users/${userId}`, { method: 'PUT', body: JSON.stringify(userData) })
}

export const deleteUser = async (userId) => {
  return apiCall(`/api/auth/users/${userId}`, { method: 'DELETE' })
}
