type VenueRatingProps = {
  rating: number
}

export default function VenueRating({ rating }: VenueRatingProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i < fullStars) {
      return (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      )
    }

    if (i === fullStars && hasHalfStar) {
      return (
        <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id={`half-${i}`}>
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#E7E5E4" />
            </linearGradient>
          </defs>
          <path
            fill={`url(#half-${i})`}
            d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"
          />
        </svg>
      )
    }

    return (
      <svg key={i} className="w-4 h-4 text-stone-200 fill-current" viewBox="0 0 20 20">
        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
      </svg>
    )
  })

  return (
    <div className="flex items-center">
      <div className="flex mr-1.5 space-x-0.5">{stars}</div>
      <span className="text-xs font-semibold text-stone-400">({rating.toFixed(1)})</span>
    </div>
  )
}
