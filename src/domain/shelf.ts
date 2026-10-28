import { addDays, daysInRange } from './logicalDay'
import { trackingStart } from './totals'
import type { DayRecord, Prayer } from './types'

export type SlotState = 'gold' | 'plain' | 'empty' | 'none'

export function slotFor(record: DayRecord | undefined, key: Prayer | 'torah'): SlotState {
  if (!record) {
    return 'empty'
  }

  if (key === 'torah') {
    return record.torah ? 'gold' : 'empty'
  }

  const mark = record.prayers[key]

  if (mark === 'minyan') {
    return 'gold'
  }

  return mark === 'alone' ? 'plain' : 'empty'
}

export function shelfLabel(slots: SlotState[], key: Prayer | 'torah'): string {
  const done = key === 'torah' ? 'עם לימוד' : 'במניין'

  return `${slots.filter((slot) => slot === 'gold').length} מתוך ${slots.length} הימים האחרונים ${done}`
}

export function shelfSlots(records: DayRecord[], key: Prayer | 'torah', end: string, count: number): SlotState[] {
  const start = trackingStart(records)
  const byDate = new Map(records.map((day) => [day.date, day]))

  return daysInRange(addDays(end, 1 - count), end).map((date) =>
    start === null || date < start ? 'none' : slotFor(byDate.get(date), key),
  )
}
