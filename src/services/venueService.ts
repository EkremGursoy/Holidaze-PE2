const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export type VenueFormData = {
  name: string
  description: string
  media?: { url: string; alt?: string }[]
  price: number
  maxGuests: number
  rating?: number
  meta?: {
    wifi?: boolean
    parking?: boolean
    breakfast?: boolean
    pets?: boolean
  }
  location?: {
    address?: string
    city?: string
    zip?: string
    country?: string
  }
}

export async function createVenue(data: VenueFormData, accessToken: string, apiKey: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-Noroff-API-Key': apiKey,
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()

  if (!response.ok) {
    throw new Error(json.errors?.[0]?.message || 'Failed to create venue')
  }

  return json.data.id as string
}

export async function updateVenue(id: string, data: Partial<VenueFormData>, accessToken: string, apiKey: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
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
    throw new Error(json.errors?.[0]?.message || 'Failed to update venue')
  }
}

export async function deleteVenue(id: string, accessToken: string, apiKey: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/holidaze/venues/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Noroff-API-Key': apiKey,
    },
  })

  if (!response.ok) {
    const json = await response.json()
    throw new Error(json.errors?.[0]?.message || 'Failed to delete venue')
  }
}
