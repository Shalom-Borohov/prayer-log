import { COMMON_COPY } from '../../copy/common'
import { setPrayer } from '../../data/repo'
import { LIST_SEPARATOR, streakLabel } from '../../domain/format'
import { attendancesFor } from '../../domain/prayersForDay'
import type { SlotState } from '../../domain/shelf'
import type { Attendance, Prayer } from '../../domain/types'
import { useSave } from '../../hooks/useSave'
import { PlaceButton } from './PlaceButton'
import { usePlacePicker } from './usePlacePicker'
import { WeekShelf } from './WeekShelf'
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
  shelf: SlotState[]
  endsToday: boolean
}

export function PrayerRow({
  date,
  prayer,
  attendance,
  place,
  rememberedPlace,
  knownPlaces,
  streak,
  shelf,
  endsToday,
}: PrayerRowProps) {
  const label = COMMON_COPY.prayers[prayer]
  const shownPlace = attendance === 'minyan' && place
  const streakText = streak === null ? null : streakLabel(streak)
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
    <section className={`prayer-row hue-${prayer}`} role="group" aria-label={label}>
      <div className="day-row-top">
        <div className="day-row-title">
          <h2 className="day-row-name">{label}</h2>
          <p className="day-row-meta">
            {shownPlace && <PlaceButton prayer={prayer} place={shownPlace} onClick={() => pickPlace(shownPlace)} />}
            {shownPlace && streakText && <span>{LIST_SEPARATOR}</span>}
            {streakText && <span>{streakText}</span>}
          </p>
        </div>
        <WeekShelf shelfKey={prayer} slots={shelf} endsToday={endsToday} />
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
    </section>
  )
}
