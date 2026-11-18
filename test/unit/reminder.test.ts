import { describe, expect, it } from 'vitest'
import { missingPrayers, skipNights } from '../../src/domain/reminder'
import type { DayRecord } from '../../src/domain/types'

describe('missingPrayers', () => {
  it('lists every prayer of the day when nothing is logged', () => {
    expect(missingPrayers(undefined, '2026-10-28')).toEqual(['shacharit', 'mincha', 'maariv'])
  })

  it('leaves out prayers with any mark, ק״ש בלבד included', () => {
    const day: DayRecord = { date: '2026-10-28', prayers: { shacharit: 'shema', mincha: 'alone' }, torah: false }

    expect(missingPrayers(day, '2026-10-28')).toEqual(['maariv'])
  })

  it('counts מוסף on a day that has it', () => {
    const day: DayRecord = {
      date: '2026-10-31',
      prayers: { shacharit: 'minyan', mincha: 'minyan', maariv: 'minyan' },
      torah: false,
    }

    expect(missingPrayers(day, '2026-10-31')).toEqual(['musaf'])
  })

  it('is empty when every prayer of the day is marked', () => {
    const day: DayRecord = {
      date: '2026-10-28',
      prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' },
      torah: false,
    }

    expect(missingPrayers(day, '2026-10-28')).toEqual([])
  })
})

describe('skipNights', () => {
  it('lists the evenings that are already שבת or יום טוב', () => {
    expect(skipNights('2027-04-19', 10)).toEqual(['2027-04-21', '2027-04-23', '2027-04-27'])
  })
})
