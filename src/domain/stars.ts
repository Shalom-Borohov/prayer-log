import { COMMON_COPY } from '../copy/common'
import { FORMAT_COPY } from '../copy/format'
import { addDays } from './logicalDay'
import { prayersForDay } from './prayersForDay'
import { trackingStart } from './totals'
import { type Attendance, type DayRecord, type Prayer, PRAYERS, type StreakKey } from './types'

export type StarState = 'done' | 'alone' | 'shema' | 'unmarked' | 'blank'

export type StarKey = Prayer | 'torah'

export interface StreakLink {
  from: number
  to: number
}

export interface ChartLine {
  key: StarKey
  stars: StarState[]
  links: StreakLink[]
}

interface StreakEdges {
  before?: StarState
  after?: StarState
}

const MARK_STARS = { minyan: 'done', alone: 'alone', shema: 'shema' } as const satisfies Record<Attendance, StarState>

export function starFor(record: DayRecord | undefined, key: StarKey): StarState {
  if (key === 'torah') {
    return record?.torah ? 'done' : 'unmarked'
  }

  const mark = record?.prayers[key]

  return mark ? MARK_STARS[mark] : 'unmarked'
}

export const hasStreak = (key: StarKey): key is StreakKey => key !== 'musaf'

export function chartLines(records: DayRecord[], dates: string[], today: string, withEdges: boolean): ChartLine[] {
  const start = trackingStart(records)
  const byDate = new Map(records.map((day) => [day.date, day]))
  const edgeDates = withEdges ? [addDays(dates[0], -1), addDays(dates[dates.length - 1], 1)] : []
  const dueOn = new Map([...dates, ...edgeDates].map((date) => [date, prayersForDay(date)]))
  const isDue = (date: string, key: StarKey) => key === 'torah' || dueOn.get(date)?.includes(key) === true

  const starOn = (date: string, key: StarKey): StarState =>
    start === null || date < start || date > today || !isDue(date, key) ? 'blank' : starFor(byDate.get(date), key)

  const keys: StarKey[] = [...PRAYERS.filter((prayer) => dates.some((date) => isDue(date, prayer))), 'torah']

  return keys.map((key) => {
    const stars = dates.map((date) => starOn(date, key))
    const [before, after]: (StarState | undefined)[] = edgeDates.map((date) => starOn(date, key))

    return { key, stars, links: streakLinks(stars, key, { before, after }) }
  })
}

export function starLabel(stars: StarState[], key: StarKey): string {
  const tracked = stars.filter((star) => star !== 'blank')

  if (tracked.length === 0) {
    return COMMON_COPY.noData
  }

  const doneLabel = key === 'torah' ? FORMAT_COPY.withLearning : COMMON_COPY.attendance.minyan

  return FORMAT_COPY.recentDays(stars.filter((star) => star === 'done').length, tracked.length, doneLabel)
}

export function streakLinks(stars: StarState[], key: StarKey, { before, after }: StreakEdges = {}): StreakLink[] {
  if (!hasStreak(key)) {
    return []
  }

  const line = [before, ...stars, after]

  return line.flatMap((star, index) =>
    index + 1 < line.length && star === 'done' && line[index + 1] === 'done' ? [{ from: index - 1, to: index }] : [],
  )
}
