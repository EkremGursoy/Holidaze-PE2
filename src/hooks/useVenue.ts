import { useEffect, useState } from 'react'
import type { Venue } from '../types/venue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type VenueResponse = {
  data: Venue & {
    owner?: {
      name: string
      email: string
      avatar?: { url: string; alt?: string }
    }
    bookings?: {
      id: string
      dateFrom: string
      dateTo: string
      guests: number
    }[]
  }
}

export type VenueWithDetails = VenueResponse['data']

export function useVenue(id: string | undefined) {
  const [venue, setVenue] = useState<VenueWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Venue ID is required')
      setLoading(false)
      return
    }

    ; (async () => {
      setLoading(true)
      setError(null)

      try {
        const url = `${API_BASE_URL}/holidaze/venues/${id}?_owner=true&_bookings=true`
        const response = await fetch(url)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Venue not found')
          }
          throw new Error('Failed to fetch venue')
        }

        const json = (await response.json()) as VenueResponse
        setVenue(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setVenue(null)
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  return { venue, loading, error }
}
