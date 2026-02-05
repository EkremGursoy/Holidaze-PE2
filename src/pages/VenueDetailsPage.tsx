import { Link, useParams } from 'react-router'
import BookingCard from '../components/booking/BookingCard'
import VenueAmenities from '../components/venues/VenueAmenities'
import VenueImageGallery from '../components/venues/VenueImageGallery'
import { useAuth } from '../hooks/useAuth'
import { useVenue } from '../hooks/useVenue'

export default function VenueDetailsPage() {
  const { id } = useParams()
  const { venue, loading, error } = useVenue(id)
  const { isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !venue) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-2xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Venue not found</h2>
          <p className="mb-6">{error || 'The venue you are looking for does not exist.'}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const location = [venue.location?.city, venue.location?.country].filter(Boolean).join(', ') || 'Location not specified'

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-stone-600 hover:text-orange-600 font-medium mb-6 transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to venues
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          <VenueImageGallery images={venue.media} venueName={venue.name} />

          {/* Venue Info Card */}
          <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-black text-stone-800 tracking-tight mb-2">{venue.name}</h1>
                <p className="text-stone-500 flex items-center">
                  <svg className="w-5 h-5 mr-1.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {location}
                </p>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-full">
                <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-orange-600">{venue.rating.toFixed(1)}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-lg font-bold text-stone-800 mb-3">About this venue</h2>
              <p className="text-stone-600 leading-relaxed whitespace-pre-line">
                {venue.description || 'No description provided.'}
              </p>
            </div>

            {/* Amenities */}
            <VenueAmenities meta={venue.meta} />

            {/* Owner */}
            {venue.owner && (
              <div className="border-t border-stone-100 pt-6">
                <h2 className="text-lg font-bold text-stone-800 mb-4">Hosted by</h2>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-orange-100 overflow-hidden">
                    {venue.owner.avatar?.url ? (
                      <img src={venue.owner.avatar.url} alt={venue.owner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-600 font-bold text-xl">
                        {venue.owner.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">{venue.owner.name}</p>
                    <p className="text-sm text-stone-500">{venue.owner.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <BookingCard venueId={venue.id} price={venue.price} maxGuests={venue.maxGuests} isAuthenticated={isAuthenticated} bookings={venue.bookings} />
        </div>
      </div>
    </div>
  )
}
