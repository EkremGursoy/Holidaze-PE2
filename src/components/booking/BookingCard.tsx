import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { createBooking } from '../../services/venueService'
import AvailabilityCalendar from './AvailabilityCalendar'

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
  onBookingComplete?: () => void
}

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, nights)
}

/**
 * Parse a date string into a YYYY-MM-DD string, handling both
 * date-only inputs ("2026-02-15") and ISO datetime strings from the API.
 * Uses UTC methods to avoid timezone shifts.
 */
function toDateString(dateStr: string): string {
  // For date-only strings (YYYY-MM-DD) from <input type="date">, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  // For ISO datetime strings from the API, extract UTC date components
  const d = new Date(dateStr)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Get all individual dates within a booking range as YYYY-MM-DD strings.
 * The checkout date itself is excluded (guests leave that day, so new guests can arrive).
 */
function getBookedDateSet(bookings: ExistingBooking[]): Set<string> {
  const booked = new Set<string>()
  for (const booking of bookings) {
    const start = new Date(toDateString(booking.dateFrom) + 'T00:00:00Z')
    const end = new Date(toDateString(booking.dateTo) + 'T00:00:00Z')
    const current = new Date(start)
    while (current < end) {
      const y = current.getUTCFullYear()
      const m = String(current.getUTCMonth() + 1).padStart(2, '0')
      const d = String(current.getUTCDate()).padStart(2, '0')
      booked.add(`${y}-${m}-${d}`)
      current.setUTCDate(current.getUTCDate() + 1)
    }
  }
  return booked
}

/**
 * Check if a date range overlaps with any existing bookings.
 * Uses date-string comparison to prevent timezone-related false positives.
 */
function hasDateConflict(checkIn: string, checkOut: string, bookings: ExistingBooking[]): boolean {
  if (!checkIn || !checkOut || bookings.length === 0) return false

  const bookedDates = getBookedDateSet(bookings)
  // Check each day from checkIn to (checkOut - 1 day)
  const start = new Date(checkIn + 'T00:00:00Z')
  const end = new Date(checkOut + 'T00:00:00Z')
  const current = new Date(start)
  while (current < end) {
    const y = current.getUTCFullYear()
    const m = String(current.getUTCMonth() + 1).padStart(2, '0')
    const d = String(current.getUTCDate()).padStart(2, '0')
    if (bookedDates.has(`${y}-${m}-${d}`)) return true
    current.setUTCDate(current.getUTCDate() + 1)
  }
  return false
}

export default function BookingCard({ venueId, price, maxGuests, isAuthenticated, bookings = [], onBookingComplete }: BookingCardProps) {
  const { user, apiKey, isVenueManager } = useAuth()
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [isBooking, setIsBooking] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)

  const bookedDates = useMemo(() => getBookedDateSet(bookings), [bookings])

  const nights = calculateNights(checkIn, checkOut)
  const total = price * nights
  const dateConflict = hasDateConflict(checkIn, checkOut, bookings)
  const canBook = checkIn && checkOut && nights > 0 && !dateConflict

  const handleDateSelect = (date: string) => {
    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(date)
      setCheckOut('')
    } else {
      // Complete selection
      if (date <= checkIn) {
        setCheckIn(date)
        setCheckOut('')
      } else {
        // Check if any date in the range is booked
        const rangeConflict = hasDateConflict(checkIn, date, bookings)
        if (rangeConflict) {
          // Restart with selected date
          setCheckIn(date)
          setCheckOut('')
        } else {
          setCheckOut(date)
        }
      }
    }
  }

  const handleBook = async () => {
    if (!canBook || !user?.accessToken || !apiKey) return

    setIsBooking(true)
    setBookingError('')
    setBookingSuccess(false)

    try {
      const [ciYear, ciMonth, ciDay] = checkIn.split('-').map(Number)
      const [coYear, coMonth, coDay] = checkOut.split('-').map(Number)

      await createBooking(
        {
          dateFrom: new Date(Date.UTC(ciYear, ciMonth - 1, ciDay)).toISOString(),
          dateTo: new Date(Date.UTC(coYear, coMonth - 1, coDay)).toISOString(),
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
      onBookingComplete?.()
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

      {/* Availability Calendar */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-stone-700 mb-3">Availability</h3>
        <AvailabilityCalendar
          bookedDates={bookedDates}
          checkIn={checkIn}
          checkOut={checkOut}
          onSelectDate={handleDateSelect}
        />
      </div>

      {/* Selected Dates Display */}
      {(checkIn || checkOut) && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 mb-1">Check-in</p>
            <p className="text-sm font-bold text-stone-800">
              {checkIn ? new Date(checkIn + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
            <p className="text-xs font-semibold text-stone-500 mb-1">Check-out</p>
            <p className="text-sm font-bold text-stone-800">
              {checkOut ? new Date(checkOut + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Booking Controls - only for customers, not venue managers */}
      {isAuthenticated && !isVenueManager ? (
        <div>
          {/* Guest selector */}
          <div className="mb-4">
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
          {!canBook && !dateConflict && <p className="text-xs text-stone-400 mt-2 text-center">Select dates to continue</p>}
        </div>
      ) : isAuthenticated && isVenueManager ? (
        <div className="border-t border-stone-100 pt-4">
          <div className="flex items-center justify-between text-stone-600 mb-2">
            <span>Max guests</span>
            <span className="font-semibold">{maxGuests}</span>
          </div>
          <p className="text-sm text-stone-500 text-center mt-4 p-4 bg-stone-50 rounded-xl">
            Venue managers cannot make bookings. Switch to a customer account from your profile to book venues.
          </p>
        </div>
      ) : (
        <div className="text-center border-t border-stone-100 pt-6">
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
