import { parseIsoDate } from './logicalDay'
import type { Attendance, Prayer } from './types'

const weekdayNames = ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת']

const weekdayLetters = ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳']

export const PRAYER_LABELS: Record<Prayer, string> = {
  shacharit: 'שחרית',
  musaf: 'מוסף',
  mincha: 'מנחה',
  maariv: 'ערבית',
}

export const TRACK_LABELS: Record<Prayer | 'torah', string> = { ...PRAYER_LABELS, torah: 'תורה' }

export const ATTENDANCE_LABELS: Record<Attendance, string> = {
  minyan: 'במניין',
  alone: 'ביחידות',
}

const monthFormat = new Intl.DateTimeFormat('he', { month: 'long', year: 'numeric' })

export function monthTitle(date: string): string {
  return monthFormat.format(parseIsoDate(date))
}

export function weekdayName(date: string): string {
  return weekdayNames[parseIsoDate(date).getDay()]
}

export function shortWeekday(date: string): string {
  return weekdayLetters[parseIsoDate(date).getDay()]
}

export function streakLabel(days: number): string {
  if (days === 0) {
    return 'אין רצף'
  }

  return days === 1 ? 'יום אחד ברצף' : `${days} ימים ברצף`
}

export function emptyDayLabel(date: string): string {
  const name = weekdayName(date)
  const day = `${name} ${gregorianLabel(date)}`

  return name === 'שבת' ? `${day} לא מולאה` : `${day} לא מולא`
}

export function blankMaarivLabel(date: string): string {
  return `ערבית של ${weekdayName(date)} ${gregorianLabel(date)} לא סומנה`
}

export function gregorianLabel(date: string): string {
  const parsed = parseIsoDate(date)

  return `${parsed.getDate()}.${parsed.getMonth() + 1}`
}
