import { useRef } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { allDays } from '../../data/repo'
import { toIsoDate } from '../../domain/logicalDay'
import { logText } from '../../domain/logText'
import { useToast } from '../../hooks/useToast'
import { isShareCancel, shareFile } from '../../share/shareFile'

const HISTORY_FILE_PREFIX = 'prayers-'

const HISTORY_EXTENSION = '.txt'

const HISTORY_MIME_TYPE = 'text/plain'

const historyFileName = (sharedAt: number) => `${HISTORY_FILE_PREFIX}${toIsoDate(new Date(sharedAt))}${HISTORY_EXTENSION}`

export function useShareHistory() {
  const { toast } = useToast()
  const sharing = useRef(false)

  return async function shareHistory() {
    if (sharing.current) {
      return
    }

    sharing.current = true

    try {
      await shareFile(historyFileName(Date.now()), HISTORY_MIME_TYPE, logText(await allDays()))
    } catch (error) {
      if (!isShareCancel(error)) {
        void toast(COMMON_COPY.actionFailed)
      }
    } finally {
      sharing.current = false
    }
  }
}
