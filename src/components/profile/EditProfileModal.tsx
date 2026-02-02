import { useEffect, useState } from 'react'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'

type EditProfileModalProps = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ProfileFormData) => Promise<void>
  initialData: {
    bio: string
    avatarUrl: string
    bannerUrl: string
    venueManager: boolean
  }
  isSaving: boolean
}

export type ProfileFormData = {
  bio: string
  avatarUrl: string
  bannerUrl: string
  venueManager: boolean
}

// Wrapper component that controls visibility and remounts the form when opened
export default function EditProfileModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving,
}: EditProfileModalProps) {
  // Handle keyboard escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <EditProfileForm
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      isSaving={isSaving}
    />
  )
}

// Inner form component that receives fresh initialData on each mount
function EditProfileForm({
  onClose,
  onSave,
  initialData,
  isSaving,
}: Omit<EditProfileModalProps, 'isOpen'>) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 id="edit-profile-title" className="text-xl font-bold text-stone-800">Edit Profile</h2>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            </div>
          )}

          <FormTextarea
            id="bio"
            label="Bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={3}
          />

          <FormInput
            id="avatarUrl"
            label="Avatar URL"
            type="url"
            value={formData.avatarUrl}
            onChange={handleChange}
            placeholder="https://example.com/avatar.jpg"
          />

          <FormInput
            id="bannerUrl"
            label="Banner URL"
            type="url"
            value={formData.bannerUrl}
            onChange={handleChange}
            placeholder="https://example.com/banner.jpg"
          />

          {/* Account Type Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-stone-700">
              Account Type
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, venueManager: false }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${!formData.venueManager
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-stone-200 hover:border-stone-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${!formData.venueManager ? 'border-orange-500' : 'border-stone-300'
                    }`}>
                    {!formData.venueManager && (
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Customer</p>
                    <p className="text-sm text-stone-500">Book venues and manage reservations</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, venueManager: true }))}
                className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${formData.venueManager
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-stone-200 hover:border-stone-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.venueManager ? 'border-orange-500' : 'border-stone-300'
                    }`}>
                    {formData.venueManager && (
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">Venue Manager</p>
                    <p className="text-sm text-stone-500">List and manage your properties</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 font-semibold text-stone-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
