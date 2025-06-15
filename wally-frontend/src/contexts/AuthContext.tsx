import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token and get user info
      // For now, we'll set a mock user
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://via.placeholder.com/40'
      })
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Implement login logic
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email,
      avatar: 'https://via.placeholder.com/40'
    }
    setUser(mockUser)
    localStorage.setItem('authToken', 'mock-token')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
  }

  const register = async (name: string, email: string, password: string) => {
    // Implement registration logic
    const mockUser = {
      id: '1',
      name,
      email,
      avatar: 'https://via.placeholder.com/40'
    }
    setUser(mockUser)
    localStorage.setItem('authToken', 'mock-token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
