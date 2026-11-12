import { FORMAT_COPY } from '../copy/format'
import { pad, parseIsoDate, toIsoDate } from './logicalDay'

const MONTH_LOCALE = 'he'

export const LIST_SEPARATOR = ' · '

const monthFormat = new Intl.DateTimeFormat(MONTH_LOCALE, { month: 'long', year: 'numeric' })

const monthNameFormat = new Intl.DateTimeFormat(MONTH_LOCALE, { month: 'long' })

const shortMonthFormat = new Intl.DateTimeFormat(MONTH_LOCALE, { month: 'short' })

export function monthTitle(date: string): string {
  return monthFormat.format(parseIsoDate(date))
}

export function monthName(date: string): string {
  return monthNameFormat.format(parseIsoDate(date))
}

export function yearLabel(date: string): string {
  return String(parseIsoDate(date).getFullYear())
}

export function shortMonth(date: string): string {
  return shortMonthFormat.format(parseIsoDate(date))
}

export function weekdayName(date: string): string {
  return FORMAT_COPY.weekdays[parseIsoDate(date).getDay()]
}

export function shortWeekday(date: string): string {
  return FORMAT_COPY.weekdayLetters[parseIsoDate(date).getDay()]
}

export function streakLabel(days: number): string | null {
  if (days === 0) {
    return null
  }

  return FORMAT_COPY.streak(days)
}

export const dayOfMonth = (date: string) => parseIsoDate(date).getDate()

export function gregorianLabel(date: string): string {
  const parsed = parseIsoDate(date)

  return `${parsed.getDate()}.${parsed.getMonth() + 1}`
}

export function fullDateLabel(date: string): string {
  return `${gregorianLabel(date)}.${parseIsoDate(date).getFullYear()}`
}

export function dateTimeLabel(timestamp: number): string {
  const date = new Date(timestamp)

  return `${fullDateLabel(toIsoDate(date))} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function dayLabel(date: string): string {
  return `${weekdayName(date)} ${gregorianLabel(date)}`
}
