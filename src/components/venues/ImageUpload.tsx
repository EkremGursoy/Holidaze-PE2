type ImageUploadProps = {
  images: { url: string; alt?: string }[]
  imageUrl: string
  onImageUrlChange: (url: string) => void
  onAddImage: () => void
  onRemoveImage: (index: number) => void
}

export default function ImageUpload({
  images,
  imageUrl,
  onImageUrlChange,
  onAddImage,
  onRemoveImage,
}: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-stone-800">Images</h2>

      <div className="flex gap-2">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 px-5 py-3.5 rounded-xl text-stone-800 bg-stone-50 border border-stone-200 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-300 transition-all placeholder-stone-400"
        />
        <button
          type="button"
          onClick={onAddImage}
          className="px-6 py-3.5 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-colors"
        >
          Add
        </button>
      </div>

      {images.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.url}
                alt={img.alt || 'Venue image'}
                className="w-24 h-24 object-cover rounded-xl border border-stone-200"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&auto=format&fit=crop'
                }}
              />
              <button
                type="button"
                onClick={() => onRemoveImage(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
