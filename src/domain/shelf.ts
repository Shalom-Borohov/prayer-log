import { COMMON_COPY } from '../copy/common'
import { FORMAT_COPY } from '../copy/format'
import { prayersForDay } from './prayersForDay'
import { trackingStart } from './totals'
import { type Attendance, type DayRecord, type Prayer, PRAYERS } from './types'

export type SlotState = 'done' | 'alone' | 'shema' | 'unmarked' | 'blank'

export type ShelfKey = Prayer | 'torah'

export interface ShelfRow {
  key: ShelfKey
  slots: SlotState[]
}

const MARK_SLOTS = { minyan: 'done', alone: 'alone', shema: 'shema' } as const satisfies Record<Attendance, SlotState>

export function slotFor(record: DayRecord | undefined, key: ShelfKey): SlotState {
  if (key === 'torah') {
    return record?.torah ? 'done' : 'unmarked'
  }

  const mark = record?.prayers[key]

  return mark ? MARK_SLOTS[mark] : 'unmarked'
}

export function shelfRows(records: DayRecord[], dates: string[], today: string): ShelfRow[] {
  const start = trackingStart(records)
  const byDate = new Map(records.map((day) => [day.date, day]))
  const dueOn = new Map(dates.map((date) => [date, prayersForDay(date)]))
  const isDue = (date: string, key: ShelfKey) => key === 'torah' || dueOn.get(date)?.includes(key) === true

  const slotOn = (date: string, key: ShelfKey): SlotState =>
    start === null || date < start || date > today || !isDue(date, key) ? 'blank' : slotFor(byDate.get(date), key)

  const keys: ShelfKey[] = [...PRAYERS.filter((prayer) => dates.some((date) => isDue(date, prayer))), 'torah']

  return keys.map((key) => ({ key, slots: dates.map((date) => slotOn(date, key)) }))
}

export function shelfLabel(slots: SlotState[], key: ShelfKey): string {
  const tracked = slots.filter((slot) => slot !== 'blank')

  if (tracked.length === 0) {
    return COMMON_COPY.noData
  }

  const doneLabel = key === 'torah' ? FORMAT_COPY.withLearning : COMMON_COPY.attendance.minyan

  return FORMAT_COPY.recentDays(slots.filter((slot) => slot === 'done').length, tracked.length, doneLabel)
}
