import { useLiveQuery } from 'dexie-react-hooks'
import { allDays } from './repo'

export function useAllDays() {
  return useLiveQuery(allDays)
}
