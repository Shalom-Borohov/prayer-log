import { useRef } from 'react'
import { countBadRecords, exportBackup } from '../data/backup'
import { isShareCancel, shareBackup } from './backupFile'
import { saveLastBackup } from './lastBackup'

export interface ExportResult {
  failed: boolean
  badRecords: number
}

async function shareStoredData(now: number): Promise<ExportResult> {
  let badRecords = 0

  try {
    const backup = await exportBackup(now)

    badRecords = countBadRecords(backup)
    await shareBackup(backup)
    saveLastBackup(now)

    return { failed: false, badRecords }
  } catch (error) {
    return { failed: !isShareCancel(error), badRecords }
  }
}

export function useBackupExport(report: (result: ExportResult) => void) {
  const exporting = useRef(false)

  return async function exportData() {
    if (exporting.current) {
      return
    }

    exporting.current = true
    report(await shareStoredData(Date.now()))
    exporting.current = false
  }
}
