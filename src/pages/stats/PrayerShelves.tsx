import { Shelf } from '../../components/Shelf'
import { Spine } from '../../components/Spine'
import { COMMON_COPY } from '../../copy/common'
import { LIST_SEPARATOR } from '../../domain/format'
import { type ShelfKey, shelfLabel } from '../../domain/shelf'
import { hasStreak } from '../../domain/streaks'
import type { StatsPeriod } from '../../domain/totals'
import type { PeriodTotals, Streak, StreakKey } from '../../domain/types'
import { STATS_COPY } from './copy'
import type { PeriodShelves } from './periodShelves'
import { shownPrayers } from './shownPrayers'
import './prayerShelves.css'

const MONTH_BOARD_SIZE = 16

interface PrayerShelvesProps {
  period: StatsPeriod
  totals: PeriodTotals
  streaks: Record<StreakKey, Streak>
  shelves: PeriodShelves | null
}

interface ShelfCount {
  key: ShelfKey
  count: string
}

function PeriodShelf({ shelves, shelfKey }: { shelves: PeriodShelves; shelfKey: ShelfKey }) {
  const row = shelves.rows.find(({ key }) => key === shelfKey)

  if (!row) {
    return null
  }

  return (
    <Shelf
      slots={row.slots}
      label={shelfLabel(row.slots, shelfKey)}
      todayIndex={shelves.todayIndex}
      boardSize={MONTH_BOARD_SIZE}
    />
  )
}

export function PrayerShelves({ period, totals, streaks, shelves }: PrayerShelvesProps) {
  const counts: ShelfCount[] = [
    ...shownPrayers(totals).map((prayer) => ({
      key: prayer,
      count: COMMON_COPY.outOf(totals.perPrayer[prayer].minyan, totals.perPrayer[prayer].total),
    })),
    { key: 'torah', count: COMMON_COPY.daysOutOf(totals.torah) },
  ]

  return (
    <ul className={`prayer-shelves period-${period}`} aria-label={STATS_COPY.byPrayer}>
      {counts.map(({ key, count }) => (
        <li key={key} className={`prayer-shelf hue-${key}`}>
          <div className="prayer-shelf-text">
            {shelves === null && <Spine state="alone" />}
            <h3 className="prayer-shelf-name">{COMMON_COPY.tracks[key]}</h3>
            <p className="prayer-shelf-numbers">
              {STATS_COPY.prayerNumbers(count, hasStreak(key) ? streaks[key] : null).join(LIST_SEPARATOR)}
            </p>
          </div>
          {shelves && <PeriodShelf shelves={shelves} shelfKey={key} />}
        </li>
      ))}
    </ul>
  )
}
