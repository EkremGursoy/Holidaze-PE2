export type VenueMedia = {
  url: string
  alt?: string | null
}

export type VenueMeta = {
  wifi: boolean
  parking: boolean
  breakfast: boolean
  pets: boolean
}

export type VenueLocation = {
  city: string | null
  country: string | null
}

export type Venue = {
  id: string
  name: string
  description: string
  media: VenueMedia[]
  price: number
  maxGuests: number
  rating: number
  meta: VenueMeta
  location: VenueLocation
}

export type VenuesResponse = {
  data: Venue[]
}
