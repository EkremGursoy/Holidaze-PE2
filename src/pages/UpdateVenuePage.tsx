import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import AccessRestricted from '../components/ui/AccessRestricted'
import VenueForm from '../components/venues/VenueForm'
import { useAuth } from '../hooks/useAuth'
import { useVenue } from '../hooks/useVenue'
import { updateVenue, deleteVenue, type VenueFormData } from '../services/venueService'

export default function UpdateVenuePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, apiKey, isAuthenticated, isVenueManager } = useAuth()
  const { venue, loading, error } = useVenue(id)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Access restriction for non-venue managers
  if (!isAuthenticated || !isVenueManager) {
    return <AccessRestricted message="You must be logged in as a venue manager to edit venues." />
  }

  // Venue not found
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

  // Convert venue data to form data format
  const initialData: VenueFormData = {
    name: venue.name,
    description: venue.description,
    media: venue.media || [],
    price: venue.price,
    maxGuests: venue.maxGuests,
    rating: venue.rating,
    meta: venue.meta,
    location: {
      address: venue.location?.address || '',
      city: venue.location?.city || '',
      zip: venue.location?.zip || '',
      country: venue.location?.country || '',
    },
  }

  const handleSubmit = async (data: VenueFormData) => {
    if (!user?.accessToken || !apiKey || !id) return

    setIsSubmitting(true)
    try {
      await updateVenue(id, data, user.accessToken, apiKey)
      navigate(`/venue/${id}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!user?.accessToken || !apiKey || !id) return

    setIsDeleting(true)
    try {
      await deleteVenue(id, user.accessToken, apiKey)
      navigate('/')
    } catch (err) {
      console.error('Failed to delete venue:', err)
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link to={`/venue/${id}`} className="inline-flex items-center text-stone-600 hover:text-orange-600 font-medium mb-6 transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to venue
      </Link>

      <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 p-8 md:p-10">
        <div className="text-center mb-8">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-4">
            Edit Listing
          </span>
          <h1 className="text-3xl font-black text-stone-800 tracking-tight">
            Update Venue
          </h1>
          <p className="mt-2 text-stone-500">
            Make changes to your property listing
          </p>
        </div>

        <VenueForm initialData={initialData} onSubmit={handleSubmit} submitLabel="Save Changes" isSubmitting={isSubmitting} />

        {/* Delete Section */}
        <div className="mt-8 pt-8 border-t border-stone-200">
          <h2 className="text-lg font-bold text-stone-800 mb-4">Danger Zone</h2>
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-3 bg-red-50 text-red-600 font-semibold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
            >
              Delete Venue
            </button>
          ) : (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-red-600 mb-4">Are you sure you want to delete this venue? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
