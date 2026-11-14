import { daysInRange } from '../../domain/logicalDay'
import { type ShelfRow, shelfRows } from '../../domain/shelf'
import { periodRange, type StatsPeriod } from '../../domain/totals'
import type { DayRecord } from '../../domain/types'

export interface PeriodShelves {
  todayIndex: number
  rows: ShelfRow[]
}

export function periodShelves(records: DayRecord[], period: StatsPeriod, today: string): PeriodShelves | null {
  if (period === 'all') {
    return null
  }

  const { from, to } = periodRange(period, records, today)
  const dates = daysInRange(from, to)

  return { todayIndex: dates.indexOf(today), rows: shelfRows(records, dates, today) }
}
