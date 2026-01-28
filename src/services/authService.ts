import type { LoginRequest, RegisterRequest, User } from '../types/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function loginUser(credentials: LoginRequest): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/login?_holidaze=true`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Login failed')
  }

  return json.data as User
}

export async function registerUser(userData: RegisterRequest): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Registration failed')
  }
}

export async function createApiKey(accessToken: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/auth/create-api-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ name: 'Holidaze App Key' }),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to create API key')
  }

  return json.data.key as string
}
