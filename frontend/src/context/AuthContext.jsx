import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { id, username, role: "teacher" }

  useEffect(() => {
    // On app load, check if user is logged in (could add a check endpoint if needed)
    // For now, assume session persists
  }, [])

  const login = (data) => {
    setUser({ ...data.teacher, role: 'teacher' })
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
