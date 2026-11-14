import { describe, expect, it } from 'vitest'
import { daysInRange } from '../../src/domain/logicalDay'
import { type ShelfKey, shelfLabel, shelfRows } from '../../src/domain/shelf'
import type { DayRecord } from '../../src/domain/types'
import { day } from '../helpers/days'

const week = (from: string, to: string) => daysInRange(from, to)

describe('shelfLabel', () => {
  it('leaves blank days out of the count', () => {
    expect(shelfLabel(['blank', 'blank', 'blank', 'blank', 'blank', 'done', 'unmarked'], 'shacharit')).toBe(
      '1 מתוך 2 הימים האחרונים במניין',
    )
  })

  it('names Torah days as learning', () => {
    expect(shelfLabel(['blank', 'done', 'unmarked'], 'torah')).toBe('1 מתוך 2 הימים האחרונים עם לימוד')
  })

  it('reads naturally on the first tracked day', () => {
    expect(shelfLabel(['blank', 'blank', 'done'], 'shacharit')).toBe('1 מתוך יום אחד במניין')
  })

  it('has no count when every day is blank', () => {
    expect(shelfLabel(['blank', 'blank', 'blank'], 'shacharit')).toBe('עוד אין נתונים')
  })
})

describe('shelfRows', () => {
  const records = [
    day('2026-10-22', { prayers: { shacharit: 'minyan' } }),
    day('2026-10-24', { prayers: { shacharit: 'alone' }, torah: true }),
    day('2026-10-25', { prayers: { mincha: 'minyan' } }),
  ]

  const TODAY = '2026-10-28'

  const slotsFor = (dayRecords: DayRecord[], key: ShelfKey, dates: string[], today = TODAY) =>
    shelfRows(dayRecords, dates, today).find((row) => row.key === key)?.slots

  it('gives each day its slot, blank before tracking began', () => {
    expect(slotsFor(records, 'shacharit', week('2026-10-20', '2026-10-26'))).toEqual([
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

    expect(slotsFor(shabbat, 'musaf', week('2026-10-23', '2026-10-25'))).toEqual(['blank', 'done', 'blank'])
  })

  it('gives ק״ש בלבד its own slot', () => {
    const shemaDays = [day('2026-10-26', { prayers: { maariv: 'shema' } }), day('2026-10-27', { prayers: { maariv: 'alone' } })]

    expect(slotsFor(shemaDays, 'maariv', week('2026-10-26', '2026-10-27'))).toEqual(['shema', 'alone'])
  })

  it('marks a day of learning as done', () => {
    expect(slotsFor(records, 'torah', week('2026-10-23', '2026-10-25'))).toEqual(['unmarked', 'done', 'unmarked'])
  })

  it('leaves days after today blank', () => {
    expect(slotsFor(records, 'shacharit', week('2026-10-24', '2026-10-27'), '2026-10-25')).toEqual([
      'alone',
      'unmarked',
      'blank',
      'blank',
    ])
  })

  it('has a row for each prayer due on any of the days, then Torah', () => {
    const keysOf = (dates: string[]) => shelfRows(records, dates, TODAY).map(({ key }) => key)

    expect(keysOf(week('2026-10-23', '2026-10-24'))).toEqual(['shacharit', 'musaf', 'mincha', 'maariv', 'torah'])
    expect(keysOf(week('2026-10-25', '2026-10-26'))).toEqual(['shacharit', 'mincha', 'maariv', 'torah'])
  })
})
