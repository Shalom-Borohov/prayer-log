import { useRef } from 'react'
import { COMMON_COPY } from '../copy/common'
import { exportBackup } from '../data/backup'
import { useToast } from '../hooks/useToast'
import { isShareCancel, shareBackup } from './backupFile'
import { saveLastBackup } from './lastBackup'

export function useExportBackup() {
  const { toast } = useToast()
  const exporting = useRef(false)

  return async function exportData() {
    if (exporting.current) {
      return
    }

    const now = Date.now()

    exporting.current = true

    try {
      await shareBackup(await exportBackup(now))
      saveLastBackup(now)
    } catch (error) {
      if (!isShareCancel(error)) {
        void toast(COMMON_COPY.actionFailed)
      }
    } finally {
      exporting.current = false
    }
  }
}
