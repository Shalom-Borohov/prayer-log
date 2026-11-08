import { type Backup, parseBackup, restoreBackup } from '../data/backup'
import { swapWithRestoreCopy } from '../data/restoreUndo'
import { toIsoDate } from '../domain/logicalDay'
import { shareFile } from '../share/shareFile'
import { readLastBackup, saveLastBackup } from './lastBackup'

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

function recordBackupTimeIfStorageAllows(backupAt: number | null) {
  try {
    saveLastBackup(backupAt)
  } catch {
    return
  }
}

function readBackupTimeIfStorageAllows(): number | null {
  try {
    return readLastBackup()
  } catch {
    return null
  }
}

export async function restoreFromBackup(backup: Backup): Promise<void> {
  await restoreBackup(backup, readBackupTimeIfStorageAllows())
  recordBackupTimeIfStorageAllows(backup.exportedAt)
}

export async function swapLastRestore(): Promise<void> {
  recordBackupTimeIfStorageAllows(await swapWithRestoreCopy(readBackupTimeIfStorageAllows()))
}
