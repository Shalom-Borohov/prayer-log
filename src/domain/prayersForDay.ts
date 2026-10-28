import { hasMusaf } from './hebrewCalendar'
import { PRAYERS, type Prayer } from './types'

export function prayersForDay(date: string): Prayer[] {
  return PRAYERS.filter((prayer) => prayer !== 'musaf' || hasMusaf(date))
}
