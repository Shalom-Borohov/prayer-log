import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { gregorianLabel, LIST_SEPARATOR, monthName, monthTitle, shortMonth, yearLabel } from '../../domain/format'
import { quarterEnd, quarterStart, yearStart } from '../../domain/logicalDay'
import type { DateRange } from '../../domain/totals'
import { type TrendBucket, type TrendUnit, trendBuckets, trendUnit } from '../../domain/trend'
import type { DayRecord } from '../../domain/types'
import { STATS_COPY } from './copy'
import './trend.css'

const MAX_TICKS = 7

const TICK_LABEL: Record<TrendUnit, (date: string) => string> = {
  week: gregorianLabel,
  month: shortMonth,
  quarter: yearLabel,
  year: yearLabel,
}

const SPOKEN_LABEL: Record<TrendUnit, (bucket: DateRange) => string> = {
  week: ({ from, to }) => COMMON_COPY.dateRange(gregorianLabel(from), gregorianLabel(to)),
  month: ({ from }) => monthTitle(from),
  quarter: ({ from }) => COMMON_COPY.dateRange(monthName(quarterStart(from)), monthTitle(quarterEnd(from))),
  year: ({ from }) => yearLabel(from),
}

const isInFirstQuarter = (date: string) => quarterStart(date) === yearStart(date)

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`

const otherOf = ({ tally }: TrendBucket) => tally.alone + tally.shema

function spokenPlot(unit: TrendUnit, buckets: TrendBucket[]): string {
  const spoken = buckets
    .filter(({ tally }) => tally.total > 0)
    .map((bucket) =>
      STATS_COPY.trendBucket(
        SPOKEN_LABEL[unit]({ from: bucket.start, to: bucket.end }),
        bucket.tally.minyan,
        otherOf(bucket),
        bucket.tally.total,
      ),
    )

  return spoken.length > 0 ? spoken.join(LIST_SEPARATOR) : COMMON_COPY.noData
}

function Column({ bucket }: { bucket: TrendBucket }) {
  const { minyan, total } = bucket.tally

  return (
    <span className="trend-slot">
      {total > 0 && (
        <span className="trend-column">
          <span className="trend-minyan" style={{ height: percent(minyan, total) }} />
          <span className="trend-other" style={{ height: percent(otherOf(bucket), total) }} />
        </span>
      )}
    </span>
  )
}

interface TrendColumnsProps {
  records: DayRecord[]
  range: DateRange
  today: string
}

export function TrendColumns({ records, range, today }: TrendColumnsProps) {
  const headingId = useId()
  const unit = trendUnit(range)
  const buckets = trendBuckets(records, range, unit, today)
  const tickStep = Math.ceil(buckets.length / MAX_TICKS)

  const hasTick = (start: string, index: number) =>
    unit === 'quarter' ? isInFirstQuarter(start) : index % tickStep === 0

  const isCurrent = ({ start, end }: TrendBucket) => start <= today && today <= end

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.trendHeading[unit]}
      </h3>
      <div className="trend" role="group" aria-labelledby={headingId}>
        <div className="trend-plot" role="img" aria-label={spokenPlot(unit, buckets)}>
          {buckets.map((bucket) => (
            <Column key={bucket.start} bucket={bucket} />
          ))}
        </div>
        <div className="trend-ticks" aria-hidden="true">
          {buckets.map((bucket, index) => (
            <span key={bucket.start} className={`trend-tick${isCurrent(bucket) ? ' is-today' : ''}`}>
              {hasTick(bucket.start, index) && TICK_LABEL[unit](bucket.start)}
            </span>
          ))}
        </div>
        <ul className="trend-key">
          <li>
            <i className="trend-swatch trend-minyan" aria-hidden="true" />
            {STATS_COPY.trendKey.minyan}
          </li>
          <li>
            <i className="trend-swatch trend-other" aria-hidden="true" />
            {STATS_COPY.trendKey.other}
          </li>
          <li>
            <i className="trend-swatch trend-unmarked" aria-hidden="true" />
            {STATS_COPY.trendKey.unmarked}
          </li>
        </ul>
      </div>
    </>
  )
}
