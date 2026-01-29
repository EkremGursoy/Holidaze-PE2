import { useState } from 'react'
import type { VenueMedia } from '../../types/venue'

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'

type VenueImageGalleryProps = {
  images: VenueMedia[]
  venueName: string
}

export default function VenueImageGallery({ images, venueName }: VenueImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const displayImages = images.length > 0 ? images : [{ url: FALLBACK_IMAGE, alt: venueName }]
  const currentImage = displayImages[selectedIndex] || displayImages[0]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-stone-100">
        <img
          src={currentImage.url || FALLBACK_IMAGE}
          alt={currentImage.alt || venueName}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = FALLBACK_IMAGE
          }}
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {displayImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              aria-label={`View image ${index + 1} of ${displayImages.length}`}
              className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedIndex === index ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-stone-300'}`}
            >
              <img
                src={img.url}
                alt={img.alt || `${venueName} ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = FALLBACK_IMAGE
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
