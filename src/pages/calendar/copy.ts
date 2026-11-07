export const CALENDAR_COPY = {
  previousMonth: 'החודש הקודם',
  nextMonth: 'החודש הבא',
  prayerMark: (prayer: string, attendance: string) => `${prayer} ${attendance}`,
  dayCell: (dayNumber: number, hebrewDate: string, weekday: string, marks: string) =>
    `${dayNumber} ${hebrewDate}, ${weekday}: ${marks}`,
} as const
