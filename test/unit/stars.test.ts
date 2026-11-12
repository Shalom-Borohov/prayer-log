import { describe, expect, it } from 'vitest'
import { daysInRange } from '../../src/domain/logicalDay'
import { chartLines, hasStreak, type StarKey, starLabel, streakLinks } from '../../src/domain/stars'
import type { DayRecord } from '../../src/domain/types'
import { day, days } from '../helpers/days'

const week = (from: string, to: string) => daysInRange(from, to)

describe('starLabel', () => {
  it('leaves blank days out of the count', () => {
    expect(starLabel(['blank', 'blank', 'blank', 'blank', 'blank', 'done', 'unmarked'], 'shacharit')).toBe(
      '1 מתוך 2 הימים האחרונים במניין',
    )
  })

  it('names Torah days as learning', () => {
    expect(starLabel(['blank', 'done', 'unmarked'], 'torah')).toBe('1 מתוך 2 הימים האחרונים עם לימוד')
  })

  it('reads naturally on the first tracked day', () => {
    expect(starLabel(['blank', 'blank', 'done'], 'shacharit')).toBe('1 מתוך יום אחד במניין')
  })

  it('has no count when every day is blank', () => {
    expect(starLabel(['blank', 'blank', 'blank'], 'shacharit')).toBe('עוד אין נתונים')
  })
})

describe('streakLinks', () => {
  it('joins neighbouring days said במניין', () => {
    expect(streakLinks(['done', 'done', 'alone', 'done', 'done', 'done', 'unmarked'], 'shacharit')).toEqual([
      { from: 0, to: 1 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ])
  })

  it('never joins מוסף', () => {
    expect(streakLinks(['blank', 'done', 'done'], 'musaf')).toEqual([])
  })

  it('runs off an edge when the streak goes on in the next or previous week', () => {
    const edges = { before: 'done', after: 'done' } as const

    expect(streakLinks(['done', 'unmarked', 'done'], 'torah', edges)).toEqual([
      { from: -1, to: 0 },
      { from: 2, to: 3 },
    ])
  })
})

describe('chartLines', () => {
  const records = [
    day('2026-10-22', { prayers: { shacharit: 'minyan' } }),
    day('2026-10-24', { prayers: { shacharit: 'alone' }, torah: true }),
    day('2026-10-25', { prayers: { mincha: 'minyan' } }),
  ]

  const TODAY = '2026-10-28'

  const starsFor = (dayRecords: DayRecord[], key: StarKey, dates: string[], today = TODAY) =>
    chartLines(dayRecords, dates, today, false).find((line) => line.key === key)?.stars

  it('gives each day its star, blank before tracking began', () => {
    expect(starsFor(records, 'shacharit', week('2026-10-20', '2026-10-26'))).toEqual([
      'blank',
      'blank',
      'done',
      'unmarked',
      'alone',
      'unmarked',
      'unmarked',
    ])
  })

  it('leaves מוסף blank on days it is not said', () => {
    const shabbat = [day('2026-10-23', { prayers: { shacharit: 'minyan' } }), day('2026-10-24', { prayers: { musaf: 'minyan' } })]

    expect(starsFor(shabbat, 'musaf', week('2026-10-23', '2026-10-25'))).toEqual(['blank', 'done', 'blank'])
  })

  it('draws ק״ש בלבד as its own star', () => {
    const shemaDays = [day('2026-10-26', { prayers: { maariv: 'shema' } }), day('2026-10-27', { prayers: { maariv: 'alone' } })]

    expect(starsFor(shemaDays, 'maariv', week('2026-10-26', '2026-10-27'))).toEqual(['shema', 'alone'])
  })

  it('marks a day of learning as done', () => {
    expect(starsFor(records, 'torah', week('2026-10-23', '2026-10-25'))).toEqual(['unmarked', 'done', 'unmarked'])
  })

  it('leaves days after today blank', () => {
    expect(starsFor(records, 'shacharit', week('2026-10-24', '2026-10-27'), '2026-10-25')).toEqual([
      'alone',
      'unmarked',
      'blank',
      'blank',
    ])
  })

  it('draws a line for each prayer due on any of the days, then Torah', () => {
    const lines = chartLines(records, week('2026-10-23', '2026-10-24'), TODAY, false)

    expect(lines.map(({ key }) => key)).toEqual(['shacharit', 'musaf', 'mincha', 'maariv', 'torah'])
    expect(chartLines(records, week('2026-10-25', '2026-10-26'), TODAY, false).map(({ key }) => key)).toEqual([
      'shacharit',
      'mincha',
      'maariv',
      'torah',
    ])
  })

  it('runs a streak link off an edge only when asked to look past the days', () => {
    const streak = days('2026-10-20', '2026-10-26', { prayers: { shacharit: 'minyan' } })

    const shacharitLinks = (withEdges: boolean) =>
      chartLines(streak, week('2026-10-21', '2026-10-25'), TODAY, withEdges)[0].links

    expect(shacharitLinks(false)).toHaveLength(4)
    expect(shacharitLinks(true)).toEqual([
      { from: -1, to: 0 },
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 3 },
      { from: 3, to: 4 },
      { from: 4, to: 5 },
    ])
  })
})

describe('hasStreak', () => {
  it('is false only for מוסף', () => {
    const keys: StarKey[] = ['shacharit', 'musaf', 'mincha', 'maariv', 'torah']

    expect(keys.filter(hasStreak)).toEqual(['shacharit', 'mincha', 'maariv', 'torah'])
  })
})
