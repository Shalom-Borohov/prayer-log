import { describe, expect, it } from 'vitest'
import { backfillReminders, blankEveMaariv, emptyRecentDays } from '../../src/domain/backfill'
import { allMinyan, day, days } from '../helpers/days'

const today = '2026-10-28'

describe('emptyRecentDays', () => {
  it('is empty with no records', () => {
    expect(emptyRecentDays([], today)).toEqual([])
  })

  it('lists days without a record in the 7 days before today, oldest first, never today', () => {
    const records = [
      day('2026-10-25', { prayers: allMinyan }),
      day('2026-10-01', { torah: true }),
      day('2026-10-22', { prayers: allMinyan }),
    ]

    expect(emptyRecentDays(records, today)).toEqual(['2026-10-21', '2026-10-23', '2026-10-24', '2026-10-26', '2026-10-27'])
  })

  it('lists a record with nothing marked but not a partly filled one', () => {
    const records = [
      day('2026-10-21', { prayers: allMinyan }),
      day('2026-10-22'),
      day('2026-10-23', { prayers: { shacharit: undefined } }),
      day('2026-10-24', { prayers: { musaf: 'alone' } }),
      day('2026-10-25', { torah: true }),
      day('2026-10-26', { torahNote: 'משנה ברורה' }),
      day('2026-10-27', { prayers: { maariv: 'minyan' } }),
    ]

    expect(emptyRecentDays(records, today)).toEqual(['2026-10-22', '2026-10-23', '2026-10-26'])
  })

  it('does not list a day with only תפילין or טלית marked', () => {
    const records = [day('2026-10-26', { tefillin: true }), day('2026-10-27', { tallit: true })]

    expect(emptyRecentDays(records, today)).toEqual([])
  })

  it('never lists days before the first record', () => {
    const records = [day('2026-10-26', { prayers: allMinyan })]

    expect(emptyRecentDays(records, today)).toEqual(['2026-10-27'])
    expect(emptyRecentDays([day(today, { torah: true })], today)).toEqual([])
  })

  it('starts tracking on a first day with only a note, and lists that day', () => {
    const records = [day('2026-10-26', { torahNote: 'משנה ברורה' })]

    expect(emptyRecentDays(records, today)).toEqual(['2026-10-26', '2026-10-27'])
  })
})

describe('blankEveMaariv', () => {
  it('lists a partly filled eve of שבת or יום טוב whose ערבית is blank', () => {
    const records = [
      day('2026-10-20', { prayers: allMinyan }),
      day('2026-10-23', { prayers: { shacharit: 'minyan', mincha: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan' } }),
    ]

    expect(blankEveMaariv(records, today)).toEqual(['2026-10-23'])
  })

  it('skips an eve whose ערבית is marked, an empty eve, and eves older than a week', () => {
    const records = [
      day('2026-10-16', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-23', { prayers: { maariv: 'alone' } }),
    ]

    expect(blankEveMaariv(records, today)).toEqual([])
    expect(blankEveMaariv([day('2026-10-20', { torah: true })], today)).toEqual([])
  })

  it('lists an eve with only למדתי ticked', () => {
    expect(blankEveMaariv([day('2026-10-23', { torah: true })], today)).toEqual(['2026-10-23'])
  })

  it('skips an eve with only a note', () => {
    expect(blankEveMaariv([day('2026-10-23', { torahNote: 'משנה ברורה' })], today)).toEqual([])
  })
})

describe('backfillReminders', () => {
  it('merges empty days and blank eve ערבית, oldest first', () => {
    const records = [
      day('2026-10-20', { prayers: allMinyan }),
      day('2026-10-23', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: allMinyan }),
      day('2026-10-27', { prayers: allMinyan }),
    ]

    expect(backfillReminders(records, today)).toEqual([
      { date: '2026-10-21', kind: 'empty' },
      { date: '2026-10-22', kind: 'empty' },
      { date: '2026-10-23', kind: 'eveMaariv' },
      { date: '2026-10-24', kind: 'empty' },
      { date: '2026-10-25', kind: 'empty' },
    ])
  })

  it('gives an eve with only a note one row, not two', () => {
    const records = [day('2026-10-23', { torahNote: 'משנה ברורה' }), ...days('2026-10-24', '2026-10-27', { prayers: allMinyan })]

    expect(backfillReminders(records, today)).toEqual([{ date: '2026-10-23', kind: 'empty' }])
  })
})
