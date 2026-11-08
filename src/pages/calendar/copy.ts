export const CALENDAR_COPY = {
  previousMonth: 'החודש הקודם',
  nextMonth: 'החודש הבא',
  prayerMark: (prayer: string, attendance: string) => `${prayer} ${attendance}`,
  weekdayWithParsha: (weekday: string, parsha: string) => `${weekday} פרשת ${parsha}`,
  dayCell: (dayNumber: number, hebrewDate: string, weekday: string, marks: string) =>
    `${dayNumber} ${hebrewDate}, ${weekday}: ${marks}`,
} as const
