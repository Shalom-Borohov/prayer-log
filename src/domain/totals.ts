import { DAYS_PER_WEEK, addDays, daysInRange, monthEnd, monthStart, weekStart } from './logicalDay'
import { prayersForDay, wornItemsForDay } from './prayersForDay'
import type { Attendance, DayRecord, DayTally, PeriodTotals, PrayerTally } from './types'

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

const emptyTally = (): PrayerTally => ({ minyan: 0, alone: 0, shema: 0, total: 0 })

const emptyDayTally = (): DayTally => ({ days: 0, total: 0 })

function emptyTotals(): PeriodTotals {
  return {
    prayers: emptyTally(),
    perPrayer: { shacharit: emptyTally(), musaf: emptyTally(), mincha: emptyTally(), maariv: emptyTally() },
    torah: emptyDayTally(),
    tefillin: emptyDayTally(),
    tallit: emptyDayTally(),
  }
}

function count(tally: PrayerTally, mark: Attendance | undefined) {
  tally.total += 1
  if (mark) {
    tally[mark] += 1
  }
}

function countDay(tally: DayTally, done: boolean | undefined) {
  tally.total += 1
  if (done) {
    tally.days += 1
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
    countDay(totals.torah, record?.torah)
    for (const item of wornItemsForDay(date)) {
      countDay(totals[item], record?.[item])
    }
    for (const prayer of prayersForDay(date)) {
      count(totals.prayers, record?.prayers[prayer])
      count(totals.perPrayer[prayer], record?.prayers[prayer])
    }
  }

  return totals
}
