type ProfileHeaderProps = {
  name: string
  email: string
  bio?: string
  avatar: { url: string; alt: string }
  banner: { url: string; alt: string }
  venueManager: boolean
  stats: { venues: number; bookings: number }
  onEditClick: () => void
}

export default function ProfileHeader({
  name,
  email,
  bio,
  avatar,
  banner,
  venueManager,
  stats,
  onEditClick,
}: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-orange-100/30 overflow-hidden">
      {/* Banner */}
      <div className="h-32 md:h-48 relative">
        <img
          src={banner.url || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop'}
          alt={banner.alt || 'Profile banner'}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&auto=format&fit=crop'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>

      {/* Profile Info */}
      <div className="px-6 pb-6 md:px-8 md:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 sm:-mt-16">
          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={avatar.url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop'}
              alt={avatar.alt || name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl border-4 border-white object-cover shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop'
              }}
            />
          </div>

          {/* Name & Role */}
          <div className="flex-1 min-w-0 sm:pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-black text-stone-800 tracking-tight truncate">
                {name}
              </h1>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${venueManager
                  ? 'bg-orange-100 text-orange-600'
                  : 'bg-stone-100 text-stone-600'
                }`}>
                {venueManager ? 'Venue Manager' : 'Customer'}
              </span>
            </div>
            <p className="text-stone-500 text-sm truncate">{email}</p>
          </div>

          {/* Edit Button - Desktop */}
          <button
            onClick={onEditClick}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
        </div>

        {/* Edit Button - Mobile */}
        <button
          onClick={onEditClick}
          className="sm:hidden w-full mt-4 flex items-center justify-center gap-2 px-5 py-2.5 bg-stone-800 text-white font-semibold rounded-xl hover:bg-stone-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>

        {/* Bio */}
        {bio && (
          <p className="mt-4 text-stone-600 leading-relaxed">{bio}</p>
        )}

        {/* Stats */}
        <div className="mt-6 flex gap-6">
          <div>
            <p className="text-2xl font-bold text-stone-800">{stats.bookings}</p>
            <p className="text-sm text-stone-500">Bookings</p>
          </div>
          {venueManager && (
            <div>
              <p className="text-2xl font-bold text-stone-800">{stats.venues}</p>
              <p className="text-sm text-stone-500">Venues</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
