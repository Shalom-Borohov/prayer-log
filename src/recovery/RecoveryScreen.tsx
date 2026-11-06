import { useState } from 'react'
import { type ExportResult, useBackupExport } from '../backup/useBackupExport'
import { COMMON_COPY } from '../copy/common'
import { RECOVERY_COPY } from './copy'
import './recovery.css'

export function RecoveryScreen() {
  const [result, setResult] = useState<ExportResult | null>(null)
  const exportData = useBackupExport(setResult)

  return (
    <main className="recovery">
      <h1>{RECOVERY_COPY.title}</h1>
      <p>{RECOVERY_COPY.explanation}</p>
      <button type="button" className="recovery-primary" onClick={exportData}>
        {RECOVERY_COPY.exportBackup}
      </button>
      <div role="status">
        {result?.failed && <p>{COMMON_COPY.actionFailed}</p>}
        {result && result.badRecords > 0 && <p>{COMMON_COPY.badRecordsInBackup(result.badRecords)}</p>}
      </div>
      <button type="button" onClick={() => window.location.reload()}>
        {RECOVERY_COPY.reload}
      </button>
    </main>
  )
}
