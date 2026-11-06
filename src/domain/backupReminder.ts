import { daysInRange, logicalToday } from './logicalDay'
import { trackingStart } from './totals'
import type { DayRecord } from './types'

const BACKUP_INTERVAL_DAYS = 7

export type BackupReminder = { kind: 'never' } | { kind: 'stale'; days: number }

const daysSince = (from: string, today: string) => daysInRange(from, today).length - 1

export function backupReminder(records: DayRecord[], lastBackupAt: number | null, today: string): BackupReminder | null {
  const start = trackingStart(records)

  if (start === null) {
    return null
  }

  const days = daysSince(lastBackupAt === null ? start : logicalToday(lastBackupAt), today)

  if (days < BACKUP_INTERVAL_DAYS) {
    return null
  }

  return lastBackupAt === null ? { kind: 'never' } : { kind: 'stale', days }
}
