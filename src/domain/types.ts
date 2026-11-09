import type { GemaraTractate, MishnaTractate } from './tractates'

export const PRAYERS = ['shacharit', 'musaf', 'mincha', 'maariv'] as const

export const DAILY_PRAYERS = ['shacharit', 'mincha', 'maariv'] as const

export const SHEMA_PRAYERS = ['shacharit', 'maariv'] as const

export const WORN_AT_PRAYER = 'shacharit' satisfies Prayer

export type Prayer = (typeof PRAYERS)[number]

export type DailyPrayer = (typeof DAILY_PRAYERS)[number]

export const ATTENDANCES = ['minyan', 'alone', 'shema'] as const

export type Attendance = (typeof ATTENDANCES)[number]

export const LEARNING_KINDS = ['gemara', 'mishna'] as const

export type LearningKind = (typeof LEARNING_KINDS)[number]

export type LearningEntry =
  | { kind: 'gemara'; tractate: GemaraTractate; daf: number }
  | { kind: 'mishna'; tractate: MishnaTractate; chapter: number }

export const WORN_ITEMS = ['tefillin', 'tallit'] as const

export type WornItem = (typeof WORN_ITEMS)[number]

export interface DayRecord {
  date: string
  prayers: Partial<Record<Prayer, Attendance>>
  places?: Partial<Record<Prayer, string>>
  torah: boolean
  torahNote?: string
  learning?: LearningEntry[]
  tefillin?: boolean
  tallit?: boolean
}

export const hasNoMarks = (day: DayRecord) =>
  !day.torah && WORN_ITEMS.every((item) => !day[item]) && Object.values(day.prayers).every((mark) => mark === undefined)

export const isEmptyDay = (day: DayRecord) => hasNoMarks(day) && !day.torahNote && !day.learning?.length

export interface Streak {
  current: number
  best: number
}

export type StreakKey = DailyPrayer | 'torah'

export interface PrayerTally {
  minyan: number
  alone: number
  shema: number
  total: number
}

export interface DayTally {
  days: number
  total: number
}

export interface PeriodTotals {
  prayers: PrayerTally
  perPrayer: Record<Prayer, PrayerTally>
  torah: DayTally
  tefillin: DayTally
  tallit: DayTally
}
