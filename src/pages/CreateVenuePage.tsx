import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AccessRestricted from '../components/ui/AccessRestricted'
import VenueForm from '../components/venues/VenueForm'
import { useAuth } from '../hooks/useAuth'
import { createVenue, type VenueFormData } from '../services/venueService'

export default function CreateVenuePage() {
  const navigate = useNavigate()
  const { user, apiKey, isAuthenticated, isVenueManager } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Access restriction for non-venue managers
  if (!isAuthenticated || !isVenueManager) {
    return <AccessRestricted message="You must be logged in as a venue manager to create venues." />
  }

  const handleSubmit = async (data: VenueFormData) => {
    if (!user?.accessToken || !apiKey) return

    setIsSubmitting(true)
    try {
      const venueId = await createVenue(data, user.accessToken, apiKey)
      navigate(`/venue/${venueId}`)
    } catch (err) {
      setIsSubmitting(false)
      throw err
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-stone-600 hover:text-orange-600 font-medium mb-6 transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to venues
      </Link>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
            New Listing
          </span>
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">
            Create a Venue
          </h1>
          <p className="mt-2 text-stone-500">
            Add your property to Holidaze and start receiving bookings
          </p>
        </div>

        <VenueForm onSubmit={handleSubmit} submitLabel="Create Venue" isSubmitting={isSubmitting} />
      </div>
    </div>
  )
}
