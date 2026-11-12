import { describe, expect, it } from 'vitest'
import { daysInRange } from '../../src/domain/logicalDay'
import { monthWeeks, weekHolidays } from '../../src/domain/monthWeeks'

const sundays = (weeks: string[][]) => weeks.map((week) => week[0])

describe('monthWeeks', () => {
  it('gives every Sunday–Saturday week touching a past month, newest first', () => {
    const weeks = monthWeeks('2026-09-01', '2026-10-28')

    expect(sundays(weeks)).toEqual(['2026-09-27', '2026-09-20', '2026-09-13', '2026-09-06', '2026-08-30'])
    expect(weeks[0]).toEqual([
      '2026-09-27',
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
    ])
  })

  it('leaves out the weeks wholly after today', () => {
    expect(sundays(monthWeeks('2026-11-01', '2026-11-12'))).toEqual(['2026-11-08', '2026-11-01'])
  })

  it('keeps the week of today even when today is its Sunday', () => {
    expect(sundays(monthWeeks('2026-11-01', '2026-11-01'))).toEqual(['2026-11-01'])
  })
})

describe('weekHolidays', () => {
  it('merges consecutive days with the same name into one run', () => {
    expect(weekHolidays(daysInRange('2026-11-08', '2026-11-14'))).toEqual([
      { from: '2026-11-10', to: '2026-11-11', name: 'ראש חודש כסלו' },
    ])
  })

  it('has none in a week without a holiday', () => {
    expect(weekHolidays(daysInRange('2026-11-01', '2026-11-07'))).toEqual([])
  })

  it('keeps different names apart, in date order', () => {
    expect(weekHolidays(['2026-12-10', '2026-12-11'])).toEqual([
      { from: '2026-12-10', to: '2026-12-10', name: 'חג הבנות' },
      { from: '2026-12-10', to: '2026-12-11', name: 'ראש חודש טבת' },
      { from: '2026-12-10', to: '2026-12-10', name: 'חנוכה: ז׳ נרות' },
      { from: '2026-12-11', to: '2026-12-11', name: 'חנוכה: ח׳ נרות' },
    ])
  })
})
