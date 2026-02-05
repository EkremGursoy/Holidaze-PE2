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

          <div className="flex gap-2 flex-wrap">
            {venue.meta.wifi && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-50 text-orange-600 font-medium" title="WiFi">
                WiFi
              </span>
            )}
            {venue.meta.parking && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-stone-100 text-stone-600 font-medium" title="Parking">
                Parking
              </span>
            )}
            {venue.meta.breakfast && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-50 text-yellow-700 font-medium" title="Breakfast">
                Breakfast
              </span>
            )}
            {venue.meta.pets && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 font-medium" title="Pets">
                Pets
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
