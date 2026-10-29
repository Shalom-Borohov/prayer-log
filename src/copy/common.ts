import type { Attendance, Prayer } from '../domain/types'

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
  attendance: { minyan: 'במניין', alone: 'ביחידות' } satisfies Record<Attendance, string>,
  outOf: (done: number, total: number) => `${done} מתוך ${total}`,
} as const
