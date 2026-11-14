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
  it('shows all time by week up to twelve weeks, then by month', () => {
    expect(trendUnit({ from: '2026-10-28', to: '2026-10-28' })).toBe('week')
    expect(trendUnit({ from: '2026-08-06', to: '2026-10-28' })).toBe('week')
    expect(trendUnit({ from: '2026-08-05', to: '2026-10-28' })).toBe('month')
  })

  it('moves all time to quarters once months take more than 36 columns', () => {
    expect(trendUnit({ from: '2026-08-20', to: '2029-07-31' })).toBe('month')
    expect(trendUnit({ from: '2026-08-20', to: '2029-08-01' })).toBe('quarter')
  })

  it('moves all time to years once quarters take more than 36 columns', () => {
    expect(trendUnit({ from: '2026-01-01', to: '2034-12-31' })).toBe('quarter')
    expect(trendUnit({ from: '2026-01-01', to: '2035-01-01' })).toBe('year')
  })

  it('counts a partial first quarter as a column', () => {
    expect(trendUnit({ from: '2026-03-31', to: '2034-12-31' })).toBe('quarter')
    expect(trendUnit({ from: '2026-03-31', to: '2035-01-01' })).toBe('year')
  })
})

describe('trendBuckets', () => {
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

  it('splits all time into calendar quarters, the first one starting at the first record', () => {
    const buckets = trendBuckets([], { from: '2026-08-20', to: '2027-02-10' }, 'quarter', '2027-02-10')

    expect(buckets.map(({ start, end }) => [start, end])).toEqual([
      ['2026-08-20', '2026-09-30'],
      ['2026-10-01', '2026-12-31'],
      ['2027-01-01', '2027-02-10'],
    ])
  })

  it('splits all time into calendar years, the first one starting at the first record', () => {
    const buckets = trendBuckets([], { from: '2026-08-20', to: '2028-02-10' }, 'year', '2028-02-10')

    expect(buckets.map(({ start, end }) => [start, end])).toEqual([
      ['2026-08-20', '2026-12-31'],
      ['2027-01-01', '2027-12-31'],
      ['2028-01-01', '2028-02-10'],
    ])
  })

  it('keeps five years of history to 21 quarterly columns', () => {
    const range = { from: '2021-11-08', to: '2026-11-07' }

    expect(trendUnit(range)).toBe('quarter')
    expect(trendBuckets([], range, 'quarter', '2026-11-07')).toHaveLength(21)
  })

  it('adds up to the period totals, leaving out an unmarked today', () => {
    const records = [
      ...days('2026-08-20', '2026-09-30', { prayers: { shacharit: 'minyan', maariv: 'shema' } }),
      ...days('2026-10-05', '2026-10-27', { prayers: { mincha: 'alone', musaf: 'minyan' } }),
    ]

    const range = allTimeRange(records, '2026-10-28')

    for (const unit of ['week', 'month', 'quarter', 'year'] as const) {
      expect(sum(trendBuckets(records, range, unit, '2026-10-28').map(({ tally }) => tally))).toEqual(
        periodTotals(records, range.from, '2026-10-27', '2026-10-28').prayers,
      )
    }
  })
})
