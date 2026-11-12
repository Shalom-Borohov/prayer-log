import { COMMON_COPY } from '../copy/common'
import { prayersForDay, wornItemsForDay } from './prayersForDay'
import type { DayRecord } from './types'

export const MARKS_SEPARATOR = ', '

function prayerMarks(record: DayRecord, places: DayRecord['places']): string[] {
  return prayersForDay(record.date).flatMap((prayer) => {
    const mark = record.prayers[prayer]

    if (!mark) {
      return []
    }

    const prayerMark = COMMON_COPY.prayerMark(COMMON_COPY.prayers[prayer], COMMON_COPY.attendance[mark])
    const place = places?.[prayer]

    return [place ? COMMON_COPY.atPlace(prayerMark, place) : prayerMark]
  })
}

interface DayMarksOptions {
  withWorn?: boolean
}

export function dayMarks(
  record: DayRecord,
  places?: DayRecord['places'],
  { withWorn = true }: DayMarksOptions = {},
): string[] {
  const wornItems = withWorn ? wornItemsForDay(record.date) : []

  return [
    ...prayerMarks(record, places),
    ...wornItems.filter((item) => record[item]).map((item) => COMMON_COPY.worn[item]),
    ...(record.torah ? [COMMON_COPY.learnedTorah] : []),
  ]
}
