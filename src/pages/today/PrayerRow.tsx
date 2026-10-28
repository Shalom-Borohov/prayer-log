import { Shelf } from '../../components/Shelf'
import { setPrayer } from '../../data/repo'
import { ATTENDANCE_LABELS, PRAYER_LABELS, streakLabel } from '../../domain/format'
import { type SlotState, shelfLabel } from '../../domain/shelf'
import { ATTENDANCES, type Attendance, type Prayer } from '../../domain/types'

interface PrayerRowProps {
  date: string
  prayer: Prayer
  attendance: Attendance | undefined
  streak: number | null
  slots: SlotState[] | null
}

export function PrayerRow({ date, prayer, attendance, streak, slots }: PrayerRowProps) {
  const label = PRAYER_LABELS[prayer]

  return (
    <section className={`day-row hue-${prayer}`} role="group" aria-label={label}>
      <div className="day-row-top">
        <div className="day-row-title">
          <h2>{label}</h2>
          {streak !== null && <p>{streakLabel(streak)}</p>}
        </div>
        {slots && <Shelf slots={slots} label={shelfLabel(slots, prayer)} stamp />}
      </div>
      <div className="attendance">
        {ATTENDANCES.map((state) => (
          <button
            key={state}
            type="button"
            className={`attendance-${state}`}
            aria-pressed={attendance === state}
            onClick={() => setPrayer(date, prayer, attendance === state ? null : state)}
          >
            {ATTENDANCE_LABELS[state]}
          </button>
        ))}
      </div>
    </section>
  )
}
