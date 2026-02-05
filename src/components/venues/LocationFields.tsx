import FormInput from '../ui/FormInput'

type LocationData = {
  address?: string
  city?: string
  zip?: string
  country?: string
  continent?: string
  lat?: number
  lng?: number
}

type LocationFieldsProps = {
  location: LocationData
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function LocationFields({ location, onChange }: LocationFieldsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Location (Optional)</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="location.city"
          label="City"
          value={location?.city || ''}
          onChange={onChange}
          placeholder="City"
        />
        <FormInput
          id="location.country"
          label="Country"
          value={location?.country || ''}
          onChange={onChange}
          placeholder="Country"
        />
      </div>

      <FormInput
        id="location.address"
        label="Address"
        value={location?.address || ''}
        onChange={onChange}
        placeholder="Street address"
      />
    </div>
  )
}
