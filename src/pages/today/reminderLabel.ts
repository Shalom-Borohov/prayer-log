import { COMMON_COPY } from '../../copy/common'
import type { BackfillReminder } from '../../domain/backfill'
import type { BackupReminder } from '../../domain/backupReminder'
import { dayLabel } from '../../domain/format'
import { isSaturday } from '../../domain/logicalDay'
import { TODAY_COPY } from './copy'

export function reminderLabel({ date, kind }: BackfillReminder): string {
  if (kind === 'eveMaariv') {
    return TODAY_COPY.blankMaariv(dayLabel(date))
  }

  return TODAY_COPY.emptyDay(dayLabel(date), isSaturday(date))
}

export function backupReminderLabel(reminder: BackupReminder): string {
  return reminder.kind === 'never' ? COMMON_COPY.noBackupYet : TODAY_COPY.backupDaysAgo(reminder.days)
}
