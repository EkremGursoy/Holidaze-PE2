import { createContext } from 'react'
import type { User } from '../types/auth'

export type AuthContextType = {
  user: User | null
  apiKey: string | null
  isAuthenticated: boolean
  isVenueManager: boolean
  login: (user: User) => Promise<void>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

export const AuthContext = createContext<AuthContextType | null>(null)
