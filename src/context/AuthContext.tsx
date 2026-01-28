import { useState, type ReactNode } from 'react'
import type { User } from '../types/auth'
import { createApiKey } from '../services/authService'
import { AuthContext } from './authContextDef'

const STORAGE_USER = 'holidaze_user'
const STORAGE_API_KEY = 'holidaze_api_key'

function getStoredUser(): User | null {
  const stored = localStorage.getItem(STORAGE_USER)
  if (stored) {
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  }
  return null
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser)
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem(STORAGE_API_KEY))

  const login = async (userData: User) => {
    setUser(userData)
    localStorage.setItem(STORAGE_USER, JSON.stringify(userData))

    // Create API key if we don't have one yet
    const existingKey = localStorage.getItem(STORAGE_API_KEY)
    if (!existingKey) {
      try {
        const newKey = await createApiKey(userData.accessToken)
        setApiKey(newKey)
        localStorage.setItem(STORAGE_API_KEY, newKey)
      } catch (error) {
        console.error('Failed to create API key:', error)
      }
    } else {
      setApiKey(existingKey)
    }
  }

  const logout = () => {
    setUser(null)
    setApiKey(null)
    localStorage.removeItem(STORAGE_USER)
    localStorage.removeItem(STORAGE_API_KEY)
  }

  const value = {
    user,
    apiKey,
    isAuthenticated: user !== null,
    isVenueManager: user?.venueManager ?? false,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
