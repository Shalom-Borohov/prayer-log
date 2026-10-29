export const CALENDAR_COPY = {
  previousMonth: 'החודש הקודם',
  nextMonth: 'החודש הבא',
  unmarked: 'לא סומן',
  prayerMark: (prayer: string, attendance: string) => `${prayer} ${attendance}`,
  dayCell: (day: string, hebrewDate: string, marks: string) => `${day}, ${hebrewDate}: ${marks}`,
} as const
