import {
  DAYS_PER_WEEK,
  MONTHS_PER_QUARTER,
  addDays,
  daysInRange,
  monthStart,
  parseIsoDate,
  quarterStart,
  weekStart,
  yearStart,
} from './logicalDay'
import { prayersForDay } from './prayersForDay'
import { type DateRange, periodTotals, type StatsPeriod } from './totals'
import type { DayRecord, PrayerTally } from './types'

export type TrendUnit = 'day' | 'week' | 'month' | 'quarter' | 'year'

export interface TrendBucket {
  start: string
  end: string
  tally: PrayerTally
}

const WEEKLY_SPAN_WEEKS = 12

const MAX_COLUMNS = 36

const MONTHS_PER_YEAR = 12

const UNIT_START: Record<TrendUnit, (date: string) => string> = {
  day: (date) => date,
  week: weekStart,
  month: monthStart,
  quarter: quarterStart,
  year: yearStart,
}

function monthIndex(date: string): number {
  const parsed = parseIsoDate(date)

  return parsed.getFullYear() * MONTHS_PER_YEAR + parsed.getMonth()
}

const columnCount = ({ from, to }: DateRange, monthsPerColumn: number) =>
  Math.floor(monthIndex(to) / monthsPerColumn) - Math.floor(monthIndex(from) / monthsPerColumn) + 1

export function trendUnit(period: StatsPeriod, range: DateRange): TrendUnit {
  if (period === 'week') {
    return 'day'
  }
  if (period === 'month') {
    return 'week'
  }

  if (range.from >= addDays(range.to, 1 - WEEKLY_SPAN_WEEKS * DAYS_PER_WEEK)) {
    return 'week'
  }
  if (columnCount(range, 1) <= MAX_COLUMNS) {
    return 'month'
  }

  return columnCount(range, MONTHS_PER_QUARTER) <= MAX_COLUMNS ? 'quarter' : 'year'
}

export function trendBuckets(records: DayRecord[], range: DateRange, unit: TrendUnit, today: string): TrendBucket[] {
  const starts = [
    ...new Set(
      daysInRange(range.from, range.to).map((date) => {
        const start = UNIT_START[unit](date)

        return start < range.from ? range.from : start
      }),
    ),
  ]

  return starts.map((start, index) => {
    const end = index + 1 < starts.length ? addDays(starts[index + 1], -1) : range.to
    const tally = periodTotals(records, start, end < today ? end : addDays(today, -1), today).prayers

    return { start, end, tally: start <= today && today <= end ? addMarkedToday(tally, records, today) : tally }
  })
}

function addMarkedToday(tally: PrayerTally, records: DayRecord[], today: string): PrayerTally {
  const record = records.find((day) => day.date === today)

  for (const prayer of prayersForDay(today)) {
    const mark = record?.prayers[prayer]
    if (mark) {
      tally[mark] += 1
      tally.total += 1
    }
  }

  return tally
}
