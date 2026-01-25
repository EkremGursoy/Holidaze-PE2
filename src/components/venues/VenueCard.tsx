import { Link } from 'react-router'
import type { Venue, VenueLocation } from '../../types/venue'
import VenueRating from './VenueRating'

const FALLBACK_IMAGE_URL =
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'

type VenueCardProps = {
  venue: Venue
}

function getVenueImageUrl(venue: Venue): string {
  if (venue.media && venue.media.length > 0 && venue.media[0].url) {
    return venue.media[0].url
  }

  return FALLBACK_IMAGE_URL
}

function getLocationString(location: VenueLocation): string {
  const parts = [location.city, location.country].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'Location not specified'
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <Link
      to={`/venue/${venue.id}`}
      className="bg-white rounded-2xl border border-stone-100 overflow-hidden hover:shadow-xl hover:shadow-orange-100/50 transition-all duration-300 group flex flex-col h-full"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
        <img
          src={getVenueImageUrl(venue)}
          alt={venue.media?.[0]?.alt || venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = FALLBACK_IMAGE_URL
          }}
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-stone-100">
          <span className="font-bold text-orange-600">${venue.price}</span>
          <span className="text-stone-400 text-xs ml-1">/night</span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="mb-2">
          <h3 className="text-xl font-bold text-stone-800 mb-1 truncate group-hover:text-orange-600 transition-colors">
            {venue.name}
          </h3>

          <p className="text-stone-500 text-sm flex items-center">
            <svg className="w-4 h-4 mr-1 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {getLocationString(venue.location)}
          </p>
        </div>

        <div className="mb-4">
          <VenueRating rating={venue.rating} />
        </div>

        <div className="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-stone-500 font-medium">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Up to {venue.maxGuests} guests
          </div>

          <div className="flex gap-2">
            {venue.meta.wifi && (
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-orange-50 text-orange-500" title="WiFi">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            )}
            {venue.meta.parking && (
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-stone-100 text-stone-500" title="Parking">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                </svg>
                Parking
              </span>
            )}
            {venue.meta.breakfast && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Breakfast
              </span>
            )}
            {venue.meta.pets && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z"
                    clipRule="evenodd"
                  />
                </svg>
                Pets
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
