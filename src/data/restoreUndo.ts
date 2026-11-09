import { keptOnSwap, summarizeDates } from '../domain/restorePreview'
import type { DayRecord } from '../domain/types'
import { db } from './db'
import { normalizeDay } from './repo'

const RESTORE_UNDO_ID = 'last'

export type RestoreUndo = {
  id: typeof RESTORE_UNDO_ID
  offers: 'undo' | 'redo'
  savedAt: number
  backupAt: number | null
  keepAfter: string | null
  days: DayRecord[]
}

const datesOf = (days: DayRecord[]) => days.map((day) => day.date)

export const readRestoreUndo = () => db.restoreUndo.get(RESTORE_UNDO_ID)

type Replacement = { brought: DayRecord[]; kept: DayRecord[] }

export async function replaceDaysKeepingCopy(
  replacement: (current: DayRecord[]) => Replacement,
  offers: RestoreUndo['offers'],
  backupAt: number | null,
) {
  const current = await db.days.toArray()
  const { brought, kept } = replacement(current)

  if (current.length === 0) {
    await db.restoreUndo.delete(RESTORE_UNDO_ID)
  } else {
    await db.restoreUndo.put({
      id: RESTORE_UNDO_ID,
      offers,
      savedAt: Date.now(),
      backupAt,
      keepAfter: summarizeDates(datesOf(brought)).newest,
      days: current,
    })
  }

  await db.days.clear()
  await db.days.bulkPut([...brought, ...kept])
}

export async function swapPreview(copy: RestoreUndo) {
  const current = await db.days.toArray()

  return {
    copy: summarizeDates(datesOf(copy.days)),
    current: summarizeDates(datesOf(current)),
    kept: keptOnSwap(current, copy).length,
  }
}

export async function swapWithRestoreCopy(currentBackupAt: number | null): Promise<number | null> {
  return db.transaction('rw', db.days, db.restoreUndo, async () => {
    const copy = await readRestoreUndo()

    if (!copy) {
      throw new Error('no restore copy')
    }

    await replaceDaysKeepingCopy(
      (current) => ({ brought: copy.days, kept: keptOnSwap(current, copy).map(normalizeDay) }),
      copy.offers === 'undo' ? 'redo' : 'undo',
      currentBackupAt,
    )

    return copy.backupAt
  })
}
