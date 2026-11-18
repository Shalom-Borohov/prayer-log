import { logicalDate, ROLLOVER_HOUR } from '../../src/domain/logicalDay'
import type { StoredReminder } from './store'

const MINUTES_PER_HOUR = 60

const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR

const REMINDER_WINDOW_MINUTES = 60

type WallClock = { date: string; hour: number; minute: number }

const formatterFor = (timeZone: string) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })

function wallClock(now: number, timeZone: string): WallClock | null {
  try {
    const parts = Object.fromEntries(formatterFor(timeZone).formatToParts(now).map((part) => [part.type, part.value]))

    return {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      hour: Number(parts.hour),
      minute: Number(parts.minute),
    }
  } catch {
    return null
  }
}

const minutesIntoLogicalDay = (hour: number, minute: number) =>
  (hour < ROLLOVER_HOUR ? MINUTES_PER_DAY : 0) + hour * MINUTES_PER_HOUR + minute

export function reminderDue(stored: StoredReminder, now: number): string | null {
  const clock = wallClock(now, stored.timeZone)
  if (!clock) {
    return null
  }

  const date = logicalDate(clock.date, clock.hour)
  const [reminderHour, reminderMinute] = stored.time.split(':').map(Number)
  const minutesLate = minutesIntoLogicalDay(clock.hour, clock.minute) - minutesIntoLogicalDay(reminderHour, reminderMinute)
  const inWindow = minutesLate >= 0 && minutesLate < REMINDER_WINDOW_MINUTES
  const alreadyHandled = date === stored.completeDate || date === stored.lastSentDate || stored.skipNights.includes(date)

  return inWindow && !alreadyHandled ? date : null
}
