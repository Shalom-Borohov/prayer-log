import { COMMON_COPY } from '../../copy/common'
import { type DayStar, bucketShare, dayStar } from '../../domain/dayStar'
import {
  dayLabel,
  dayOfMonth,
  gregorianLabel,
  monthName,
  monthTitle,
  shortMonth,
  shortWeekday,
  yearLabel,
} from '../../domain/format'
import { daysInRange, quarterEnd, quarterStart, yearStart } from '../../domain/logicalDay'
import { type DateRange, dayTallies, type StatsPeriod } from '../../domain/totals'
import { type BucketUnit, trendBuckets, type TrendUnit, trendUnit } from '../../domain/trend'
import type { DayRecord, PrayerTally } from '../../domain/types'
import { STATS_COPY } from './copy'

export type StarMark = { kind: 'disc'; scale: number } | { kind: 'plus' } | { kind: 'none' }

export interface LineStar {
  key: string
  mark: StarMark
  label: string | null
  spokenName?: string
  isToday: boolean
}

export interface StarLineModel {
  unit: TrendUnit
  stars: LineStar[]
}

const FULL_DISC = 14

const PART_DISC = 8

const FAINT_DISC = 4

const disc = (size: number): StarMark => ({ kind: 'disc', scale: size / FULL_DISC })

const NONE: StarMark = { kind: 'none' }

const DAY_MARK: Record<DayStar, StarMark> = {
  full: disc(FULL_DISC),
  part: disc(PART_DISC),
  faint: disc(FAINT_DISC),
  unmarked: { kind: 'plus' },
  pending: NONE,
  blank: NONE,
}

function bucketMark(tally: PrayerTally): StarMark {
  const share = bucketShare(tally)

  if (share === null) {
    return NONE
  }

  if (tally.minyan + tally.alone + tally.shema === 0) {
    return { kind: 'plus' }
  }

  return disc(FAINT_DISC + share * (FULL_DISC - FAINT_DISC))
}

const NUMBERED_EVERY = 5

const TODAY_LABEL_CLEARANCE = 2

const MAX_TICKS = 7

const TICK_LABEL: Record<BucketUnit, (date: string) => string> = {
  week: gregorianLabel,
  month: shortMonth,
  quarter: yearLabel,
  year: yearLabel,
}

const SPOKEN_LABEL: Record<TrendUnit, (bucket: DateRange) => string> = {
  day: ({ from }) => dayLabel(from),
  week: ({ from, to }) => COMMON_COPY.dateRange(gregorianLabel(from), gregorianLabel(to)),
  month: ({ from }) => monthTitle(from),
  quarter: ({ from }) => COMMON_COPY.dateRange(monthName(quarterStart(from)), monthTitle(quarterEnd(from))),
  year: ({ from }) => yearLabel(from),
}

const isInFirstQuarter = (date: string) => quarterStart(date) === yearStart(date)

function spokenName(unit: TrendUnit, bucket: DateRange, tally: PrayerTally | null): string | undefined {
  if (tally === null || tally.total === 0) {
    return undefined
  }

  return STATS_COPY.trendBucket(SPOKEN_LABEL[unit](bucket), tally.minyan, tally.alone + tally.shema, tally.total)
}

function monthDayLabel(date: string, today: string): string | null {
  const day = dayOfMonth(date)

  if (date === today) {
    return String(day)
  }

  const isNearToday = Math.abs(day - dayOfMonth(today)) <= TODAY_LABEL_CLEARANCE
  const isNumbered = day === 1 || day % NUMBERED_EVERY === 0

  return isNumbered && !isNearToday ? String(day) : null
}

function dayLine(records: DayRecord[], range: DateRange, period: StatsPeriod, today: string): StarLineModel {
  const dates = daysInRange(range.from, range.to)
  const tallies = dayTallies(records, dates, today)

  const stars = dates.map((date, index) => ({
    key: date,
    mark: DAY_MARK[dayStar(tallies[index], date === today)],
    label: period === 'week' ? shortWeekday(date) : monthDayLabel(date, today),
    spokenName: spokenName('day', { from: date, to: date }, tallies[index]),
    isToday: date === today,
  }))

  return { unit: 'day', stars }
}

function bucketLine(records: DayRecord[], range: DateRange, today: string): StarLineModel {
  const unit = trendUnit(range)
  const buckets = trendBuckets(records, range, unit, today)
  const tickStep = Math.ceil(buckets.length / MAX_TICKS)

  const hasTick = (start: string, index: number) =>
    unit === 'quarter' ? isInFirstQuarter(start) : index % tickStep === 0

  const stars = buckets.map(({ start, end, tally }, index) => ({
    key: start,
    mark: bucketMark(tally),
    label: hasTick(start, index) ? TICK_LABEL[unit](start) : null,
    spokenName: spokenName(unit, { from: start, to: end }, tally),
    isToday: start <= today && today <= end,
  }))

  return { unit, stars }
}

export function starLine(records: DayRecord[], range: DateRange, period: StatsPeriod, today: string): StarLineModel {
  return period === 'all' ? bucketLine(records, range, today) : dayLine(records, range, period, today)
}
