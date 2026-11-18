import { COMMON_COPY } from '../copy/common'
import { missingPrayers } from '../domain/reminder'
import type { DayRecord } from '../domain/types'
import { REMINDER_COPY } from '../reminder/copy'

export interface ReminderNotification {
  title: string
  body: string
}

export function reminderNotification(day: DayRecord | undefined, date: string): ReminderNotification {
  const names = missingPrayers(day, date).map((prayer) => COMMON_COPY.prayers[prayer])

  return {
    title: REMINDER_COPY.title,
    body: names.length === 0 ? REMINDER_COPY.allLogged : REMINDER_COPY.missing(names),
  }
}
