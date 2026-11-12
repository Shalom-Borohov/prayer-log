import { describe, expect, it } from 'vitest'
import { bucketShare, dayStar } from '../../src/domain/dayStar'
import { daysInRange } from '../../src/domain/logicalDay'
import { dayTallies } from '../../src/domain/totals'
import type { DayRecord } from '../../src/domain/types'
import { allMinyan, day, tally } from '../helpers/days'

const dayStars = (records: DayRecord[], dates: string[], today: string) =>
  dayTallies(records, dates, today).map((dayTally, index) => dayStar(dayTally, dates[index] === today))

describe('dayStar', () => {
  it('sizes each past day by how much of it was במניין', () => {
    const records = [
      day('2026-10-26', { prayers: allMinyan }),
      day('2026-10-27', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
      day('2026-10-28', { prayers: { shacharit: 'alone', maariv: 'shema' } }),
    ]

    expect(dayStars(records, daysInRange('2026-10-26', '2026-10-29'), '2026-10-30')).toEqual([
      'full',
      'part',
      'faint',
      'unmarked',
    ])
  })

  it('counts מוסף on the days it is said', () => {
    const records = [day('2026-10-31', { prayers: allMinyan })]

    expect(dayStars(records, ['2026-10-31'], '2026-11-01')).toEqual(['part'])
  })

  it('judges today only by what is marked, and waits while nothing is', () => {
    const records = [day('2026-10-26', { prayers: allMinyan }), day('2026-10-27', { prayers: { shacharit: 'minyan' } })]

    expect(dayStars(records, ['2026-10-27'], '2026-10-27')).toEqual(['full'])
    expect(dayStars(records, ['2026-10-28'], '2026-10-28')).toEqual(['pending'])
  })

  it('leaves days before tracking and days ahead blank', () => {
    const records = [day('2026-10-27', { prayers: allMinyan })]

    expect(dayStars(records, daysInRange('2026-10-26', '2026-10-29'), '2026-10-28')).toEqual([
      'blank',
      'full',
      'pending',
      'blank',
    ])
  })
})

describe('bucketShare', () => {
  it('is the share of the counted prayers said במניין', () => {
    expect(bucketShare(tally(3, 1, 4))).toBe(0.75)
  })

  it('has no share when nothing was counted', () => {
    expect(bucketShare(tally(0, 0, 0))).toBeNull()
  })
})
