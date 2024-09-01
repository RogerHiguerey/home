import { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import authService from '../services/authService'

export const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = async (username, password) => {
    try {
      const success = await authService.login(username, password)
      setIsAuthenticated(success)
      return success
    } catch {
      return false
    }
  }

  const logout = () => {
    authService.logout()
    setIsAuthenticated(false)
  }

  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true'
    setIsAuthenticated(storedAuth)
  }, [])

  useEffect(() => {
    localStorage.setItem('isAuthenticated', String(isAuthenticated))
  }, [isAuthenticated])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}
