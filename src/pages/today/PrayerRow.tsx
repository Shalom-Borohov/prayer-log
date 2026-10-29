import type { ReactNode } from 'react'
import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { setPrayer } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { attendancesFor } from '../../domain/prayersForDay'
import { type SlotState, shelfLabel } from '../../domain/shelf'
import type { Attendance, Prayer } from '../../domain/types'
import { PlaceButton } from './PlaceButton'
import { usePlacePicker } from './usePlacePicker'

interface PrayerRowProps {
  date: string
  prayer: Prayer
  attendance: Attendance | undefined
  place: string | undefined
  rememberedPlace: string | undefined
  knownPlaces: string[]
  streak: number | null
  slots: SlotState[] | null
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
  slots,
  children,
}: PrayerRowProps) {
  const label = COMMON_COPY.prayers[prayer]
  const pickPlace = usePlacePicker(date, prayer, knownPlaces)

  function mark(option: Attendance) {
    if (attendance === option) {
      void setPrayer(date, prayer, null)

      return
    }

    void setPrayer(date, prayer, option, rememberedPlace)

    if (option === 'minyan' && !rememberedPlace) {
      pickPlace()
    }
  }

  return (
    <section className={`day-row hue-${prayer}`} role="group" aria-label={label}>
      <div className="day-row-top">
        <div className="day-row-title">
          <div className="day-row-name">
            <h2>{label}</h2>
            {attendance === 'minyan' && place && (
              <PlaceButton prayer={prayer} place={place} onClick={() => pickPlace(place)} />
            )}
          </div>
          {streak !== null && <p>{streakLabel(streak)}</p>}
        </div>
        {slots && <Shelf slots={slots} label={shelfLabel(slots, prayer)} stamp />}
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
      {children}
    </section>
  )
}
