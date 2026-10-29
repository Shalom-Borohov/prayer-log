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

  const { prayers, tefillin, tallit, torah } = periodTotals(records, week.from, week.to, today)

  const summaryRows = [
    { label: COMMON_COPY.attendance.minyan, figure: COMMON_COPY.outOf(prayers.minyan, prayers.total) },
    { label: COMMON_COPY.attendance.alone, figure: prayers.alone },
    { label: COMMON_COPY.attendance.shema, figure: prayers.shema },
    { label: COMMON_COPY.worn.tefillin, figure: COMMON_COPY.daysOutOf(tefillin) },
    { label: COMMON_COPY.worn.tallit, figure: COMMON_COPY.daysOutOf(tallit) },
    { label: COMMON_COPY.learnedTorah, figure: COMMON_COPY.daysOutOf(torah) },
  ]

  const titleId = useId()

  return (
    <>
      <h3 className="group-label" id={titleId}>
        {title}
      </h3>
      <table className="ruled-table" aria-labelledby={titleId}>
        <tbody>
          {summaryRows.map(({ label, figure }) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{figure}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
