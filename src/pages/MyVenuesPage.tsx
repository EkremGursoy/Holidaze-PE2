import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import AccessRestricted from '../components/ui/AccessRestricted'
import { useAuth } from '../hooks/useAuth'
import {
  getProfileVenues,
  type ProfileVenue,
} from '../services/profileService'
import { deleteVenue } from '../services/venueService'

export default function MyVenuesPage() {
  const { user, apiKey, isAuthenticated, isVenueManager } = useAuth()
  const [venues, setVenues] = useState<ProfileVenue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.accessToken || !apiKey || !user?.name) return

    const fetchVenues = async () => {
      try {
        const data = await getProfileVenues(user.name, user.accessToken, apiKey)
        setVenues(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load venues')
      } finally {
        setLoading(false)
      }
    }

    fetchVenues()
  }, [user, apiKey])

  const handleDelete = async (id: string, name: string) => {
    if (!user?.accessToken || !apiKey) return

    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setDeletingId(id)
    try {
      await deleteVenue(id, user.accessToken, apiKey)
      setVenues((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete venue')
    } finally {
      setDeletingId(null)
    }
  }

  // Access restriction - Must be logged in
  if (!isAuthenticated) {
    return <AccessRestricted message="You must be logged in to view your venues." />
  }

  // Access restriction - Must be venue manager
  if (!isVenueManager) {
    return (
      <AccessRestricted
        message="You must be a venue manager to access this page."
        linkText="Upgrade to Venue Manager"
        linkTo="/profile"
      />
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-2xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Failed to load venues</h2>
          <p className="mb-6">{error}</p>
          <Link to="/profile" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
            Back to Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <Link to="/profile" className="inline-flex items-center text-stone-600 hover:text-orange-600 font-medium mb-2 transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">My Venues</h1>
          <p className="text-stone-500 mt-1">Manage your listed properties</p>
        </div>
        <Link
          to="/create-venue"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Venue
        </Link>
      </div>

      {/* Venues Grid */}
      {venues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-100 p-12 text-center">
          <svg className="w-20 h-20 mx-auto text-stone-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <h2 className="text-2xl font-bold text-stone-800 mb-2">No venues yet</h2>
          <p className="text-stone-500 mb-8 max-w-md mx-auto">
            Start earning by listing your first property. It only takes a few minutes!
          </p>
          <Link
            to="/create-venue"
            className="inline-flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/30"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Venue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard
              key={venue.id}
              venue={venue}
              onDelete={handleDelete}
              isDeleting={deletingId === venue.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type VenueCardProps = {
  venue: ProfileVenue
  onDelete: (id: string, name: string) => void
  isDeleting: boolean
}

function VenueCard({ venue, onDelete, isDeleting }: VenueCardProps) {
  const imageUrl = venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop'
  const location = [venue.location?.city, venue.location?.country].filter(Boolean).join(', ')

  return (
    <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden shadow-lg shadow-orange-100/30 hover:shadow-xl transition-shadow">
      {/* Image */}
      <Link to={`/venue/${venue.id}`} className="block relative aspect-video">
        <img
          src={imageUrl}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&auto=format&fit=crop'
          }}
        />
        {/* Bookings Badge */}
        <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full">
          <span className="text-sm font-semibold text-stone-700">
            {venue._count.bookings} booking{venue._count.bookings !== 1 ? 's' : ''}
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link to={`/venue/${venue.id}`}>
          <h3 className="font-bold text-lg text-stone-800 hover:text-orange-600 transition-colors truncate">
            {venue.name}
          </h3>
        </Link>

        {location && (
          <p className="text-stone-500 text-sm mt-1 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {location}
          </p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-orange-600 font-bold">${venue.price}/night</span>
            <span className="text-stone-500">{venue.maxGuests} guests</span>
          </div>

          {/* Rating */}
          {venue.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <svg className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium text-stone-700">{venue.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/update-venue/${venue.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </Link>
          <button
            onClick={() => onDelete(venue.id, venue.name)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
