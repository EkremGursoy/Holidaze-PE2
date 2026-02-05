type VenueSearchHeroProps = {
  value: string
  onChange: (nextValue: string) => void
}

export default function VenueSearchHero({ value, onChange }: VenueSearchHeroProps) {
  return (
    <section className="bg-orange-50 border-b border-orange-100 py-12 sm:py-20 px-4 sm:px-6 -mx-4 sm:-mx-6 -mt-8 mb-12">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-semibold mb-6">
          Explore the world
        </span>
        <h1 className="text-4xl md:text-6xl font-black text-stone-800 mb-6 tracking-tight">
          Find Your <span className="text-orange-500 relative inline-block">
            Perfect Stay
            <svg className="absolute w-full h-3 -bottom-1 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
            </svg>
          </span>
        </h1>
        <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto">Discover amazing venues for your next holiday adventure at the best prices.</p>

        <div className="relative max-w-2xl mx-auto group">
          <input
            type="text"
            placeholder="Search venues..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-5 sm:px-8 py-4 sm:py-5 rounded-full text-stone-800 bg-white text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-orange-100 border border-stone-200 shadow-xl shadow-orange-100/50 transition-all placeholder-stone-400"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-orange-500 p-2.5 rounded-full text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
