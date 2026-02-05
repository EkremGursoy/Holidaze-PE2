import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { createBooking } from '../../services/venueService'

type ExistingBooking = {
  id: string
  dateFrom: string
  dateTo: string
  guests: number
}

type BookingCardProps = {
  venueId: string
  price: number
  maxGuests: number
  isAuthenticated: boolean
  bookings?: ExistingBooking[]
}

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, nights)
}

/**
 * Check if a date range overlaps with any existing bookings
 */
function hasDateConflict(checkIn: string, checkOut: string, bookings: ExistingBooking[]): boolean {
  if (!checkIn || !checkOut || bookings.length === 0) return false

  const newStart = new Date(checkIn).getTime()
  const newEnd = new Date(checkOut).getTime()

  return bookings.some((booking) => {
    const existingStart = new Date(booking.dateFrom).getTime()
    const existingEnd = new Date(booking.dateTo).getTime()
    // Overlap: newStart < existingEnd AND newEnd > existingStart
    return newStart < existingEnd && newEnd > existingStart
  })
}

export default function BookingCard({ venueId, price, maxGuests, isAuthenticated, bookings = [] }: BookingCardProps) {
  const { user, apiKey } = useAuth()
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const nights = calculateNights(checkIn, checkOut)
  const total = price * nights
  const today = new Date().toISOString().split('T')[0]
  const dateConflict = hasDateConflict(checkIn, checkOut, bookings)
  const canBook = checkIn && checkOut && nights > 0 && !dateConflict

  const handleBook = async () => {
    if (!canBook || !user?.accessToken || !apiKey) return

    setIsBooking(true)
    setBookingError('')
    setBookingSuccess(false)

    try {
      await createBooking(
        {
          dateFrom: new Date(checkIn).toISOString(),
          dateTo: new Date(checkOut).toISOString(),
          guests,
          venueId,
        },
        user.accessToken,
        apiKey
      )
      setBookingSuccess(true)
      setCheckIn('')
      setCheckOut('')
      setGuests(1)
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Failed to create booking')
    } finally {
      setIsBooking(false)
    }
  }

  return (
    <div className="lg:sticky lg:top-24 bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 p-6">
      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-black text-stone-800">${price}</span>
        <span className="text-stone-500">/night</span>
      </div>

      {/* Date & Guest Inputs */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="check-in" className="block text-sm font-semibold text-stone-700 mb-2">
              Check-in
            </label>
            <input
              id="check-in"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="w-full px-4 py-3 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all"
            />
          </div>
          <div>
            <label htmlFor="check-out" className="block text-sm font-semibold text-stone-700 mb-2">
              Check-out
            </label>
            <input
              id="check-out"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="w-full px-4 py-3 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all"
            />
          </div>
        </div>

        <div>
          <label htmlFor="guests-select" className="block text-sm font-semibold text-stone-700 mb-2">
            Guests
          </label>
          <select
            id="guests-select"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all"
          >
            {Array.from({ length: Math.max(1, maxGuests) }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-stone-100 pt-4 mb-6">
        <div className="flex items-center justify-between text-stone-600 mb-2">
          <span>Max guests</span>
          <span className="font-semibold">{maxGuests}</span>
        </div>
        {canBook && (
          <div className="flex items-center justify-between text-lg font-bold text-stone-800 mt-4 pt-4 border-t border-stone-100">
            <span>Total ({nights} {nights === 1 ? 'night' : 'nights'})</span>
            <span className="text-orange-600">${total}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      {isAuthenticated ? (
        <div>
          {bookingSuccess && (
            <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
              Booking confirmed! Check your profile for details.
            </div>
          )}
          {bookingError && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {bookingError}
            </div>
          )}
          {dateConflict && (
            <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm">
              Selected dates overlap with an existing booking. Please choose different dates.
            </div>
          )}
          <button
            onClick={handleBook}
            disabled={!canBook || isBooking}
            className="w-full py-4 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={canBook ? 'Book this venue' : 'Select check-in and check-out dates to book'}
          >
            {isBooking ? 'Booking...' : 'Book Now'}
          </button>
          {!canBook && <p className="text-xs text-stone-400 mt-2 text-center">Select dates to continue</p>}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-stone-500 mb-4">Sign in to book this venue</p>
          <Link
            to="/login"
            className="block w-full py-4 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 text-center"
          >
            Sign in
          </Link>
        </div>
      )}
    </div>
  )
}
