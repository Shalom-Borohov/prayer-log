import type { ReactNode } from 'react'
import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { setPrayer } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { attendancesFor } from '../../domain/prayersForDay'
import { type SlotState, shelfLabel } from '../../domain/shelf'
import type { Attendance, Prayer } from '../../domain/types'

interface PrayerRowProps {
  date: string
  prayer: Prayer
  attendance: Attendance | undefined
  streak: number | null
  slots: SlotState[] | null
  children?: ReactNode
}

export function PrayerRow({ date, prayer, attendance, streak, slots, children }: PrayerRowProps) {
  const label = COMMON_COPY.prayers[prayer]

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
        {attendancesFor(prayer).map((option) => (
          <button
            key={option}
            type="button"
            className={`attendance-${option}`}
            aria-pressed={attendance === option}
            onClick={() => setPrayer(date, prayer, attendance === option ? null : option)}
          >
            {COMMON_COPY.attendance[option]}
          </button>
        ))}
      </div>
      {children}
    </section>
  )
}
