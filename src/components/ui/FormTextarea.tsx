type FormTextareaProps = {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  required?: boolean
  rows?: number
}

export default function FormTextarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-stone-700 mb-2">
        {label} {required && '*'}
      </label>
      <textarea
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        className="w-full px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400 resize-none"
      />
    </div>
  )
}
