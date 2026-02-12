import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import VenueGrid from '../components/venues/VenueGrid'
import VenueSearchHero from '../components/venues/VenueSearchHero'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import { useVenues } from '../hooks/useVenues'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') ?? ''
  const debouncedQuery = useDebouncedValue(searchQuery, 300)
  const { venues, loading, loadingMore, error, hasMore, loadMore } = useVenues(debouncedQuery)

  const setSearchQuery = useCallback(
    (value: string) => {
      setSearchParams(value ? { q: value } : {}, { replace: true })
    },
    [setSearchParams]
  )

  return (
    <div className="min-h-screen">
      <VenueSearchHero value={searchQuery} onChange={setSearchQuery} />

      <VenueGrid
        title={debouncedQuery ? `Search results for "${debouncedQuery}"` : 'Recently Added'}
        venues={venues}
        loading={loading}
        loadingMore={loadingMore}
        error={error}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  )
}

