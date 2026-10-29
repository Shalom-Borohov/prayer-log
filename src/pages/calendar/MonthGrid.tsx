import { COMMON_COPY } from '../../copy/common'
import { dayLabel, shortWeekday } from '../../domain/format'
import { hebrewDateLabel, hebrewDayNumber } from '../../domain/hebrewCalendar'
import { daysInRange, monthEnd, parseIsoDate } from '../../domain/logicalDay'
import { prayersForDay, wornItemsForDay } from '../../domain/prayersForDay'
import { slotFor } from '../../domain/shelf'
import { trackingStart, weekRange } from '../../domain/totals'
import type { DayRecord, Prayer } from '../../domain/types'
import { CALENDAR_COPY } from './copy'

const MARKS_SEPARATOR = ', '

interface MonthGridProps {
  month: string
  today: string
  records: DayRecord[]
  holidayDates: Set<string>
  onOpen: (date: string) => void
}

function marksLabel(record: DayRecord | undefined, date: string, prayers: Prayer[]): string {
  const marks = prayers.flatMap((prayer) => {
    const mark = record?.prayers[prayer]

    return mark ? [CALENDAR_COPY.prayerMark(COMMON_COPY.prayers[prayer], COMMON_COPY.attendance[mark])] : []
  })

  marks.push(...wornItemsForDay(date).filter((item) => record?.[item]).map((item) => COMMON_COPY.worn[item]))

  if (record?.torah) {
    marks.push(COMMON_COPY.learnedTorah)
  }

  return marks.length > 0 ? marks.join(MARKS_SEPARATOR) : CALENDAR_COPY.unmarked
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
        const record = recordsByDate.get(date)
        const prayers = prayersForDay(date)
        const tracked = trackedFrom !== null && date >= trackedFrom

        return (
          <button
            key={date}
            type="button"
            className={`month-day${date === today ? ' is-today' : ''}${holidayDates.has(date) ? ' is-holiday' : ''}`}
            disabled={date > today}
            aria-label={CALENDAR_COPY.dayCell(dayLabel(date), hebrewDateLabel(date), marksLabel(record, date, prayers))}
            onClick={() => onOpen(date)}
          >
            <span className="month-day-number">{parseIsoDate(date).getDate()}</span>
            <span className="month-day-hebrew">{hebrewDayNumber(date)}</span>
            <span className="month-day-spines" aria-hidden="true">
              {[...prayers, 'torah' as const].map((track) => (
                <i key={track} className={`spine hue-${track} spine-${tracked ? slotFor(record, track) : 'none'}`} />
              ))}
            </span>
          </button>
        )
      })}
    </div>
  )
}
