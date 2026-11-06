import { useIonAlert } from '@ionic/react'
import { COMMON_COPY } from '../copy/common'
import { useToast } from '../hooks/useToast'
import { useBackupExport } from './useBackupExport'

export function useExportBackup() {
  const { toast } = useToast()
  const [presentAlert] = useIonAlert()

  return useBackupExport(({ failed, badRecords }) => {
    if (failed) {
      void toast(COMMON_COPY.actionFailed)
    }

    if (badRecords > 0) {
      void presentAlert({ message: COMMON_COPY.badRecordsInBackup(badRecords), buttons: [COMMON_COPY.ok] })
    }
  })
}
