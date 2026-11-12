import { COMMON_COPY } from '../../copy/common'
import type { TrendUnit } from '../../domain/trend'

const ALONE_OR_SHEMA = 'ביחידות או ק״ש'

export const STATS_COPY = {
  emptyBody: 'מסמנים תפילה במסך היום, והסיכומים והרצפים יופיעו כאן.',
  thisMonth: 'החודש',
  allTime: 'כל הזמנים',
  ofPrayers: (total: number) => (total === 1 ? 'מתוך תפילה אחת' : `מתוך ${total} תפילות`),
  trendHeading: {
    day: 'לפי יום',
    week: 'לפי שבוע',
    month: 'לפי חודש',
    quarter: 'לפי רבעון',
    year: 'לפי שנה',
  } satisfies Record<TrendUnit, string>,
  trendBucket: (label: string, minyan: number, other: number, total: number) =>
    `${label}: ${minyan} ${COMMON_COPY.attendance.minyan}, ${other} ${ALONE_OR_SHEMA}, מתוך ${total}`,
  learningDays: 'ימי לימוד',
  byPrayer: 'לפי תפילה',
  best: (days: number) => `שיא ${days}`,
  detail: 'פירוט',
  shemaColumn: 'ק״ש',
  notApplicable: '–',
  wornItems: 'תפילין וטלית',
} as const
