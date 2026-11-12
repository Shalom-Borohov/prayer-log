import { DAYS_PER_WEEK, addDays, daysInRange, monthEnd, monthStart, weekStart } from './logicalDay'
import { prayersForDay, wornItemsForDay } from './prayersForDay'
import type { Attendance, DayRecord, DayTally, PeriodTotals, PrayerTally } from './types'

export interface DateRange {
  from: string
  to: string
}

export type StatsPeriod = 'week' | 'month' | 'all'

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

function count(tally: PrayerTally, mark: Attendance | undefined, onlyIfMarked: boolean) {
  if (mark) {
    tally[mark] += 1
  }
  if (mark || !onlyIfMarked) {
    tally.total += 1
  }
}

function countDay(tally: DayTally, done: boolean | undefined, onlyIfMarked: boolean) {
  if (done) {
    tally.days += 1
  }
  if (done || !onlyIfMarked) {
    tally.total += 1
  }
}

export function dayTally(record: DayRecord | undefined, date: string, today: string): PrayerTally {
  const tally = emptyTally()
  for (const prayer of prayersForDay(date)) {
    count(tally, record?.prayers[prayer], date === today)
  }

  return tally
}

export function trackingStart(records: DayRecord[]): string | null {
  return records.reduce<string | null>((first, day) => (first === null || day.date < first ? day.date : first), null)
}

export function allTimeRange(records: DayRecord[], today: string): DateRange {
  return { from: trackingStart(records) ?? today, to: today }
}

export function periodRange(period: StatsPeriod, records: DayRecord[], today: string): DateRange {
  if (period === 'week') {
    return weekRange(today)
  }

  return period === 'month' ? monthRange(today) : allTimeRange(records, today)
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
    const inProgress = date === today
    countDay(totals.torah, record?.torah, inProgress)
    for (const item of wornItemsForDay(date)) {
      countDay(totals[item], record?.[item], inProgress)
    }
    for (const prayer of prayersForDay(date)) {
      count(totals.prayers, record?.prayers[prayer], inProgress)
      count(totals.perPrayer[prayer], record?.prayers[prayer], inProgress)
    }
  }

  return totals
}

export function dayTallies(records: DayRecord[], dates: string[], today: string): (PrayerTally | null)[] {
  const start = trackingStart(records)
  const byDate = new Map(records.map((day) => [day.date, day]))

  return dates.map((date) =>
    start === null || date < start || date > today ? null : dayTally(byDate.get(date), date, today),
  )
}
