import { type ChangeEvent, useRef } from 'react'
import { COMMON_COPY } from '../copy/common'
import { type Backup, importPreview, InvalidBackupError } from '../data/backup'
import { importComparison } from '../domain/restorePreview'
import { BACKUP_FILE_ACCEPT, readBackup } from './backupFile'

interface BackupFileReport {
  onBackup: (backup: Backup, comparison: string[]) => void
  onFailure: (message: string) => void
}

const failureMessage = (error: unknown) =>
  error instanceof InvalidBackupError ? error.message : COMMON_COPY.actionFailed

export function useBackupFile({ onBackup, onFailure }: BackupFileReport) {
  const fileInput = useRef<HTMLInputElement>(null)

  async function onChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const file = input.files?.[0]

    input.value = ''

    if (!file) {
      return
    }

    try {
      const backup = await readBackup(file)

      onBackup(backup, importComparison(await importPreview(backup)))
    } catch (error) {
      onFailure(failureMessage(error))
    }
  }

  return {
    pickFile: () => fileInput.current?.click(),
    fileInputProps: {
      ref: fileInput,
      type: 'file',
      accept: BACKUP_FILE_ACCEPT,
      hidden: true,
      'aria-label': COMMON_COPY.backupFile,
      onChange,
    },
  }
}
