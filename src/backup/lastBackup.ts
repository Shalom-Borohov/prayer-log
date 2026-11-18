import { useSyncExternalStore } from 'react'
import { createStoreSignal } from '../hooks/storeSignal'

const LAST_BACKUP_KEY = 'last-backup-at'

const lastBackupSignal = createStoreSignal()

export function readLastBackup(): number | null {
  const stored = localStorage.getItem(LAST_BACKUP_KEY)

  return stored === null ? null : Number(stored)
}

export function saveLastBackup(timestamp: number | null) {
  if (timestamp === null) {
    localStorage.removeItem(LAST_BACKUP_KEY)
  } else {
    localStorage.setItem(LAST_BACKUP_KEY, String(Math.min(timestamp, Date.now())))
  }

  lastBackupSignal.notify()
}

export const useLastBackup = () => useSyncExternalStore(lastBackupSignal.subscribe, readLastBackup)
