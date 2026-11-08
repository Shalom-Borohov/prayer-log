import { type Backup, parseBackup, restoreBackup } from '../data/backup'
import { swapWithRestoreCopy } from '../data/restoreUndo'
import { toIsoDate } from '../domain/logicalDay'
import { readLastBackup, saveLastBackup } from './lastBackup'

const BACKUP_FILE_PREFIX = 'prayers-backup-'

const BACKUP_EXTENSION = '.json'

const BACKUP_MIME_TYPE = 'application/json'

export const BACKUP_FILE_ACCEPT = [BACKUP_MIME_TYPE, BACKUP_EXTENSION].join(',')

export async function shareBackup(fileText: string, exportedAt: number): Promise<void> {
  const fileName = `${BACKUP_FILE_PREFIX}${toIsoDate(new Date(exportedAt))}${BACKUP_EXTENSION}`
  const file = new File([fileText], fileName, { type: BACKUP_MIME_TYPE })

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({ files: [file] })

    return
  }

  const url = URL.createObjectURL(file)
  const link = document.createElement('a')

  link.href = url
  link.download = file.name
  link.click()
  setTimeout(() => URL.revokeObjectURL(url))
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

export const isShareCancel = (error: unknown) => error instanceof DOMException && error.name === 'AbortError'
