import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore auth state from localStorage on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('agrivision_token')
      const savedUser = localStorage.getItem('agrivision_user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error('Failed to restore auth state:', err)
      localStorage.removeItem('agrivision_token')
      localStorage.removeItem('agrivision_user')
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('agrivision_token', authToken)
    localStorage.setItem('agrivision_user', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('agrivision_token')
    localStorage.removeItem('agrivision_user')
  }

  const updateUser = (updatedUserData) => {
    const newUserData = { ...user, ...updatedUserData }
    setUser(newUserData)
    localStorage.setItem('agrivision_user', JSON.stringify(newUserData))
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
