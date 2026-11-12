import { COMMON_COPY } from '../../copy/common'
import { dayOfMonth, gregorianLabel } from '../../domain/format'
import { type HebrewMonth, hebrewMonthsBetween } from '../../domain/hebrewCalendar'
import { monthEnd, monthStart } from '../../domain/logicalDay'
import type { HolidayRun } from '../../domain/monthWeeks'
import { CALENDAR_COPY } from './copy'

const dayNumber = (date: string) => String(dayOfMonth(date))

export function weekDatesLabel(from: string, to: string): string {
  const fromLabel = monthStart(from) === monthStart(to) ? dayNumber(from) : gregorianLabel(from)

  return COMMON_COPY.dateRange(fromLabel, gregorianLabel(to))
}

function hebrewMonthsSpan(months: HebrewMonth[]): string {
  const first = months[0]
  const last = months[months.length - 1]

  if (first === last) {
    return CALENDAR_COPY.hebrewMonth(first.name, first.year)
  }

  if (first.year === last.year) {
    return CALENDAR_COPY.hebrewMonth(COMMON_COPY.dateRange(first.name, last.name), last.year)
  }

  return COMMON_COPY.dateRange(
    CALENDAR_COPY.hebrewMonth(first.name, first.year),
    CALENDAR_COPY.hebrewMonth(last.name, last.year),
  )
}

export function hebrewMonthsLabel(month: string): string {
  return hebrewMonthsSpan(hebrewMonthsBetween(month, monthEnd(month)))
}

export const holidayRunDays = ({ from, to }: HolidayRun) =>
  from === to ? dayNumber(from) : COMMON_COPY.dateRange(dayNumber(from), dayNumber(to))
