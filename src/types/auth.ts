export type User = {
  name: string
  email: string
  avatar: { url: string; alt: string }
  banner: { url: string; alt: string }
  accessToken: string
  venueManager: boolean
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  name: string
  email: string
  password: string
  venueManager?: boolean
}
