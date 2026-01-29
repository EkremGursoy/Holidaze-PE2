import { useState } from 'react'
import { Link } from 'react-router'

type BookingCardProps = {
  price: number
  maxGuests: number
  isAuthenticated: boolean
}

function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0
  const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, nights)
}

export default function BookingCard({ price, maxGuests, isAuthenticated }: BookingCardProps) {
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')

  const nights = calculateNights(checkIn, checkOut)
  const total = price * nights
  const today = new Date().toISOString().split('T')[0]
  const canBook = checkIn && checkOut && nights > 0

  return (
    <div className="sticky top-24 bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 p-6">
      {/* Price */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-black text-stone-800">${price}</span>
        <span className="text-stone-500">/night</span>
      </div>

      {/* Date & Guest Inputs */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
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
          <button
            disabled={!canBook}
            className="w-full py-4 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={canBook ? 'Book this venue' : 'Select check-in and check-out dates to book'}
          >
            Book Now
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
