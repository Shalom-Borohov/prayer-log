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
  cancel: 'ביטול',
  close: 'סגירה',
  ok: 'אישור',
  exportBackup: 'ייצוא גיבוי',
  importBackup: 'ייבוא גיבוי',
  importWarning: 'הייבוא יחליף את כל הנתונים',
  confirmImport: 'ייבוא',
  backupFile: 'קובץ גיבוי',
  actionFailed: 'הפעולה נכשלה',
  saveFailed: 'לא נשמר. אפשר לנסות שוב.',
  badRecordsInBackup: (count: number) =>
    count === 1 ? 'בגיבוי יש רשומה פגומה אחת, וייבוא הקובץ ייכשל' : `בגיבוי יש ${count} רשומות פגומות, וייבוא הקובץ ייכשל`,
  noBackupYet: 'עדיין לא נעשה גיבוי',
  previous: 'הקודם',
  next: 'הבא',
  unmarked: 'לא סומן',
  noData: 'עוד אין נתונים',
  dateRange: (from: string, to: string) => `${from}–${to}`,
  thisWeek: 'השבוע',
  torah: TORAH,
  learnedTorah: 'למדתי תורה',
  prayers: PRAYER_NAMES,
  tracks: { ...PRAYER_NAMES, torah: TORAH },
  attendance: { minyan: 'במניין', alone: 'ביחידות', shema: 'ק״ש בלבד' } satisfies Record<Attendance, string>,
  worn: { tefillin: 'תפילין', tallit: 'טלית' } satisfies Record<WornItem, string>,
  prayerMark: (prayer: string, attendance: string) => `${prayer} ${attendance}`,
  atPlace: (mark: string, place: string) => `${mark} (${place})`,
  outOf: (done: number, total: number) => `${done} מתוך ${total}`,
  daysOutOf: ({ days, total }: DayTally) => `${days} מתוך ${total}`,
} as const
