import { useState } from 'react'
import type { VenueFormData } from '../../services/venueService'
import FormInput from '../ui/FormInput'
import FormTextarea from '../ui/FormTextarea'
import AmenitiesCheckbox from './AmenitiesCheckbox'
import ImageUpload from './ImageUpload'
import LocationFields from './LocationFields'

type VenueFormProps = {
  initialData?: VenueFormData
  onSubmit: (data: VenueFormData) => Promise<void>
  submitLabel: string
  isSubmitting: boolean
}

const defaultFormData: VenueFormData = {
  name: '',
  description: '',
  media: [],
  price: 0,
  maxGuests: 1,
  meta: {
    wifi: false,
    parking: false,
    breakfast: false,
    pets: false,
  },
  location: {
    address: '',
    city: '',
    zip: '',
    country: '',
    continent: '',
  },
}

export default function VenueForm({ initialData, onSubmit, submitLabel, isSubmitting }: VenueFormProps) {
  const [formData, setFormData] = useState<VenueFormData>(initialData || defaultFormData)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  // Handle input changes for nested objects (meta.*, location.*)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    if (name.startsWith('meta.')) {
      const metaKey = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        meta: { ...prev.meta, [metaKey]: checked },
      }))
    } else if (name.startsWith('location.')) {
      const locationKey = name.split('.')[1]
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locationKey]: value },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }))
    }
  }

  const addImage = () => {
    if (!imageUrl.trim()) return
    setFormData((prev) => ({
      ...prev,
      media: [...(prev.media || []), { url: imageUrl.trim(), alt: prev.name }],
    }))
    setImageUrl('')
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media?.filter((_, i) => i !== index) || [],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name.trim()) {
      setError('Venue name is required')
      return
    }
    if (!formData.description.trim()) {
      setError('Description is required')
      return
    }
    if (formData.price <= 0) {
      setError('Price must be greater than 0')
      return
    }
    if (formData.maxGuests < 1) {
      setError('Max guests must be at least 1')
      return
    }

    try {
      // Clean up the data before sending - remove empty optional fields
      const cleanedData: VenueFormData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: formData.price,
        maxGuests: formData.maxGuests,
      }

      // Only include media if there are images
      if (formData.media && formData.media.length > 0) {
        cleanedData.media = formData.media
      }

      // Only include meta if at least one is true
      if (formData.meta) {
        cleanedData.meta = formData.meta
      }

      // Only include location if at least one field has a value
      if (formData.location) {
        const { address, city, zip, country, continent } = formData.location
        if (address || city || zip || country || continent) {
          cleanedData.location = {
            address: address || undefined,
            city: city || undefined,
            zip: zip || undefined,
            country: country || undefined,
            continent: continent || undefined,
          }
        }
      }

      await onSubmit(cleanedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
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

      {/* Basic Info Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-800">Basic Information</h2>

        <FormInput
          id="name"
          label="Venue Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter venue name"
          required
        />

        <FormTextarea
          id="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your venue..."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            id="price"
            label="Price per night ($)"
            type="number"
            value={formData.price || ''}
            onChange={handleChange}
            placeholder="100"
            required
            min={1}
          />
          <FormInput
            id="maxGuests"
            label="Max Guests"
            type="number"
            value={formData.maxGuests || ''}
            onChange={handleChange}
            placeholder="4"
            required
            min={1}
            max={100}
          />
        </div>
      </div>

      {/* Images Section */}
      <ImageUpload
        images={formData.media || []}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        onAddImage={addImage}
        onRemoveImage={removeImage}
      />

      {/* Amenities Section */}
      <AmenitiesCheckbox
        meta={formData.meta || {}}
        onChange={handleChange}
      />

      {/* Location Section */}
      <LocationFields
        location={formData.location || {}}
        onChange={handleChange}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-6 font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/30 hover:shadow-orange-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Saving...
          </span>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}
