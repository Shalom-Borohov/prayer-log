import { ATTENDANCE_LABELS, PRAYER_LABELS, gregorianLabel, shortWeekday, weekdayName } from '../../domain/format'
import { hebrewDateLabel, hebrewDayNumber } from '../../domain/hebrewCalendar'
import { addDays, daysInRange, monthEnd, parseIsoDate, weekStart } from '../../domain/logicalDay'
import { prayersForDay } from '../../domain/prayersForDay'
import { slotFor } from '../../domain/shelf'
import { trackingStart } from '../../domain/totals'
import type { DayRecord, Prayer } from '../../domain/types'

interface MonthGridProps {
  month: string
  today: string
  records: DayRecord[]
  holidayDates: Set<string>
  onOpen: (date: string) => void
}

function marksLabel(record: DayRecord | undefined, prayers: Prayer[]): string {
  const marks = prayers.flatMap((prayer) => {
    const mark = record?.prayers[prayer]

    return mark ? [`${PRAYER_LABELS[prayer]} ${ATTENDANCE_LABELS[mark]}`] : []
  })

  if (record?.torah) {
    marks.push('למדתי תורה')
  }

  return marks.length > 0 ? marks.join(', ') : 'לא סומן'
}

export function MonthGrid({ month, today, records, holidayDates, onOpen }: MonthGridProps) {
  const byDate = new Map(records.map((day) => [day.date, day]))
  const start = trackingStart(records)
  const leadingBlanks = Array.from({ length: parseIsoDate(month).getDay() }, (_, index) => index)
  const dates = daysInRange(month, monthEnd(month))
  const headers = daysInRange(weekStart(month), addDays(weekStart(month), 6))

  return (
    <div className="month-grid">
      {headers.map((date) => (
        <span key={date} className="month-weekday" aria-hidden="true">
          {shortWeekday(date)}
        </span>
      ))}
      {leadingBlanks.map((index) => (
        <span key={`blank-${index}`} aria-hidden="true" />
      ))}
      {dates.map((date) => {
        const record = byDate.get(date)
        const prayers = prayersForDay(date)
        const tracked = start !== null && date >= start

        return (
          <button
            key={date}
            type="button"
            className={`month-day${date === today ? ' is-today' : ''}${holidayDates.has(date) ? ' is-holiday' : ''}`}
            disabled={date > today}
            aria-label={`${weekdayName(date)} ${gregorianLabel(date)}, ${hebrewDateLabel(date)}: ${marksLabel(record, prayers)}`}
            onClick={() => onOpen(date)}
          >
            <span className="month-day-number">{parseIsoDate(date).getDate()}</span>
            <span className="month-day-hebrew">{hebrewDayNumber(date)}</span>
            <span className="month-day-spines" aria-hidden="true">
              {[...prayers, 'torah' as const].map((key) => (
                <i key={key} className={`spine hue-${key} spine-${tracked ? slotFor(record, key) : 'none'}`} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
