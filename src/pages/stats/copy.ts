import { COMMON_COPY } from '../../copy/common'
import { FORMAT_COPY } from '../../copy/format'
import type { TrendUnit } from '../../domain/trend'
import type { Streak } from '../../domain/types'

const best = (days: number) => `שיא ${days}`

const ALONE_OR_SHEMA = 'ביחידות או ק״ש'

export const STATS_COPY = {
  emptyBody: 'מסמנים תפילה במסך היום, והסיכומים והרצפים יופיעו כאן.',
  thisMonth: 'החודש',
  allTime: 'כל הזמנים',
  ofPrayers: (total: number) => (total === 1 ? 'מתוך תפילה אחת' : `מתוך ${total} תפילות`),
  trendHeading: {
    week: 'לפי שבוע',
    month: 'לפי חודש',
    quarter: 'לפי רבעון',
    year: 'לפי שנה',
  } satisfies Record<TrendUnit, string>,
  trendBucket: (label: string, minyan: number, other: number, total: number) =>
    `${label}: ${minyan} ${COMMON_COPY.attendance.minyan}, ${other} ${ALONE_OR_SHEMA}, מתוך ${total}`,
  trendKey: { minyan: COMMON_COPY.attendance.minyan, other: ALONE_OR_SHEMA, unmarked: COMMON_COPY.unmarked },
  learningDays: 'ימי לימוד',
  byPrayer: 'לפי תפילה',
  prayerNumbers: (count: string, streak: Streak | null) =>
    streak === null ? [count] : [count, FORMAT_COPY.streak(streak.current), best(streak.best)],
  detail: 'פירוט',
  shemaColumn: 'ק״ש',
  notApplicable: '–',
} as const
