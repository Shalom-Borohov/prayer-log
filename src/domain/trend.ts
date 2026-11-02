import { DAYS_PER_WEEK, addDays, daysInRange, monthStart, weekStart } from './logicalDay'
import { prayersForDay } from './prayersForDay'
import { type DateRange, periodTotals, type StatsPeriod } from './totals'
import type { DayRecord, PrayerTally } from './types'

export type TrendUnit = 'day' | 'week' | 'month'

export interface TrendBucket {
  start: string
  end: string
  tally: PrayerTally
}

const WEEKLY_SPAN_WEEKS = 12

const UNIT_START: Record<TrendUnit, (date: string) => string> = {
  day: (date) => date,
  week: weekStart,
  month: monthStart,
}

export function trendUnit(period: StatsPeriod, range: DateRange): TrendUnit {
  if (period === 'week') {
    return 'day'
  }
  if (period === 'month') {
    return 'week'
  }

  return range.from >= addDays(range.to, 1 - WEEKLY_SPAN_WEEKS * DAYS_PER_WEEK) ? 'week' : 'month'
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
