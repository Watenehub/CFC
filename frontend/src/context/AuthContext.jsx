import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await authApi.getCurrentUser()
      setUser(response)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const response = await authApi.login(email, password)
    setUser(response.user)
    return response
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMedia: user?.role === 'media',
    isSecretary: user?.role === 'secretary',
    isMember: user?.role === 'member',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    return {
      user: null,
      loading: true,
      login: async () => ({}),
      logout: async () => ({}),
      checkAuth: async () => ({}),
      isAuthenticated: false,
      isAdmin: false,
      isMedia: false,
      isSecretary: false,
      isMember: false,
    }
  }

  return context
}
