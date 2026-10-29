import type { Attendance, DayTally, Prayer, WornItem } from '../domain/types'

const PRAYER_NAMES = {
  shacharit: 'שחרית',
  musaf: 'מוסף',
  mincha: 'מנחה',
  maariv: 'ערבית',
} as const satisfies Record<Prayer, string>

const TORAH = 'תורה'

export const COMMON_COPY = {
  today: 'היום',
  calendar: 'לוח',
  stats: 'סטטיסטיקה',
  settings: 'הגדרות',
  thisWeek: 'השבוע',
  torah: TORAH,
  learnedTorah: 'למדתי תורה',
  prayers: PRAYER_NAMES,
  tracks: { ...PRAYER_NAMES, torah: TORAH },
  attendance: { minyan: 'במניין', alone: 'ביחידות', shema: 'ק״ש בלבד' } satisfies Record<Attendance, string>,
  worn: { tefillin: 'תפילין', tallit: 'טלית' } satisfies Record<WornItem, string>,
  outOf: (done: number, total: number) => `${done} מתוך ${total}`,
  daysOutOf: ({ days, total }: DayTally) => `${days} מתוך ${total}`,
} as const
