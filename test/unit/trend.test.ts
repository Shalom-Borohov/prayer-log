import { describe, expect, it } from 'vitest'
import { trendBuckets, trendUnit } from '../../src/domain/trend'
import { allTimeRange, periodTotals } from '../../src/domain/totals'
import type { PrayerTally } from '../../src/domain/types'
import { allMinyan, day, days, tally } from '../helpers/days'

const sum = (tallies: PrayerTally[]) =>
  tallies.reduce(
    (acc, { minyan, alone, shema, total }) =>
      tally(acc.minyan + minyan, acc.alone + alone, acc.total + total, acc.shema + shema),
    tally(0, 0, 0),
  )

describe('trendUnit', () => {
  it('shows a week by day and a month by week', () => {
    expect(trendUnit('week', { from: '2026-10-25', to: '2026-10-31' })).toBe('day')
    expect(trendUnit('month', { from: '2026-10-01', to: '2026-10-31' })).toBe('week')
  })

  it('shows all time by week up to twelve weeks, then by month', () => {
    expect(trendUnit('all', { from: '2026-10-28', to: '2026-10-28' })).toBe('week')
    expect(trendUnit('all', { from: '2026-08-06', to: '2026-10-28' })).toBe('week')
    expect(trendUnit('all', { from: '2026-08-05', to: '2026-10-28' })).toBe('month')
  })
})

describe('trendBuckets', () => {
  it('splits a week into seven days, counting nothing before the first record or after today, and today only as marked', () => {
    const records = [
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' } }),
      day('2026-10-27', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-28', { prayers: { shacharit: 'minyan' } }),
    ]

    expect(trendBuckets(records, { from: '2026-10-25', to: '2026-10-31' }, 'day', '2026-10-28')).toEqual([
      { start: '2026-10-25', end: '2026-10-25', tally: tally(0, 0, 0) },
      { start: '2026-10-26', end: '2026-10-26', tally: tally(1, 1, 3, 1) },
      { start: '2026-10-27', end: '2026-10-27', tally: tally(1, 0, 3) },
      { start: '2026-10-28', end: '2026-10-28', tally: tally(1, 0, 1) },
      { start: '2026-10-29', end: '2026-10-29', tally: tally(0, 0, 0) },
      { start: '2026-10-30', end: '2026-10-30', tally: tally(0, 0, 0) },
      { start: '2026-10-31', end: '2026-10-31', tally: tally(0, 0, 0) },
    ])
  })

  it('splits a month into Sunday weeks, the first one starting on the 1st', () => {
    const records = days('2026-10-01', '2026-10-28', { prayers: allMinyan })

    expect(trendBuckets(records, { from: '2026-10-01', to: '2026-10-31' }, 'week', '2026-10-28')).toEqual([
      { start: '2026-10-01', end: '2026-10-03', tally: tally(9, 0, 12) },
      { start: '2026-10-04', end: '2026-10-10', tally: tally(21, 0, 22) },
      { start: '2026-10-11', end: '2026-10-17', tally: tally(21, 0, 24) },
      { start: '2026-10-18', end: '2026-10-24', tally: tally(21, 0, 22) },
      { start: '2026-10-25', end: '2026-10-31', tally: tally(12, 0, 12) },
    ])
  })

  it('splits all time into months, the first one starting at the first record', () => {
    const records = [day('2026-08-20', { prayers: allMinyan }), day('2026-10-27', { prayers: { shacharit: 'alone' } })]

    const buckets = trendBuckets(records, allTimeRange(records, '2026-10-28'), 'month', '2026-10-28')

    expect(buckets.map(({ start }) => start)).toEqual(['2026-08-20', '2026-09-01', '2026-10-01'])
    expect(buckets[0].tally.minyan).toBe(3)
    expect(buckets[2].tally.alone).toBe(1)
  })

  it('adds up to the period totals, leaving out an unmarked today', () => {
    const records = [
      ...days('2026-08-20', '2026-09-30', { prayers: { shacharit: 'minyan', maariv: 'shema' } }),
      ...days('2026-10-05', '2026-10-27', { prayers: { mincha: 'alone', musaf: 'minyan' } }),
    ]

    const range = allTimeRange(records, '2026-10-28')

    for (const unit of ['day', 'week', 'month'] as const) {
      expect(sum(trendBuckets(records, range, unit, '2026-10-28').map(({ tally }) => tally))).toEqual(
        periodTotals(records, range.from, '2026-10-27', '2026-10-28').prayers,
      )
    }
  })
})
