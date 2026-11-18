import { useLiveQuery } from 'dexie-react-hooks'
import { missingPrayers } from '../domain/reminder'
import { db } from './db'
import { allDays } from './repo'
import { readRestoreUndo } from './restoreUndo'

export function useAllDays() {
  return useLiveQuery(allDays)
}

export function useAllPrayersMarked(date: string) {
  return useLiveQuery(async () => missingPrayers(await db.days.get(date), date).length === 0, [date])
}

export function useRestoreUndo() {
  return useLiveQuery(readRestoreUndo)
}
