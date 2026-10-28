import { useId } from 'react'
import { gregorianLabel } from '../../domain/format'
import { periodTotals, weekRange } from '../../domain/totals'
import type { DayRecord } from '../../domain/types'

export function WeekSummary({ records, date, today }: { records: DayRecord[]; date: string; today: string }) {
  const { from, to } = weekRange(date)
  const title = from === weekRange(today).from ? 'השבוע' : `${gregorianLabel(from)}–${gregorianLabel(to)}`
  const { prayers, torah } = periodTotals(records, from, to, today)
  const id = useId()

  return (
    <>
      <h3 className="group-label" id={id}>
        {title}
      </h3>
      <table className="ruled-table" aria-labelledby={id}>
        <tbody>
          <tr>
            <th scope="row">במניין</th>
            <td>{`${prayers.minyan} מתוך ${prayers.total}`}</td>
          </tr>
          <tr>
            <th scope="row">ביחידות</th>
            <td>{prayers.alone}</td>
          </tr>
          <tr>
            <th scope="row">למדתי תורה</th>
            <td>{`${torah.days} מתוך ${torah.total}`}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}
