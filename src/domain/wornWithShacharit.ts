import { isTishaBav } from './hebrewCalendar'
import { wornItemsForDay } from './prayersForDay'
import { type DayRecord, WORN_AT_PRAYER } from './types'

export function withWornFollowingShacharit(before: DayRecord, after: DayRecord): DayRecord {
  const wasMarked = before.prayers[WORN_AT_PRAYER] !== undefined
  const isMarked = after.prayers[WORN_AT_PRAYER] !== undefined

  if (wasMarked === isMarked || isTishaBav(after.date)) {
    return after
  }

  if (isMarked) {
    return wornItemsForDay(after.date).reduce((day, item) => ({ ...day, [item]: true }), after)
  }

  const { tefillin: _tefillin, tallit: _tallit, ...cleared } = after

  return cleared
}
