import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import {
  dayLabel,
  gregorianLabel,
  LIST_SEPARATOR,
  monthName,
  monthTitle,
  shortMonth,
  shortWeekday,
  yearLabel,
} from '../../domain/format'
import { quarterEnd, quarterStart, yearStart } from '../../domain/logicalDay'
import type { DateRange, StatsPeriod } from '../../domain/totals'
import { trendBuckets, type TrendUnit, trendUnit } from '../../domain/trend'
import type { DayRecord } from '../../domain/types'
import { STATS_COPY } from './copy'

const MAX_TICKS = 7

const TICK_LABEL: Record<TrendUnit, (date: string) => string> = {
  day: shortWeekday,
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

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`

interface TrendChartProps {
  records: DayRecord[]
  range: DateRange
  period: StatsPeriod
  today: string
}

export function TrendChart({ records, range, period, today }: TrendChartProps) {
  const headingId = useId()
  const unit = trendUnit(period, range)

  const columns = trendBuckets(records, range, unit, today).map(({ start, end, tally }) => ({
    start,
    end,
    minyan: tally.minyan,
    other: tally.alone + tally.shema,
    total: tally.total,
  }))

  const tickStep = Math.ceil(columns.length / MAX_TICKS)

  const hasTick = (start: string, index: number) =>
    unit === 'quarter' ? isInFirstQuarter(start) : index % tickStep === 0

  const label =
    columns
      .filter(({ total }) => total > 0)
      .map(({ start, end, minyan, other, total }) =>
        STATS_COPY.trendBucket(SPOKEN_LABEL[unit]({ from: start, to: end }), minyan, other, total),
      )
      .join(LIST_SEPARATOR) || COMMON_COPY.noData

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.trendHeading[unit]}
      </h3>
      <div className="inset-group trend" role="group" aria-labelledby={headingId}>
        <div className="trend-plot" role="img" aria-label={label}>
          {columns.map(({ start, minyan, other, total }) => (
            <span key={start} className="trend-slot">
              {total > 0 && (
                <span className="trend-column">
                  <span className="trend-other" style={{ height: percent(other, total) }} />
                  <span className="trend-minyan" style={{ height: percent(minyan, total) }} />
                </span>
              )}
            </span>
          ))}
        </div>
        <div className="trend-ticks" aria-hidden="true">
          {columns.map(({ start }, index) => (
            <span key={start}>{hasTick(start, index) && TICK_LABEL[unit](start)}</span>
          ))}
        </div>
        <ul className="trend-key">
          <li>
            <i className="trend-swatch trend-minyan" aria-hidden="true" />
            {COMMON_COPY.attendance.minyan}
          </li>
          <li>
            <i className="trend-swatch trend-other" aria-hidden="true" />
            {STATS_COPY.trendOther}
          </li>
          <li>
            <i className="trend-swatch trend-unmarked" aria-hidden="true" />
            {COMMON_COPY.unmarked}
          </li>
        </ul>
      </div>
    </>
  )
}
