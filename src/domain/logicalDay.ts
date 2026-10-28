const ROLLOVER_HOUR = 3

const pad = (value: number) => String(value).padStart(2, '0')

export const isIsoDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && toIsoDate(parseIsoDate(value)) === value

export function toIsoDate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseIsoDate(date: string): Date {
  const [year, month, day] = date.split('-').map(Number)

  return new Date(year, month - 1, day, 12)
}

export function addDays(date: string, days: number): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate() + days, 12))
}

export function logicalToday(now: number): string {
  const moment = new Date(now)
  const today = toIsoDate(moment)

  return moment.getHours() < ROLLOVER_HOUR ? addDays(today, -1) : today
}

export function weekStart(date: string): string {
  return addDays(date, -parseIsoDate(date).getDay())
}

export function monthStart(date: string): string {
  return `${date.slice(0, 7)}-01`
}

export function monthEnd(date: string): string {
  const parsed = parseIsoDate(date)

  return toIsoDate(new Date(parsed.getFullYear(), parsed.getMonth() + 1, 0, 12))
}

export function daysInRange(from: string, to: string): string[] {
  const days: string[] = []
  for (let day = from; day <= to; day = addDays(day, 1)) {
    days.push(day)
  }

  return days
}
