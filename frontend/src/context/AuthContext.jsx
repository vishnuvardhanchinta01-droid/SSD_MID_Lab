import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../api/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // { id, username, role: "teacher" }
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    // On app load, check if user is logged in
    const checkAuth = async () => {
      try {
        const result = await authAPI.getCurrentTeacher();
        setUser({ ...result.teacher, role: 'teacher' });
      } catch (error) {
        // User is not authenticated, that's fine
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
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
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
