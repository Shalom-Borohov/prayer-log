import { useIonAlert } from '@ionic/react'
import { arrowRedoOutline, arrowUndoOutline } from 'ionicons/icons'
import { useEffect, useState } from 'react'
import { swapLastRestore } from '../../backup/backupFile'
import { COMMON_COPY } from '../../copy/common'
import { useRestoreUndo } from '../../data/hooks'
import { swapPreview } from '../../data/restoreUndo'
import { dateTimeLabel } from '../../domain/format'
import { restoreUndoExpiresAt, swapComparison } from '../../domain/restorePreview'
import { useSave } from '../../hooks/useSave'
import { useToast } from '../../hooks/useToast'
import { SETTINGS_COPY } from './copy'
import { RESTORE_ALERT_CLASS } from './restoreAlert'

const SWAP_ICONS = { undo: arrowUndoOutline, redo: arrowRedoOutline } as const

export function useUndoImport() {
  const copy = useRestoreUndo()
  const [now, setNow] = useState(Date.now)
  const [presentAlert] = useIonAlert()
  const { toast } = useToast()
  const save = useSave()

  useEffect(() => {
    const refreshNow = () => setNow(Date.now())

    document.addEventListener('visibilitychange', refreshNow)

    return () => document.removeEventListener('visibilitychange', refreshNow)
  }, [])

  const expiresAt = copy ? restoreUndoExpiresAt(copy.savedAt) : null

  useEffect(() => {
    if (expiresAt === null) {
      return
    }

    const timer = setTimeout(() => setNow((current) => Math.max(current, expiresAt)), expiresAt - Date.now())

    return () => clearTimeout(timer)
  }, [expiresAt])

  if (!copy || expiresAt === null || now >= expiresAt) {
    return null
  }

  const text = SETTINGS_COPY[copy.offers]

  const swap = async () => {
    if (await save(swapLastRestore())) {
      void toast(text.done)
    }
  }

  const confirmSwap = async () => {
    const comparison = swapComparison(await swapPreview(copy))

    await presentAlert({
      header: text.label,
      message: [text.message, ...comparison].join('\n'),
      cssClass: RESTORE_ALERT_CLASS,
      buttons: [
        { text: COMMON_COPY.cancel, role: 'cancel' },
        { text: SETTINGS_COPY.confirmSwap, handler: () => void swap() },
      ],
    })
  }

  return {
    label: text.label,
    footnote: text.until(dateTimeLabel(expiresAt)),
    icon: SWAP_ICONS[copy.offers],
    confirm: () => void confirmSwap().catch(() => toast(COMMON_COPY.actionFailed)),
  }
}
