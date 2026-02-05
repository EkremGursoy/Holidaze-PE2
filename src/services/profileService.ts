const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type ProfileUpdateData = {
  bio?: string
  avatar?: { url: string; alt?: string }
  banner?: { url: string; alt?: string }
  venueManager?: boolean
}

export type Profile = {
  name: string
  email: string
  bio?: string
  avatar: { url: string; alt: string }
  banner: { url: string; alt: string }
  venueManager: boolean
  _count: { venues: number; bookings: number }
}

export type ProfileBooking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
  created: string
  venue: {
    id: string
    name: string
    media: { url: string; alt?: string }[]
    price: number
  }
}

export async function getProfile(
  name: string,
  accessToken: string,
  apiKey: string
): Promise<Profile> {
  const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${name}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Noroff-API-Key': apiKey,
    },
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to fetch profile')
  }

  return json.data as Profile
}

export async function updateProfile(
  name: string,
  data: ProfileUpdateData,
  accessToken: string,
  apiKey: string
): Promise<Profile> {
  const response = await fetch(`${API_BASE_URL}/holidaze/profiles/${name}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to update profile')
  }

  return json.data as Profile
}

export async function getProfileBookings(
  name: string,
  accessToken: string,
  apiKey: string
): Promise<ProfileBooking[]> {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${name}/bookings?_venue=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
      },
    }
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to fetch bookings')
  }

  return json.data as ProfileBooking[]
}

export type ProfileVenue = {
  id: string
  name: string
  description: string
  media: { url: string; alt?: string }[]
  price: number
  maxGuests: number
  rating: number
  created: string
  updated: string
  meta: {
    wifi: boolean
    parking: boolean
    breakfast: boolean
    pets: boolean
  }
  location: {
    address?: string
    city?: string
    zip?: string
    country?: string
    continent?: string
    lat?: number
    lng?: number
  }
  _count: {
    bookings: number
  }
}

export async function getProfileVenues(
  name: string,
  accessToken: string,
  apiKey: string
): Promise<ProfileVenue[]> {
  const response = await fetch(
    `${API_BASE_URL}/holidaze/profiles/${name}/venues?_bookings=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
      },
    }
  )

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to fetch venues')
  }

  return json.data as ProfileVenue[]
}
