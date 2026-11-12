import { holidayNames } from './hebrewCalendar'
import { DAYS_PER_WEEK, addDays, daysInRange, monthEnd, weekStart } from './logicalDay'
import { weekRange } from './totals'

export interface HolidayRun {
  from: string
  to: string
  name: string
}

export function weekHolidays(dates: string[]): HolidayRun[] {
  const runs: HolidayRun[] = []
  for (const date of dates) {
    for (const name of holidayNames(date)) {
      const run = runs.find((candidate) => candidate.name === name && addDays(candidate.to, 1) === date)

      if (run) {
        run.to = date
      } else {
        runs.push({ from: date, to: date, name })
      }
    }
  }

  return runs
}

export function monthWeeks(month: string, today: string): string[][] {
  const weeks: string[][] = []
  for (let sunday = weekStart(monthEnd(month)); sunday >= weekStart(month); sunday = addDays(sunday, -DAYS_PER_WEEK)) {
    if (sunday <= today) {
      const { from, to } = weekRange(sunday)
      weeks.push(daysInRange(from, to))
    }
  }

  return weeks
}
