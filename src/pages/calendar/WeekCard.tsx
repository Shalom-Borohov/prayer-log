import { Fragment } from 'react'
import { type WeekShelvesColumn, WeekShelves } from '../../components/WeekShelves'
import { COMMON_COPY } from '../../copy/common'
import { MARKS_SEPARATOR, dayMarks } from '../../domain/dayMarks'
import { LIST_SEPARATOR, dayOfMonth, shortWeekday, weekdayName } from '../../domain/format'
import { hebrewDateLabel, hebrewDayNumber, weeklyParsha } from '../../domain/hebrewCalendar'
import { isSaturday, monthStart } from '../../domain/logicalDay'
import { weekHolidays } from '../../domain/monthWeeks'
import { shelfRows } from '../../domain/shelf'
import type { DayRecord } from '../../domain/types'
import { CALENDAR_COPY } from './copy'
import { holidayRunDays, weekDatesLabel } from './labels'

interface WeekCardProps {
  dates: string[]
  month: string
  today: string
  records: DayRecord[]
  onOpenDay: (date: string) => void
}

function marksLabel(record: DayRecord | undefined): string {
  const marks = record ? dayMarks(record, undefined, { withWorn: false }) : []

  return marks.length > 0 ? marks.join(MARKS_SEPARATOR) : COMMON_COPY.unmarked
}

function spokenName(date: string, record: DayRecord | undefined): string {
  const weekday = weekdayName(date)
  const parsha = isSaturday(date) ? weeklyParsha(date) : null

  return CALENDAR_COPY.dayCell(
    dayOfMonth(date),
    hebrewDateLabel(date),
    parsha ? CALENDAR_COPY.weekdayWithParsha(weekday, parsha) : weekday,
    marksLabel(record),
  )
}

interface ColumnHeadProps {
  date: string
  isOutside: boolean
  isHoliday: boolean
  isToday: boolean
}

function ColumnHead({ date, isOutside, isHoliday, isToday }: ColumnHeadProps) {
  return (
    <>
      <span className="week-day-letter">{shortWeekday(date)}</span>{' '}
      <span className={`week-day-number${isHoliday ? ' is-holiday' : ''}${isOutside ? ' is-outside' : ''}`}>
        {dayOfMonth(date)}
        {isToday && <i className="week-today-mark" />}
      </span>{' '}
      <span className="week-day-hebrew">{hebrewDayNumber(date)}</span>
    </>
  )
}

export function WeekCard({ dates, month, today, records, onOpenDay }: WeekCardProps) {
  const recordsByDate = new Map(records.map((record) => [record.date, record]))
  const parsha = weeklyParsha(dates[dates.length - 1])
  const holidays = weekHolidays(dates)
  const isHoliday = (date: string) => holidays.some((run) => run.from <= date && date <= run.to)

  const columns: WeekShelvesColumn[] = dates.map((date) => ({
    date,
    head: (
      <ColumnHead
        date={date}
        isOutside={monthStart(date) !== monthStart(month)}
        isHoliday={isHoliday(date)}
        isToday={date === today}
      />
    ),
    isToday: date === today,
    isDimmed: date > today,
    spokenName: spokenName(date, recordsByDate.get(date)),
  }))

  return (
    <section className="week-card">
      <header className="week-card-header">
        <span className="week-card-dates" dir="ltr">
          {weekDatesLabel(dates[0], dates[dates.length - 1])}
        </span>{' '}
        {parsha && <span className="week-card-parsha">{CALENDAR_COPY.weekParsha(parsha)}</span>}
      </header>
      <WeekShelves columns={columns} rows={shelfRows(records, dates, today)} onOpenDay={onOpenDay} />
      {holidays.length > 0 && (
        <p className="week-card-holidays">
          {holidays.map((run, index) => (
            <Fragment key={`${run.from}-${run.name}`}>
              {index > 0 && LIST_SEPARATOR}
              <span dir="ltr">{holidayRunDays(run)}</span> {run.name}
            </Fragment>
          ))}
        </p>
      )}
    </section>
  )
}
