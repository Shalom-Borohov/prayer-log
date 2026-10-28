import { describe, expect, it } from 'vitest'
import { monthRange, periodTotals, weekRange } from '../../src/domain/totals'
import { allMinyan, day, days } from '../helpers/days'

const tally = (minyan: number, alone: number, total: number) => ({ minyan, alone, total })

describe('periodTotals', () => {
  it('is all zeros with no records', () => {
    expect(periodTotals([], '2026-10-25', '2026-10-31', '2026-10-28')).toEqual({
      prayers: tally(0, 0, 0),
      perPrayer: { shacharit: tally(0, 0, 0), musaf: tally(0, 0, 0), mincha: tally(0, 0, 0), maariv: tally(0, 0, 0) },
      torah: { days: 0, total: 0 },
    })
  })

  it('counts a partial week from the first record through today', () => {
    const records = [
      day('2026-10-28', { prayers: { mincha: 'minyan' }, torah: true }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'minyan' }, torah: true }),
      day('2026-10-27', { prayers: { shacharit: 'alone' } }),
    ]

    expect(periodTotals(records, '2026-10-25', '2026-10-31', '2026-10-28')).toEqual({
      prayers: tally(3, 2, 9),
      perPrayer: { shacharit: tally(1, 1, 3), musaf: tally(0, 0, 0), mincha: tally(1, 1, 3), maariv: tally(1, 0, 3) },
      torah: { days: 2, total: 3 },
    })
  })

  it('counts days without a record after the first record as applicable but unmarked', () => {
    const records = [day('2026-10-20', { prayers: allMinyan })]

    const totals = periodTotals(records, '2026-10-25', '2026-10-31', '2026-10-28')

    expect(totals.prayers).toEqual(tally(0, 0, 12))
    expect(totals.torah).toEqual({ days: 0, total: 4 })
  })

  it('adds מוסף only on days that have it', () => {
    const records = [day('2026-10-30', { prayers: allMinyan }), day('2026-10-31', { prayers: { ...allMinyan, musaf: 'minyan' } })]

    const totals = periodTotals(records, '2026-10-25', '2026-10-31', '2026-10-31')

    expect(totals.prayers).toEqual(tally(7, 0, 7))
    expect(totals.perPrayer.musaf).toEqual(tally(1, 0, 1))
  })

  it('counts every שבת, חול המועד and ראש חודש day in a month for מוסף', () => {
    const records = days('2026-10-01', '2026-10-28', { prayers: allMinyan })

    const totals = periodTotals(records, '2026-10-01', '2026-10-31', '2026-10-28')

    expect(totals.perPrayer.musaf).toEqual(tally(0, 0, 8))
    expect(totals.prayers).toEqual(tally(84, 0, 92))
  })

  it('is all zeros for a period before the first record or after today', () => {
    const records = [day('2026-10-20', { prayers: allMinyan, torah: true })]

    expect(periodTotals(records, '2026-10-11', '2026-10-17', '2026-10-28').torah).toEqual({ days: 0, total: 0 })
    expect(periodTotals(records, '2026-11-01', '2026-11-07', '2026-10-28').prayers).toEqual(tally(0, 0, 0))
  })
})

describe('weekRange', () => {
  it('is Sunday through Saturday', () => {
    expect(weekRange('2026-10-28')).toEqual({ from: '2026-10-25', to: '2026-10-31' })
    expect(weekRange('2026-11-01')).toEqual({ from: '2026-11-01', to: '2026-11-07' })
  })
})

describe('monthRange', () => {
  it('is the Gregorian month', () => {
    expect(monthRange('2026-10-28')).toEqual({ from: '2026-10-01', to: '2026-10-31' })
  })
})
