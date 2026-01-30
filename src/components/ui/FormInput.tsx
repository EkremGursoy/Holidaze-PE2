type FormInputProps = {
  id: string
  label: string
  type?: 'text' | 'number' | 'url' | 'email'
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  required?: boolean
  min?: string | number
  max?: string | number
}

export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
}: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-2">
        {label} {required && '*'}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
      />
    </div>
  )
}
