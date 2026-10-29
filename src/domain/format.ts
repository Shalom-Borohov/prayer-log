import { FORMAT_COPY } from '../copy/format'
import { parseIsoDate } from './logicalDay'

const MONTH_LOCALE = 'he'

export const LIST_SEPARATOR = ' · '

const monthFormat = new Intl.DateTimeFormat(MONTH_LOCALE, { month: 'long', year: 'numeric' })

export function monthTitle(date: string): string {
  return monthFormat.format(parseIsoDate(date))
}

export function weekdayName(date: string): string {
  return FORMAT_COPY.weekdays[parseIsoDate(date).getDay()]
}

export function shortWeekday(date: string): string {
  return FORMAT_COPY.weekdayLetters[parseIsoDate(date).getDay()]
}

export function streakLabel(days: number): string {
  if (days === 0) {
    return FORMAT_COPY.noStreak
  }

  return days === 1 ? FORMAT_COPY.oneDayStreak : FORMAT_COPY.daysStreak(days)
}

export function gregorianLabel(date: string): string {
  const parsed = parseIsoDate(date)

  return `${parsed.getDate()}.${parsed.getMonth() + 1}`
}

export function dayLabel(date: string): string {
  return `${weekdayName(date)} ${gregorianLabel(date)}`
}
