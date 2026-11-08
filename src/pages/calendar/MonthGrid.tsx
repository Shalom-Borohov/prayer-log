import { COMMON_COPY } from '../../copy/common'
import { MARKS_SEPARATOR, dayMarks } from '../../domain/dayMarks'
import { shortWeekday, weekdayName } from '../../domain/format'
import { hebrewDateLabel, hebrewDayNumber } from '../../domain/hebrewCalendar'
import { daysInRange, monthEnd, parseIsoDate } from '../../domain/logicalDay'
import { prayersForDay, wornItemsForDay } from '../../domain/prayersForDay'
import { slotFor } from '../../domain/shelf'
import { trackingStart, weekRange } from '../../domain/totals'
import { type DayRecord, WORN_AT_PRAYER, WORN_ITEMS } from '../../domain/types'
import { CALENDAR_COPY } from './copy'

interface MonthGridProps {
  month: string
  today: string
  records: DayRecord[]
  holidayDates: Set<string>
  onOpen: (date: string) => void
}

function marksLabel(record: DayRecord | undefined): string {
  const marks = record ? dayMarks(record) : []

  return marks.length > 0 ? marks.join(MARKS_SEPARATOR) : COMMON_COPY.unmarked
}

export function MonthGrid({ month, today, records, holidayDates, onOpen }: MonthGridProps) {
  const recordsByDate = new Map(records.map((record) => [record.date, record]))
  const trackedFrom = trackingStart(records)
  const leadingBlanks = Array.from({ length: parseIsoDate(month).getDay() }, (_, index) => index)
  const monthDates = daysInRange(month, monthEnd(month))
  const firstWeek = weekRange(month)
  const weekdayHeaders = daysInRange(firstWeek.from, firstWeek.to)

  return (
    <div className="month-grid">
      {weekdayHeaders.map((date) => (
        <span key={date} className="month-weekday" aria-hidden="true">
          {shortWeekday(date)}
        </span>
      ))}
      {leadingBlanks.map((index) => (
        <span key={`blank-${index}`} aria-hidden="true" />
      ))}
      {monthDates.map((date) => {
        const dayNumber = parseIsoDate(date).getDate()
        const record = recordsByDate.get(date)
        const prayers = prayersForDay(date)
        const tracked = trackedFrom !== null && date >= trackedFrom
        const markedWorn = wornItemsForDay(date).filter((item) => record?.[item])

        return (
          <button
            key={date}
            type="button"
            className={`month-day${date === today ? ' is-today' : ''}${holidayDates.has(date) ? ' is-holiday' : ''}`}
            disabled={date > today}
            aria-label={CALENDAR_COPY.dayCell(
              dayNumber,
              hebrewDateLabel(date),
              weekdayName(date),
              marksLabel(record),
            )}
            onClick={() => onOpen(date)}
          >
            <span className="month-day-number">{dayNumber}</span>{' '}
            <span className="month-day-hebrew">{hebrewDayNumber(date)}</span>
            <span className="month-day-spines" aria-hidden="true">
              {[...prayers, 'torah' as const].map((track) => (
                <i key={track} className={`spine hue-${track} spine-${tracked ? slotFor(record, track) : 'none'}`} />
              ))}
            </span>
            <span className={`month-day-worn hue-${WORN_AT_PRAYER}`} aria-hidden="true">
              {WORN_ITEMS.map((item) => (
                <i key={item} className={`worn-mark worn-mark-${item}${markedWorn.includes(item) ? ' is-marked' : ''}`} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
