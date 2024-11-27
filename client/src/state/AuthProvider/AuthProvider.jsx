import axios from 'axios'
import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children, value = {} }) => {
  const [user, setUser] = useState(value.user || null)
  const [isLoading, setIsLoading] = useState(value.isLoading || true) // Allow overriding loading state

  useEffect(() => {
    if (!value.user) {
      // Only fetch from localStorage if not overridden in tests
      const storedUser = localStorage.getItem('me')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    }

    setIsLoading(false)
  }, [value.user])

  const login = async user => {
    setUser(user)
    localStorage.setItem('me', JSON.stringify(user))
  }

  const updateUser = async user => {
    const me = JSON.parse(localStorage.getItem('me') || '{}')

    try {
      // Fetch user data from the server
      const response = await axios.get(`/api/users/${user.user.id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })

      const data = { ...response.data } // Make a copy of the data
      delete data.password // Remove the password field if it exists
      me.user = data // Only store non-password data
      localStorage.setItem('me', JSON.stringify(me))
      setUser(me)
    } catch (error) {
      console.log(`Error fetching user: ${error}`)
    }
  }

  const logout = async () => {
    setUser(null)
    localStorage.removeItem('me')
  }

  return (
    <AuthContext.Provider value={{ login, logout, user, isLoading, updateUser, ...value }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthProvider
