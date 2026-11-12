export const CALENDAR_COPY = {
  previousMonth: 'החודש הקודם',
  nextMonth: 'החודש הבא',
  weekParsha: (parsha: string) => `פרשת ${parsha}`,
  weekdayWithParsha: (weekday: string, parsha: string) => `${weekday} פרשת ${parsha}`,
  hebrewMonth: (name: string, year: string) => `${name} ${year}`,
  dayCell: (dayNumber: number, hebrewDate: string, weekday: string, marks: string) =>
    `${dayNumber} ${hebrewDate}, ${weekday}: ${marks}`,
} as const
