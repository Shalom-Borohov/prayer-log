const ROLLOVER_HOUR = 3

const NOON = 12

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export const DAYS_PER_WEEK = 7

const SATURDAY = 6

export const MONTHS_PER_QUARTER = 3

export const pad = (value: number) => String(value).padStart(2, '0')

export const isIsoDate = (date: string) => ISO_DATE_PATTERN.test(date) && toIsoDate(parseIsoDate(date)) === date

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseIsoDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day, NOON)
}

export function addDays(date: string, days: number): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + days, NOON))
}

export function logicalToday(now: number): string {
  const moment = new Date(now)
  const today = toIsoDate(moment)

  return moment.getHours() < ROLLOVER_HOUR ? addDays(today, -1) : today
}

export const isSaturday = (date: string) => parseIsoDate(date).getDay() === SATURDAY

export function weekStart(date: string): string {
  return addDays(date, -parseIsoDate(date).getDay())
}

export function monthStart(date: string): string {
  return `${date.slice(0, 7)}-01`
}

export function monthEnd(date: string): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0, NOON))
}

const firstMonthOfQuarter = (parsed: Date) => parsed.getMonth() - (parsed.getMonth() % MONTHS_PER_QUARTER)

export function quarterStart(date: string): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), firstMonthOfQuarter(parsed), 1, NOON))
}

export function quarterEnd(date: string): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), firstMonthOfQuarter(parsed) + MONTHS_PER_QUARTER, 0, NOON))
}

export function yearStart(date: string): string {
  return `${date.slice(0, 4)}-01-01`
}

export function daysInRange(from: string, to: string): string[] {
  const days: string[] = []
  for (let day = from; day <= to; day = addDays(day, 1)) {
    days.push(day)
  }

  return days
}
