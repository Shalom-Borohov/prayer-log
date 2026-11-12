import { StarChart } from '../../components/StarChart'
import { COMMON_COPY } from '../../copy/common'
import { shortWeekday } from '../../domain/format'
import { DAYS_PER_WEEK, addDays, daysInRange } from '../../domain/logicalDay'
import { chartLines, starLabel } from '../../domain/stars'
import type { DayRecord } from '../../domain/types'
import { TODAY_COPY } from './copy'
import './week-chart.css'

export function WeekChart({ records, date, today }: { records: DayRecord[]; date: string; today: string }) {
  const dates = daysInRange(addDays(date, 1 - DAYS_PER_WEEK), date)

  const lines = chartLines(records, dates, today, false).map(({ key, stars, links }) => {
    const label = COMMON_COPY.tracks[key]

    return { id: key, label, spokenName: TODAY_COPY.chartLine(label, starLabel(stars, key)), stars, links }
  })

  const columns = dates.map((day) => ({
    date: day,
    head: shortWeekday(day),
    isToday: day === today,
    isShown: day === date,
  }))

  return (
    <div className="inset-group week-chart">
      <StarChart columns={columns} lines={lines} stampsNewStars />
    </div>
  )
}
