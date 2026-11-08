import { useLiveQuery } from 'dexie-react-hooks'
import { allDays } from './repo'
import { readRestoreUndo } from './restoreUndo'

export function useAllDays() {
  return useLiveQuery(allDays)
}

export function useRestoreUndo() {
  return useLiveQuery(readRestoreUndo)
}
