import type { ReactNode } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { setPrayer } from '../../data/repo'
import { LIST_SEPARATOR, streakLabel } from '../../domain/format'
import { attendancesFor } from '../../domain/prayersForDay'
import type { Attendance, Prayer } from '../../domain/types'
import { useSave } from '../../hooks/useSave'
import { PlaceButton } from './PlaceButton'
import { usePlacePicker } from './usePlacePicker'
import './attendance.css'
import './day-row.css'
import './prayer-row.css'

interface PrayerRowProps {
  date: string
  prayer: Prayer
  attendance: Attendance | undefined
  place: string | undefined
  rememberedPlace: string | undefined
  knownPlaces: string[]
  streak: number | null
  children?: ReactNode
}

export function PrayerRow({
  date,
  prayer,
  attendance,
  place,
  rememberedPlace,
  knownPlaces,
  streak,
  children,
}: PrayerRowProps) {
  const label = COMMON_COPY.prayers[prayer]
  const pickPlace = usePlacePicker(date, prayer, knownPlaces)
  const save = useSave()

  async function mark(option: Attendance) {
    if (attendance === option) {
      await save(setPrayer(date, prayer, null))

      return
    }

    const saved = await save(setPrayer(date, prayer, option, rememberedPlace))

    if (saved && option === 'minyan' && !rememberedPlace) {
      pickPlace()
    }
  }

  return (
    <section className="day-row" role="group" aria-label={label}>
      <div className="day-row-main">
        <div className="day-row-title">
          <div className="day-row-name">
            <h2>{label}</h2>
            {streak !== null && <span className="streak-badge">{streakLabel(streak)}</span>}
          </div>
          <p className="day-row-state">
            {attendance && (
              <>
                <span>
                  {COMMON_COPY.attendance[attendance]}
                  {place && LIST_SEPARATOR}
                </span>
                {place && <PlaceButton prayer={prayer} place={place} onClick={() => pickPlace(place)} />}
              </>
            )}
          </p>
        </div>
        <div className="attendance">
          {attendancesFor(prayer).map((option) => (
            <button
              key={option}
              type="button"
              className={`attendance-${option}`}
              aria-pressed={attendance === option}
              onClick={() => mark(option)}
            >
              {COMMON_COPY.attendance[option]}
            </button>
          ))}
        </div>
      </div>
      {children}
    </section>
  )
}
