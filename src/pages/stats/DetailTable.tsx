import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { isShemaPrayer } from '../../domain/prayersForDay'
import type { PeriodTotals } from '../../domain/types'
import { STATS_COPY } from './copy'
import { shownPrayers } from './shownPrayers'

export function DetailTable({ totals }: { totals: PeriodTotals }) {
  const headingId = useId()

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.detail}
      </h3>
      <table className="ruled-table detail-table" aria-labelledby={headingId}>
        <thead>
          <tr>
            <td />
            <th scope="col">{COMMON_COPY.attendance.alone}</th>
            <th scope="col">{STATS_COPY.shemaColumn}</th>
          </tr>
        </thead>
        <tbody>
          {shownPrayers(totals).map((prayer) => (
            <tr key={prayer}>
              <th scope="row">{COMMON_COPY.prayers[prayer]}</th>
              <td>{totals.perPrayer[prayer].alone}</td>
              <td>{isShemaPrayer(prayer) ? totals.perPrayer[prayer].shema : STATS_COPY.notApplicable}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
