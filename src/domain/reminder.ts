import { isRestDay } from './hebrewCalendar'
import { addDays } from './logicalDay'
import { prayersForDay } from './prayersForDay'
import type { DayRecord, Prayer } from './types'

export function missingPrayers(day: DayRecord | undefined, date: string): Prayer[] {
  return prayersForDay(date).filter((prayer) => !day?.prayers[prayer])
}

export function skipNights(from: string, days: number): string[] {
  return Array.from({ length: days }, (_, offset) => addDays(from, offset)).filter((date) =>
    isRestDay(addDays(date, 1)),
  )
}
