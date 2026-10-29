import { array, boolean, check, literal, number, object, optional, picklist, pipe, record, safeParse, string } from 'valibot'
import { APP_COPY } from '../copy/app'
import { isIsoDate } from '../domain/logicalDay'
import { ATTENDANCES, type DayRecord, isEmptyDay, PRAYERS } from '../domain/types'
import { db } from './db'

export type Backup = { version: 1; exportedAt: number; days: DayRecord[] }

const dayRecordSchema = object({
  date: pipe(string(), check(isIsoDate)),
  prayers: record(picklist(PRAYERS), picklist(ATTENDANCES)),
  torah: boolean(),
  torahNote: optional(string()),
})

const backupSchema = object({
  version: literal(1),
  exportedAt: number(),
  days: array(dayRecordSchema),
})

function parseJson(text: string) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function parseBackup(text: string): Backup {
  const result = safeParse(backupSchema, parseJson(text))

  if (!result.success) {
    throw new Error(APP_COPY.invalidBackup)
  }

  return result.output
}

export async function exportBackup(now: number): Promise<Backup> {
  return { version: 1, exportedAt: now, days: await db.days.toArray() }
}

export async function restoreBackup(backup: Backup): Promise<void> {
  await db.transaction('rw', db.days, async () => {
    await db.days.clear()
    await db.days.bulkPut(backup.days.filter((day) => !isEmptyDay(day)))
  })
}
