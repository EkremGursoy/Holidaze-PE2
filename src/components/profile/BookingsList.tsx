import { Link } from 'react-router'
import type { ProfileBooking } from '../../services/profileService'

type BookingsListProps = {
  bookings: ProfileBooking[]
  loading: boolean
}

export default function BookingsList({ bookings, loading }: BookingsListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-8">
        <h2 className="text-xl font-bold text-stone-800 mb-6">My Bookings</h2>
        <div className="flex justify-center py-8">
          <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  // Filter upcoming bookings (dateFrom >= today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingBookings = bookings
    .filter((booking) => new Date(booking.dateFrom) >= today)
    .sort((a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime())

  const pastBookings = bookings
    .filter((booking) => new Date(booking.dateFrom) < today)
    .sort((a, b) => new Date(b.dateFrom).getTime() - new Date(a.dateFrom).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const BookingCard = ({ booking, isPast }: { booking: ProfileBooking; isPast?: boolean }) => (
    <Link
      to={`/venue/${booking.venue.id}`}
      className={`flex gap-4 p-4 rounded-2xl border transition-all hover:shadow-md ${isPast
        ? 'border-stone-200 bg-stone-50 opacity-75'
        : 'border-stone-100 bg-white hover:border-orange-200'
        }`}
    >
      <img
        src={booking.venue.media?.[0]?.url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop'}
        alt={booking.venue.name}
        className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop'
        }}
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-stone-800 truncate">{booking.venue.name}</h3>
        <p className="text-sm text-stone-500 mt-1">
          {formatDate(booking.dateFrom)} - {formatDate(booking.dateTo)}
        </p>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span className="text-stone-600">
            {booking.guests} guest{booking.guests !== 1 ? 's' : ''}
          </span>
          <span className="text-orange-600 font-semibold">
            ${booking.venue.price}/night
          </span>
        </div>
      </div>
      {!isPast && (
        <div className="hidden sm:flex items-center">
          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
            Upcoming
          </span>
        </div>
      )}
    </Link>
  )

  return (
    <div className="bg-white rounded-3xl border border-stone-100 p-6 md:p-8">
      <h2 className="text-xl font-bold text-stone-800 mb-6">My Bookings</h2>

      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-stone-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-stone-700 mb-2">No bookings yet</h3>
          <p className="text-stone-500 mb-6">Start exploring venues and make your first booking!</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Explore Venues
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Upcoming Bookings - shown first and prominently */}
          {upcomingBookings.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-orange-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Upcoming ({upcomingBookings.length})
              </h3>
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 bg-stone-50 rounded-2xl">
              <p className="text-stone-500">No upcoming bookings</p>
              <Link to="/" className="text-orange-600 font-semibold text-sm hover:text-orange-700 mt-1 inline-block">
                Browse Venues
              </Link>
            </div>
          )}

          {/* Past Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-4">
                Past ({pastBookings.length})
              </h3>
              <div className="space-y-3">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} isPast />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
