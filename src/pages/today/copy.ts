import { COMMON_COPY } from '../../copy/common'

export const TODAY_COPY = {
  emptyDay: (day: string, isShabbat: boolean) => (isShabbat ? `${day} לא מולאה` : `${day} לא מולא`),
  blankMaariv: (day: string) => `${COMMON_COPY.prayers.maariv} של ${day} לא סומנה`,
  backupDaysAgo: (days: number) => `הגיבוי האחרון לפני ${days} ימים`,
  chartLine: (name: string, summary: string) => `${name}: ${summary}`,
  previousDay: 'היום הקודם',
  nextDay: 'היום הבא',
  torahNote: 'הערה',
  torahNotePlaceholder: 'הערה…',
  addLearning: 'הוספת לימוד',
  learningSheet: 'לימוד',
  deleteLearning: 'מחיקת הלימוד',
  learningHint: (label: string) => `בפעם הקודמת: ${label}`,
  placeLabel: (prayer: string, place: string) => `בית כנסת ב${prayer}: ${place}`,
  placeSheet: (prayer: string) => `בית כנסת · ${prayer}`,
  newPlace: 'מקום חדש…',
  newPlaceHeader: 'בית כנסת חדש',
  placeName: 'שם בית הכנסת',
  noPlace: 'ללא מקום',
  save: 'שמירה',
} as const
