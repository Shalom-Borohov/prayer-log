import { type Backup, parseBackup, restoreBackup } from '../data/backup'
import { toIsoDate } from '../domain/logicalDay'
import { shareFile } from '../share/shareFile'
import { saveLastBackup } from './lastBackup'

const BACKUP_FILE_PREFIX = 'prayers-backup-'

const BACKUP_EXTENSION = '.json'

const BACKUP_MIME_TYPE = 'application/json'

export const BACKUP_FILE_ACCEPT = [BACKUP_MIME_TYPE, BACKUP_EXTENSION].join(',')

export async function shareBackup(fileText: string, exportedAt: number): Promise<void> {
  const fileName = `${BACKUP_FILE_PREFIX}${toIsoDate(new Date(exportedAt))}${BACKUP_EXTENSION}`

  await shareFile(fileName, BACKUP_MIME_TYPE, fileText)
}

export async function readBackup(file: File): Promise<Backup> {
  return parseBackup(await file.text())
}

function recordBackupTimeIfStorageAllows(exportedAt: number) {
  try {
    saveLastBackup(exportedAt)
  } catch {
    return
  }
}

export async function restoreFromBackup(backup: Backup): Promise<void> {
  await restoreBackup(backup)
  recordBackupTimeIfStorageAllows(backup.exportedAt)
}
