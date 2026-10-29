import { DAYS_PER_WEEK, addDays, daysInRange, monthEnd, monthStart, weekStart } from './logicalDay'
import { prayersForDay } from './prayersForDay'
import type { Attendance, DayRecord, PeriodTotals, PrayerTally } from './types'

export interface DateRange {
  from: string
  to: string
}

export function weekRange(today: string): DateRange {
  const from = weekStart(today)

  return { from, to: addDays(from, DAYS_PER_WEEK - 1) }
}

export function monthRange(today: string): DateRange {
  return { from: monthStart(today), to: monthEnd(today) }
}

const emptyTally = (): PrayerTally => ({ minyan: 0, alone: 0, total: 0 })

function emptyTotals(): PeriodTotals {
  return {
    prayers: emptyTally(),
    perPrayer: { shacharit: emptyTally(), musaf: emptyTally(), mincha: emptyTally(), maariv: emptyTally() },
    torah: { days: 0, total: 0 },
  }
}

function count(tally: PrayerTally, mark: Attendance | undefined) {
  tally.total += 1
  if (mark) {
    tally[mark] += 1
  }
}

export function trackingStart(records: DayRecord[]): string | null {
  return records.reduce<string | null>((first, day) => (first === null || day.date < first ? day.date : first), null)
}

export function periodTotals(records: DayRecord[], from: string, to: string, today: string): PeriodTotals {
  const totals = emptyTotals()
  const start = trackingStart(records)
  if (start === null) {
    return totals
  }

  const byDate = new Map(records.map((day) => [day.date, day]))
  for (const date of daysInRange(start > from ? start : from, to < today ? to : today)) {
    const record = byDate.get(date)
    totals.torah.total += 1
    if (record?.torah) {
      totals.torah.days += 1
    }
    for (const prayer of prayersForDay(date)) {
      count(totals.prayers, record?.prayers[prayer])
      count(totals.perPrayer[prayer], record?.prayers[prayer])
    }
  }

  return totals
}
