import { useLiveQuery } from 'dexie-react-hooks'
import { missingPrayers } from '../domain/reminder'
import { db } from './db'
import { allDays } from './repo'
import { readRestoreUndo } from './restoreUndo'

export function useAllDays() {
  return useLiveQuery(allDays)
}

export function useAllPrayersMarked(date: string) {
  const answer = useLiveQuery(
    async () => ({ date, allMarked: missingPrayers(await db.days.get(date), date).length === 0 }),
    [date],
  )

  return answer?.date === date ? answer.allMarked : undefined
}

export function useRestoreUndo() {
  return useLiveQuery(readRestoreUndo)
}
