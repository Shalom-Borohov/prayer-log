import { describe, expect, it } from 'vitest'
import { periodShelves } from '../../src/pages/stats/periodShelves'
import { day } from '../helpers/days'

const WEDNESDAY = '2026-10-28'

const RECORDS = [
  day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' }, torah: true }),
  day('2026-10-28', { prayers: { shacharit: 'minyan' } }),
]

const slotsOf = (shelves: ReturnType<typeof periodShelves>, key: string) =>
  shelves?.rows.find((row) => row.key === key)?.slots

describe('periodShelves', () => {
  it('lays this week out Sunday to Saturday, blank before tracking began and after today', () => {
    const week = periodShelves(RECORDS, 'week', WEDNESDAY)

    expect(week?.todayIndex).toBe(3)
    expect(slotsOf(week, 'shacharit')).toEqual(['blank', 'done', 'unmarked', 'done', 'blank', 'blank', 'blank'])
    expect(slotsOf(week, 'mincha')).toEqual(['blank', 'alone', 'unmarked', 'unmarked', 'blank', 'blank', 'blank'])
    expect(slotsOf(week, 'maariv')).toEqual(['blank', 'shema', 'unmarked', 'unmarked', 'blank', 'blank', 'blank'])
    expect(slotsOf(week, 'torah')).toEqual(['blank', 'done', 'unmarked', 'unmarked', 'blank', 'blank', 'blank'])
  })

  it('lays this month out from the 1st to its last day', () => {
    const month = periodShelves(RECORDS, 'month', WEDNESDAY)

    expect(month?.todayIndex).toBe(27)
    expect(slotsOf(month, 'shacharit')).toHaveLength(31)
    expect(slotsOf(month, 'shacharit')?.slice(24, 29)).toEqual(['blank', 'done', 'unmarked', 'done', 'blank'])
    expect(slotsOf(month, 'musaf')?.slice(0, 2)).toEqual(['blank', 'blank'])
  })

  it('draws no shelf for all time', () => {
    expect(periodShelves(RECORDS, 'all', WEDNESDAY)).toBeNull()
  })
})
