import { COMMON_COPY } from '../copy/common'
import { FORMAT_COPY } from '../copy/format'
import { addDays, daysInRange } from './logicalDay'
import { trackingStart } from './totals'
import type { Attendance, DayRecord, Prayer } from './types'

export type SlotState = 'gold' | 'plain' | 'short' | 'empty' | 'none'

const MARK_SLOTS = { minyan: 'gold', alone: 'plain', shema: 'short' } as const satisfies Record<Attendance, SlotState>

export function slotFor(record: DayRecord | undefined, key: Prayer | 'torah'): SlotState {
  if (!record) {
    return 'empty'
  }

  if (key === 'torah') {
    return record.torah ? 'gold' : 'empty'
  }

  const mark = record.prayers[key]

  return mark ? MARK_SLOTS[mark] : 'empty'
}

export function shelfLabel(slots: SlotState[], key: Prayer | 'torah'): string {
  const doneLabel = key === 'torah' ? FORMAT_COPY.withLearning : COMMON_COPY.attendance.minyan

  return FORMAT_COPY.recentDays(slots.filter((slot) => slot === 'gold').length, slots.length, doneLabel)
}

export function shelfSlots(records: DayRecord[], key: Prayer | 'torah', end: string, count: number): SlotState[] {
  const start = trackingStart(records)
  const byDate = new Map(records.map((day) => [day.date, day]))

  return daysInRange(addDays(end, 1 - count), end).map((date) =>
    start === null || date < start ? 'none' : slotFor(byDate.get(date), key),
  )
}
