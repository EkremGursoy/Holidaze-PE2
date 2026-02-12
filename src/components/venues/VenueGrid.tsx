import { useCallback, useRef } from 'react'
import type { Venue } from '../../types/venue'
import VenueCard from './VenueCard'

type VenueGridProps = {
  title: string
  venues: Venue[]
  loading: boolean
  loadingMore: boolean
  error: string | null
  hasMore: boolean
  onLoadMore: () => void
}

export default function VenueGrid({ title, venues, loading, loadingMore, error, hasMore, onLoadMore }: VenueGridProps) {
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Callback ref — attaches / detaches the IntersectionObserver when the sentinel mounts/unmounts
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      observerRef.current?.disconnect()

      if (!node) return

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) onLoadMore()
        },
        { rootMargin: '200px' }
      )

      observerRef.current.observe(node)
    },
    [onLoadMore]
  )

  return (
    <section>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800 tracking-tight">{title}</h2>
        {venues.length > 0 && (
          <span className="text-stone-500 font-medium bg-white px-3 py-1 rounded-full border border-stone-200 text-sm">
            {venues.length} {venues.length === 1 ? 'venue' : 'venues'}
          </span>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-32">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl mb-6">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {!loading && !error && venues.length === 0 && (
        <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-stone-300">
          <svg className="w-16 h-16 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-xl font-semibold text-stone-600 mb-2">No venues found</h3>
          <p className="text-stone-500">Try adjusting your search criteria</p>
        </div>
      )}

      {!loading && !error && venues.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>

          {/* Infinite scroll sentinel */}
          <div ref={sentinelRef} className="py-8">
            {loadingMore && (
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
              </div>
            )}
            {!hasMore && venues.length > 0 && (
              <p className="text-center text-stone-400 text-sm">You&apos;ve seen all venues</p>
            )}
          </div>
        </>
      )}
    </section>
  )
}
