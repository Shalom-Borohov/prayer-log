import { type Backup, parseBackup } from '../../data/backup'
import { toIsoDate } from '../../domain/logicalDay'

export async function shareBackup(backup: Backup): Promise<void> {
  const name = `prayers-backup-${toIsoDate(new Date(backup.exportedAt))}.json`
  const file = new File([JSON.stringify(backup)], name, { type: 'application/json' })

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
