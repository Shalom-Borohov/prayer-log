import {
  array,
  boolean,
  check,
  integer,
  literal,
  minValue,
  number,
  object,
  optional,
  picklist,
  pipe,
  record,
  safeParse,
  string,
  variant,
} from 'valibot'
import { APP_COPY } from '../copy/app'
import { isIsoDate } from '../domain/logicalDay'
import { type DaySummary, summarizeDates } from '../domain/restorePreview'
import { GEMARA_TRACTATES, MISHNA_TRACTATES } from '../domain/tractates'
import { ATTENDANCES, type DayRecord, isEmptyDay, PRAYERS } from '../domain/types'
import { db } from './db'
import { normalizeDay, storedDaysSummary } from './repo'
import { replaceDaysKeepingCopy } from './restoreUndo'

export type Backup = { version: 1; exportedAt: number; days: DayRecord[] }

export class InvalidBackupError extends Error {
  constructor() {
    super(APP_COPY.invalidBackup)
  }
}

const placeNumberSchema = pipe(number(), integer(), minValue(1))

const learningEntrySchema = variant('kind', [
  object({ kind: literal('gemara'), tractate: picklist(GEMARA_TRACTATES), daf: placeNumberSchema }),
  object({ kind: literal('mishna'), tractate: picklist(MISHNA_TRACTATES), chapter: placeNumberSchema }),
])

const dayRecordSchema = object({
  date: pipe(string(), check(isIsoDate)),
  prayers: record(picklist(PRAYERS), picklist(ATTENDANCES)),
  places: optional(record(picklist(PRAYERS), string())),
  torah: boolean(),
  torahNote: optional(string()),
  learning: optional(array(learningEntrySchema)),
  tefillin: optional(boolean()),
  tallit: optional(boolean()),
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
    throw new InvalidBackupError()
  }

  return result.output
}

export async function exportBackup(now: number): Promise<Backup> {
  return { version: 1, exportedAt: now, days: await db.days.toArray() }
}

export const countBadRecords = (fileText: string): number =>
  JSON.parse(fileText).days.filter((day: unknown) => !safeParse(dayRecordSchema, day).success).length

const storableDays = (backup: Backup) => backup.days.map(normalizeDay).filter((day) => !isEmptyDay(day))

export async function importPreview(backup: Backup): Promise<{ file: DaySummary; phone: DaySummary }> {
  return {
    file: summarizeDates(storableDays(backup).map((day) => day.date)),
    phone: await storedDaysSummary(),
  }
}

export async function restoreBackup(backup: Backup, replacedBackupAt: number | null): Promise<void> {
  await db.transaction('rw', db.days, db.restoreUndo, () =>
    replaceDaysKeepingCopy(() => ({ brought: storableDays(backup), kept: [] }), 'undo', replacedBackupAt),
  )
}
