type AmenitiesMeta = {
  wifi?: boolean
  parking?: boolean
  breakfast?: boolean
  pets?: boolean
}

type AmenitiesCheckboxProps = {
  meta: AmenitiesMeta
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const amenityOptions = [
  { key: 'wifi', label: 'WiFi' },
  { key: 'parking', label: 'Parking' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'pets', label: 'Pets Allowed' },
] as const

export default function AmenitiesCheckbox({ meta, onChange }: AmenitiesCheckboxProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Amenities</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenityOptions.map(({ key, label }) => (
          <label key={key} className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200 cursor-pointer hover:border-orange-300 transition-colors">
            <input
              type="checkbox"
              name={`meta.${key}`}
              checked={meta?.[key] || false}
              onChange={onChange}
              className="w-5 h-5 rounded border-stone-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="font-medium text-stone-700">{label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
