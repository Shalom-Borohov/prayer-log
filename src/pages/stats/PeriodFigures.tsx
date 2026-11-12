import { COMMON_COPY } from '../../copy/common'
import type { PeriodTotals } from '../../domain/types'
import { STATS_COPY } from './copy'

export function PeriodFigures({ totals }: { totals: PeriodTotals }) {
  const figures = [
    { label: COMMON_COPY.attendance.alone, count: totals.prayers.alone },
    { label: COMMON_COPY.attendance.shema, count: totals.prayers.shema },
    { label: STATS_COPY.learningDays, count: totals.torah.days },
  ]

  return (
    <dl className="stats-figures">
      {figures.map(({ label, count }) => (
        <div key={label} className="stats-figure">
          <dt>{label}</dt>
          <dd>{count}</dd>
        </div>
      ))}
    </dl>
  )
}
