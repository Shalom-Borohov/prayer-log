import { COMMON_COPY } from './common'

export const FORMAT_COPY = {
  weekdays: ['יום ראשון', 'יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי', 'שבת'],
  weekdayLetters: ['א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳'],
  noStreak: 'אין רצף',
  oneDayStreak: 'יום אחד ברצף',
  daysStreak: (days: number) => `${days} ימים ברצף`,
  hebrewDate: (day: string, month: string) => `${day} ב${month}`,
  withLearning: 'עם לימוד',
  recentDays: (done: number, total: number, doneLabel: string) =>
    `${COMMON_COPY.outOf(done, total)} הימים האחרונים ${doneLabel}`,
} as const
