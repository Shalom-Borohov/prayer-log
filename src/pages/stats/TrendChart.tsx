import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { dayLabel, gregorianLabel, LIST_SEPARATOR, monthTitle, shortMonth, shortWeekday } from '../../domain/format'
import type { DateRange, StatsPeriod } from '../../domain/totals'
import { trendBuckets, type TrendUnit, trendUnit } from '../../domain/trend'
import type { DayRecord } from '../../domain/types'
import { STATS_COPY } from './copy'

const MAX_TICKS = 7

const TICK_LABEL: Record<TrendUnit, (date: string) => string> = {
  day: shortWeekday,
  week: gregorianLabel,
  month: shortMonth,
}

const SPOKEN_LABEL: Record<TrendUnit, (bucket: DateRange) => string> = {
  day: ({ from }) => dayLabel(from),
  week: ({ from, to }) => COMMON_COPY.dateRange(gregorianLabel(from), gregorianLabel(to)),
  month: ({ from }) => monthTitle(from),
}

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

  const label = columns
    .filter(({ total }) => total > 0)
    .map(({ start, end, minyan, other, total }) =>
      STATS_COPY.trendBucket(SPOKEN_LABEL[unit]({ from: start, to: end }), minyan, other, total),
    )
    .join(LIST_SEPARATOR)

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
            <span key={start}>{index % tickStep === 0 && TICK_LABEL[unit](start)}</span>
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
