import { type DayRecord, type Prayer, PRAYERS } from './types'

const latestFirst = (records: DayRecord[]) => records.toSorted((a, b) => b.date.localeCompare(a.date))

const isPlace = (place: string | undefined) => place !== undefined

export function knownPlaces(records: DayRecord[]): string[] {
  const places = latestFirst(records)
    .flatMap((record) => PRAYERS.toReversed().map((prayer) => record.places?.[prayer]))
    .filter(isPlace)

  return [...new Set(places)]
}

export function defaultPlace(records: DayRecord[], prayer: Prayer): string | undefined {
  return latestFirst(records).find((record) => record.places?.[prayer])?.places?.[prayer]
}
