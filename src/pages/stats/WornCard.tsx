import { useId } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { type PeriodTotals, WORN_ITEMS } from '../../domain/types'
import { STATS_COPY } from './copy'

export function WornCard({ totals }: { totals: PeriodTotals }) {
  const headingId = useId()

  return (
    <>
      <h3 className="group-label" id={headingId}>
        {STATS_COPY.wornItems}
      </h3>
      <table className="ruled-table" aria-labelledby={headingId}>
        <tbody>
          {WORN_ITEMS.map((item) => (
            <tr key={item}>
              <th scope="row">{COMMON_COPY.worn[item]}</th>
              <td>{COMMON_COPY.daysOutOf(totals[item])}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
