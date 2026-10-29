import { COMMON_COPY } from '../../copy/common'

export const TODAY_COPY = {
  emptyDay: (day: string, isShabbat: boolean) => (isShabbat ? `${day} לא מולאה` : `${day} לא מולא`),
  blankMaariv: (day: string) => `${COMMON_COPY.prayers.maariv} של ${day} לא סומנה`,
  previousDay: 'היום הקודם',
  nextDay: 'היום הבא',
  torahNote: 'מה למדתי',
  torahNotePlaceholder: 'מה למדתי…',
  weekRange: (from: string, to: string) => `${from}–${to}`,
} as const
