import { RESTORE_COPY } from '../copy/restore'
import { fullDateLabel } from './format'
import { DAYS_PER_WEEK } from './logicalDay'
import type { DayRecord } from './types'

export type DaySummary = { count: number; newest: string | null }

export function summarizeDates(dates: string[]): DaySummary {
  const newest = dates.reduce<string | null>((latest, date) => (latest === null || date > latest ? date : latest), null)

  return { count: dates.length, newest }
}

function mergeMarks(older: DayRecord, newer: DayRecord): DayRecord {
  return {
    ...older,
    ...newer,
    prayers: { ...older.prayers, ...newer.prayers },
    places: { ...older.places, ...newer.places },
    learning: [...(older.learning ?? []), ...(newer.learning ?? [])],
    torah: older.torah || newer.torah,
  }
}

export function keptOnSwap(
  current: DayRecord[],
  copy: { keepAfter: string | null; days: DayRecord[] },
): DayRecord[] {
  const copyDays = new Map(copy.days.map((record) => [record.date, record]))

  return current
    .filter((record) => copy.keepAfter === null || record.date > copy.keepAfter)
    .map((record) => {
      const older = copyDays.get(record.date)

      return older ? mergeMarks(older, record) : record
    })
}

function summaryLabel({ count, newest }: DaySummary): string {
  return newest === null ? RESTORE_COPY.noData : RESTORE_COPY.daysUpTo(count, fullDateLabel(newest))
}

export function importComparison({ file, phone }: { file: DaySummary; phone: DaySummary }): string[] {
  const lines = [RESTORE_COPY.inFile(summaryLabel(file)), RESTORE_COPY.onPhone(summaryLabel(phone))]

  if (file.newest !== null && phone.newest !== null && phone.newest > file.newest) {
    lines.push(RESTORE_COPY.phoneHasLater(fullDateLabel(file.newest)))
  }

  return lines
}

export function swapComparison({ copy, current, kept }: { copy: DaySummary; current: DaySummary; kept: number }) {
  const lines = [RESTORE_COPY.comingBack(summaryLabel(copy)), RESTORE_COPY.current(summaryLabel(current))]

  if (kept > 0) {
    lines.push(RESTORE_COPY.daysLoggedSinceStay(kept))
  }

  return lines
}

const DAY_MS = 24 * 60 * 60 * 1000

export const restoreUndoExpiresAt = (savedAt: number) => savedAt + DAYS_PER_WEEK * DAY_MS
