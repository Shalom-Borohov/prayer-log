import { latestFirst } from './places'
import { GEMARA_TRACTATES, MISHNA_TRACTATES, placeRange } from './tractates'
import type { DayRecord, LearningEntry, LearningKind } from './types'

const sameTractate = (a: LearningEntry, b: LearningEntry) => a.kind === b.kind && a.tractate === b.tractate

const entriesUpTo = (records: DayRecord[], date: string) =>
  latestFirst(records)
    .filter((record) => record.date <= date)
    .flatMap((record) => (record.learning ?? []).toReversed())

export function learningHints(records: DayRecord[], date: string): LearningEntry[] {
  const logged = records.find((record) => record.date === date)?.learning ?? []
  const previous = latestFirst(records).find((record) => record.date < date && record.learning?.length)?.learning ?? []

  return previous.filter((hint) => !logged.some((entry) => sameTractate(entry, hint)))
}

export function withPlaceInRange(entry: LearningEntry): LearningEntry {
  const { first, last } = placeRange(entry)
  const clamp = (place: number) => Math.min(Math.max(place, first), last)

  return entry.kind === 'gemara' ? { ...entry, daf: clamp(entry.daf) } : { ...entry, chapter: clamp(entry.chapter) }
}

function firstPlace(kind: LearningKind): LearningEntry {
  if (kind === 'gemara') {
    const tractate = GEMARA_TRACTATES[0]

    return { kind, tractate, daf: placeRange({ kind, tractate, daf: 0 }).first }
  }

  return { kind, tractate: MISHNA_TRACTATES[0], chapter: 1 }
}

export function startingEntry(records: DayRecord[], date: string, kind?: LearningKind): LearningEntry {
  const entries = entriesUpTo(records, date)
  const wanted = kind ?? entries[0]?.kind ?? 'gemara'
  const latest = entries.find((entry) => entry.kind === wanted)

  return latest ? withPlaceInRange(latest) : firstPlace(wanted)
}
