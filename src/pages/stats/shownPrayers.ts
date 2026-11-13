import { hasStreak } from '../../domain/streaks'
import { type PeriodTotals, PRAYERS } from '../../domain/types'

export const shownPrayers = (totals: PeriodTotals) =>
  PRAYERS.filter((prayer) => hasStreak(prayer) || totals.perPrayer[prayer].total > 0)
