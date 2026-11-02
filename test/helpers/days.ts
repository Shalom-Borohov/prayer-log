import { daysInRange } from '../../src/domain/logicalDay'
import type { DayRecord } from '../../src/domain/types'

type DayFields = Partial<Omit<DayRecord, 'date'>>

export const allMinyan = { shacharit: 'minyan', mincha: 'minyan', maariv: 'minyan' } as const

export const tally = (minyan: number, alone: number, total: number, shema = 0) => ({ minyan, alone, shema, total })

export function day(date: string, fields: DayFields = {}): DayRecord {
  return { date, prayers: {}, torah: false, ...fields }
}

export function days(from: string, to: string, fields: DayFields = {}): DayRecord[] {
  return daysInRange(from, to).map((date) => day(date, fields))
}
