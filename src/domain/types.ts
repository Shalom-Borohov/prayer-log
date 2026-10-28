export const PRAYERS = ['shacharit', 'musaf', 'mincha', 'maariv'] as const

export const DAILY_PRAYERS = ['shacharit', 'mincha', 'maariv'] as const

export type Prayer = (typeof PRAYERS)[number]

export type DailyPrayer = (typeof DAILY_PRAYERS)[number]

export const ATTENDANCES = ['minyan', 'alone'] as const

export type Attendance = (typeof ATTENDANCES)[number]

export interface DayRecord {
  date: string
  prayers: Partial<Record<Prayer, Attendance>>
  torah: boolean
  torahNote?: string
}

export const isEmptyDay = (day: DayRecord) =>
  !day.torah && !day.torahNote && Object.values(day.prayers).every((mark) => mark === undefined)

export interface Streak {
  current: number
  best: number
}

export type StreakKey = DailyPrayer | 'torah'

export interface PrayerTally {
  minyan: number
  alone: number
  total: number
}

export interface PeriodTotals {
  prayers: PrayerTally
  perPrayer: Record<Prayer, PrayerTally>
  torah: { days: number; total: number }
}
