import { useEffect, useState } from 'react'
import type { Venue, VenuesResponse } from '../types/venue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function useVenues(query: string) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ; (async () => {
      setLoading(true)
      setError(null)

      try {
        const url = query
          ? `${API_BASE_URL}/holidaze/venues/search?q=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/holidaze/venues`

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch venues')

        const json = (await response.json()) as VenuesResponse
        setVenues(json.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
        setVenues([])
      } finally {
        setLoading(false)
      }
    })()
  }, [query])

  return { venues, loading, error }
}
