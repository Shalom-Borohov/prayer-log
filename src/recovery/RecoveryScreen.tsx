import { useState } from 'react'
import { type ExportResult, useBackupShare } from '../backup/useBackupShare'
import { COMMON_COPY } from '../copy/common'
import { RECOVERY_COPY } from './copy'
import './recovery.css'

function reloadAtStart() {
  window.location.hash = ''
  window.location.reload()
}

export function RecoveryScreen() {
  const [result, setResult] = useState<ExportResult>({ failed: false, badRecords: 0 })
  const exportData = useBackupShare(setResult)

  return (
    <main className="recovery">
      <h1>{RECOVERY_COPY.title}</h1>
      <p>{RECOVERY_COPY.explanation}</p>
      <button type="button" className="recovery-primary" onClick={exportData}>
        {COMMON_COPY.exportBackup}
      </button>
      <div role="status">
        {result.failed && <p>{COMMON_COPY.actionFailed}</p>}
        {result.badRecords > 0 && <p>{COMMON_COPY.badRecordsInBackup(result.badRecords)}</p>}
      </div>
      <button type="button" onClick={reloadAtStart}>
        {RECOVERY_COPY.reload}
      </button>
    </main>
  )
}
