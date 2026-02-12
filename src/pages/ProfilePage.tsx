import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import AccessRestricted from '../components/ui/AccessRestricted'
import BookingsList from '../components/profile/BookingsList'
import EditProfileModal, { type ProfileFormData } from '../components/profile/EditProfileModal'
import ProfileHeader from '../components/profile/ProfileHeader'
import { useAuth } from '../hooks/useAuth'
import {
  getProfile,
  getProfileBookings,
  updateProfile,
  type Profile,
  type ProfileBooking,
} from '../services/profileService'

export default function ProfilePage() {
  const { user, apiKey, isAuthenticated, updateUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<ProfileBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingsLoading, setBookingsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!user?.accessToken || !apiKey || !user?.name) return

    const fetchProfile = async () => {
      try {
        const data = await getProfile(user.name, user.accessToken, apiKey)
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    const fetchBookings = async () => {
      try {
        const data = await getProfileBookings(user.name, user.accessToken, apiKey)
        setBookings(data)
      } catch (err) {
        console.error('Failed to load bookings:', err)
      } finally {
        setBookingsLoading(false)
      }
    }

    fetchProfile()
    fetchBookings()
  }, [user, apiKey])

  const handleSaveProfile = async (formData: ProfileFormData) => {
    if (!user?.accessToken || !apiKey || !user?.name) return

    setIsSaving(true)
    try {
      const updateData = {
        bio: formData.bio || undefined,
        avatar: formData.avatarUrl ? { url: formData.avatarUrl, alt: user.name } : undefined,
        banner: formData.bannerUrl ? { url: formData.bannerUrl, alt: `${user.name}'s banner` } : undefined,
        venueManager: formData.venueManager,
      }

      const updatedProfile = await updateProfile(user.name, updateData, user.accessToken, apiKey)
      setProfile(updatedProfile)

      // Update auth context with new data
      updateUser({
        avatar: updatedProfile.avatar,
        banner: updatedProfile.banner,
        venueManager: updatedProfile.venueManager,
      })

      setIsEditModalOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  // Access restriction
  if (!isAuthenticated) {
    return <AccessRestricted message="You must be logged in to view your profile." />
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
  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-8 rounded-2xl text-center">
          <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold mb-2">Failed to load profile</h2>
          <p className="mb-6">{error || 'Something went wrong'}</p>
          <Link to="/" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-stone-600 hover:text-orange-600 font-medium mb-6 transition-colors">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to venues
      </Link>

      <div className="space-y-6">
        {/* Profile Header */}
        <ProfileHeader
          name={profile.name}
          email={profile.email}
          bio={profile.bio}
          avatar={profile.avatar}
          banner={profile.banner}
          venueManager={profile.venueManager}
          stats={profile._count}
          onEditClick={() => setIsEditModalOpen(true)}
        />

        {/* Venue Manager Actions */}
        {profile.venueManager && (
          <div className="flex flex-wrap gap-4">
            <Link
              to="/create-venue"
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Venue
            </Link>
            <Link
              to="/my-venues"
              className="flex items-center gap-2 px-6 py-3 bg-stone-100 text-stone-700 font-semibold rounded-xl hover:bg-stone-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              My Venues
            </Link>
          </div>
        )}

        {/* Upcoming Bookings - for customers */}
        {!profile.venueManager && (
          <BookingsList bookings={bookings} loading={bookingsLoading} />
        )}
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{
          bio: profile.bio || '',
          avatarUrl: profile.avatar?.url || '',
          bannerUrl: profile.banner?.url || '',
          venueManager: profile.venueManager,
        }}
        isSaving={isSaving}
      />
    </div>
  )
}
