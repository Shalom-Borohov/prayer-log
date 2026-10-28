import { isRestDay } from './hebrewCalendar'
import { addDays, daysInRange } from './logicalDay'
import { trackingStart } from './totals'
import { type DayRecord, isEmptyDay } from './types'

export interface BackfillReminder {
  date: string
  kind: 'empty' | 'eveMaariv'
}

function recentDays(records: DayRecord[], today: string): string[] {
  const start = trackingStart(records)
  if (start === null) {
    return []
  }

  const weekAgo = addDays(today, -7)

  return daysInRange(start > weekAgo ? start : weekAgo, addDays(today, -1))
}

const markedDays = (records: DayRecord[]) => new Map(records.filter((day) => !isEmptyDay(day)).map((day) => [day.date, day]))

export function emptyRecentDays(records: DayRecord[], today: string): string[] {
  const marked = markedDays(records)

  return recentDays(records, today).filter((date) => !marked.has(date))
}

export function blankEveMaariv(records: DayRecord[], today: string): string[] {
  const marked = markedDays(records)

  return recentDays(records, today).filter((date) => {
    const record = marked.get(date)

    return record !== undefined && record.prayers.maariv === undefined && isRestDay(addDays(date, 1))
  })
}

export function backfillReminders(records: DayRecord[], today: string): BackfillReminder[] {
  return [
    ...emptyRecentDays(records, today).map((date) => ({ date, kind: 'empty' as const })),
    ...blankEveMaariv(records, today).map((date) => ({ date, kind: 'eveMaariv' as const })),
  ].sort((first, second) => first.date.localeCompare(second.date))
}
