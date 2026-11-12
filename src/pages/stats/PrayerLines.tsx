import { COMMON_COPY } from '../../copy/common'
import { FORMAT_COPY } from '../../copy/format'
import { hasStreak, type StarKey } from '../../domain/stars'
import type { PeriodTotals, Streak, StreakKey } from '../../domain/types'
import { STATS_COPY } from './copy'
import { shownPrayers } from './shownPrayers'

interface PrayerLinesProps {
  totals: PeriodTotals
  streaks: Record<StreakKey, Streak>
}

interface Line {
  track: StarKey
  count: string
  streak: Streak | null
}

export function PrayerLines({ totals, streaks }: PrayerLinesProps) {
  const lines: Line[] = [
    ...shownPrayers(totals).map((prayer) => ({
      track: prayer,
      count: COMMON_COPY.outOf(totals.perPrayer[prayer].minyan, totals.perPrayer[prayer].total),
      streak: hasStreak(prayer) ? streaks[prayer] : null,
    })),
    { track: 'torah', count: COMMON_COPY.daysOutOf(totals.torah), streak: streaks.torah },
  ]

  return (
    <table className="ruled-table prayer-lines" aria-label={STATS_COPY.byPrayer}>
      <tbody>
        {lines.map(({ track, count, streak }) => (
          <tr key={track}>
            <th scope="row">{COMMON_COPY.tracks[track]}</th>
            <td className="prayer-line-count">{count}</td>
            <td className="prayer-line-streak">{streak && FORMAT_COPY.streak(streak.current)}</td>
            <td className="prayer-line-best">{streak && STATS_COPY.best(streak.best)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
