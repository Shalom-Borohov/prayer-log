import { COMMON_COPY } from '../../copy/common'
import type { TrendUnit } from '../../domain/trend'

const ALONE_OR_SHEMA = 'ביחידות או ק״ש'

export const STATS_COPY = {
  emptyBody: 'מסמנים תפילה במסך היום, והסיכומים והרצפים יופיעו כאן.',
  thisMonth: 'החודש',
  allTime: 'כל הזמנים',
  trendHeading: {
    day: 'לפי יום',
    week: 'לפי שבוע',
    month: 'לפי חודש',
    quarter: 'לפי רבעון',
    year: 'לפי שנה',
  } satisfies Record<TrendUnit, string>,
  trendOther: ALONE_OR_SHEMA,
  trendBucket: (label: string, minyan: number, other: number, total: number) =>
    `${label}: ${minyan} ${COMMON_COPY.attendance.minyan}, ${other} ${ALONE_OR_SHEMA}, מתוך ${total}`,
  byPrayer: 'לפי תפילה',
  shemaColumn: 'ק״ש',
  notApplicable: '–',
  totalColumn: 'מתוך',
  learningDays: 'ימים עם לימוד',
  wornItems: 'תפילין וטלית',
  streaks: 'רצפים',
  currentStreak: 'נוכחי',
  bestStreak: 'שיא',
  shelf: 'מדף',
} as const
