import { type Backup, parseBackup } from '../../data/backup'
import { toIsoDate } from '../../domain/logicalDay'

const BACKUP_FILE_PREFIX = 'prayers-backup-'

const BACKUP_EXTENSION = '.json'

const BACKUP_MIME_TYPE = 'application/json'

export const BACKUP_FILE_ACCEPT = [BACKUP_MIME_TYPE, BACKUP_EXTENSION].join(',')

export async function shareBackup(backup: Backup): Promise<void> {
  const fileName = `${BACKUP_FILE_PREFIX}${toIsoDate(new Date(backup.exportedAt))}${BACKUP_EXTENSION}`
  const file = new File([JSON.stringify(backup)], fileName, { type: BACKUP_MIME_TYPE })

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

export const isShareCancel = (error: unknown) => error instanceof DOMException && error.name === 'AbortError'
