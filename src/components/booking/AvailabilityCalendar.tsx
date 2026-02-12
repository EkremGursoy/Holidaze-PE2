import { useState } from 'react'

type AvailabilityCalendarProps = {
  bookedDates: Set<string>
  checkIn: string
  checkOut: string
  onSelectDate: (date: string) => void
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function getTodayString(): string {
  const now = new Date()
  return formatDate(now.getFullYear(), now.getMonth(), now.getDate())
}

export default function AvailabilityCalendar({
  bookedDates,
  checkIn,
  checkOut,
  onSelectDate,
}: AvailabilityCalendarProps) {
  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const today = getTodayString()

  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  // Can't go to previous months before current
  const canGoPrev = viewYear > now.getFullYear() || (viewYear === now.getFullYear() && viewMonth > now.getMonth())

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1)
  // getDay: 0=Sun,1=Mon... -> shift to Mon=0
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const isInRange = (dateStr: string): boolean => {
    if (!checkIn || !checkOut) return false
    return dateStr >= checkIn && dateStr <= checkOut
  }

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-bold text-stone-800">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_NAMES.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-stone-400 py-1">
            {d}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />
          }

          const dateStr = formatDate(viewYear, viewMonth, day)
          const isPast = dateStr < today
          const isBooked = bookedDates.has(dateStr)
          const isDisabled = isPast || isBooked
          const isCheckIn = dateStr === checkIn
          const isCheckOut = dateStr === checkOut
          const isSelected = isCheckIn || isCheckOut
          const inRange = isInRange(dateStr)

          let className = 'relative w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-all '

          if (isDisabled) {
            className += isBooked
              ? 'bg-red-50 text-red-300 cursor-not-allowed line-through'
              : 'text-stone-300 cursor-not-allowed'
          } else if (isSelected) {
            className += 'bg-orange-500 text-white font-bold shadow-sm'
          } else if (inRange) {
            className += 'bg-orange-100 text-orange-700 font-medium'
          } else {
            className += 'text-stone-700 hover:bg-orange-50 cursor-pointer font-medium'
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={className}
              aria-label={`${MONTH_NAMES[viewMonth]} ${day}${isBooked ? ' (booked)' : isPast ? ' (past)' : ''}`}
            >
              {day}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-stone-500 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-500"></span>
          Selected
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-red-50 border border-red-200"></span>
          Booked
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-stone-100 border border-stone-200"></span>
          Available
        </div>
      </div>
    </div>
  )
}
