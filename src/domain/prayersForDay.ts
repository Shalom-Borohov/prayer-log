import { hasMusaf, hasTefillin } from './hebrewCalendar'
import { ATTENDANCES, type Attendance, PRAYERS, type Prayer, SHEMA_PRAYERS, WORN_ITEMS, type WornItem } from './types'

export const isShemaPrayer = (prayer: Prayer) => SHEMA_PRAYERS.some((shemaPrayer) => shemaPrayer === prayer)

export function prayersForDay(date: string): Prayer[] {
  return PRAYERS.filter((prayer) => prayer !== 'musaf' || hasMusaf(date))
}

export function attendancesFor(prayer: Prayer): Attendance[] {
  return ATTENDANCES.filter((attendance) => attendance !== 'shema' || isShemaPrayer(prayer))
}

export function wornItemsForDay(date: string): WornItem[] {
  return WORN_ITEMS.filter((item) => item !== 'tefillin' || hasTefillin(date))
}
