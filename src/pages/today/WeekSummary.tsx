import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { gregorianLabel } from '../../domain/format'
import { periodTotals, weekRange } from '../../domain/totals'
import type { DayRecord } from '../../domain/types'
import { TODAY_COPY } from './copy'

export function WeekSummary({ records, date, today }: { records: DayRecord[]; date: string; today: string }) {
  const week = weekRange(date)

  const title =
    week.from === weekRange(today).from
      ? COMMON_COPY.thisWeek
      : TODAY_COPY.weekRange(gregorianLabel(week.from), gregorianLabel(week.to))

  const { prayers, torah } = periodTotals(records, week.from, week.to, today)
  const titleId = useId()

  return (
    <>
      <h3 className="group-label" id={titleId}>
        {title}
      </h3>
      <table className="ruled-table" aria-labelledby={titleId}>
        <tbody>
          <tr>
            <th scope="row">{COMMON_COPY.attendance.minyan}</th>
            <td>{COMMON_COPY.outOf(prayers.minyan, prayers.total)}</td>
          </tr>
          <tr>
            <th scope="row">{COMMON_COPY.attendance.alone}</th>
            <td>{prayers.alone}</td>
          </tr>
          <tr>
            <th scope="row">{COMMON_COPY.learnedTorah}</th>
            <td>{COMMON_COPY.outOf(torah.days, torah.total)}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
