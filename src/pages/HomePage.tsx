import { useState } from 'react'
import VenueGrid from '../components/venues/VenueGrid'
import VenueSearchHero from '../components/venues/VenueSearchHero'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useVenues } from '../hooks/useVenues'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedQuery = useDebouncedValue(searchQuery, 300)
  const { venues, loading, error } = useVenues(debouncedQuery)

  return (
    <div className="min-h-screen">
      <VenueSearchHero value={searchQuery} onChange={setSearchQuery} />

      <VenueGrid
        title={debouncedQuery ? `Search results for "${debouncedQuery}"` : 'All Venues'}
        venues={venues}
        loading={loading}
        error={error}
      />
    </div>
  )
}

