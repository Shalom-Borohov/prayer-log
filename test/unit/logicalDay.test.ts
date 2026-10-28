import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  addDays,
  daysInRange,
  logicalToday,
  monthEnd,
  monthStart,
  parseIsoDate,
  toIsoDate,
  weekStart,
} from '../../src/domain/logicalDay'

beforeAll(() => {
  vi.stubEnv('TZ', 'Asia/Jerusalem')
})

afterAll(() => {
  vi.unstubAllEnvs()
})

const at = (month: number, day: number, hour: number, minute = 0) => new Date(2026, month - 1, day, hour, minute).getTime()

describe('logicalToday', () => {
  it('stays on the previous date until 03:00', () => {
    expect(logicalToday(at(10, 28, 2, 59))).toBe('2026-10-27')
    expect(logicalToday(at(10, 28, 3, 0))).toBe('2026-10-28')
  })

  it('rolls back across a month boundary', () => {
    expect(logicalToday(at(11, 1, 0, 30))).toBe('2026-10-31')
  })

  it('rolls over at 03:00 on the night summer time ends', () => {
    expect(logicalToday(at(10, 25, 1, 30))).toBe('2026-10-24')
    expect(logicalToday(at(10, 25, 3, 0))).toBe('2026-10-25')
  })

  it('rolls over at 03:00 on the night summer time starts', () => {
    expect(logicalToday(at(3, 27, 1, 59))).toBe('2026-03-26')
    expect(logicalToday(at(3, 27, 3, 0))).toBe('2026-03-27')
  })
})

describe('parseIsoDate', () => {
  it('parses to local noon and round-trips through toIsoDate', () => {
    const parsed = parseIsoDate('2026-03-05')

    expect([parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), parsed.getHours()]).toEqual([2026, 2, 5, 12])
    expect(toIsoDate(parsed)).toBe('2026-03-05')
  })
})

describe('addDays', () => {
  it('steps across month and year boundaries', () => {
    expect(addDays('2026-10-31', 1)).toBe('2026-11-01')
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31')
    expect(addDays('2026-10-28', 0)).toBe('2026-10-28')
  })

  it('steps one calendar day at a time across DST changes', () => {
    expect(addDays('2026-10-24', 1)).toBe('2026-10-25')
    expect(addDays('2026-10-25', 1)).toBe('2026-10-26')
    expect(addDays('2026-03-26', 1)).toBe('2026-03-27')
    expect(addDays('2026-03-28', -2)).toBe('2026-03-26')
  })
})

describe('daysInRange', () => {
  it('lists every date inclusive across the autumn DST change', () => {
    expect(daysInRange('2026-10-24', '2026-10-27')).toEqual(['2026-10-24', '2026-10-25', '2026-10-26', '2026-10-27'])
  })

  it('has seven days in the week summer time starts', () => {
    expect(daysInRange('2026-03-22', '2026-03-28')).toHaveLength(7)
  })

  it('is a single day when from equals to and empty when from is after to', () => {
    expect(daysInRange('2026-10-28', '2026-10-28')).toEqual(['2026-10-28'])
    expect(daysInRange('2026-10-29', '2026-10-28')).toEqual([])
  })
})

describe('weekStart', () => {
  it('is the Sunday of the week, across the autumn DST change', () => {
    expect(weekStart('2026-10-28')).toBe('2026-10-25')
    expect(weekStart('2026-10-31')).toBe('2026-10-25')
    expect(weekStart('2026-10-25')).toBe('2026-10-25')
  })

  it('reaches back into the previous month and across the spring DST change', () => {
    expect(weekStart('2026-04-01')).toBe('2026-03-29')
    expect(weekStart('2026-03-28')).toBe('2026-03-22')
  })
})

describe('monthStart and monthEnd', () => {
  it('bound the Gregorian month', () => {
    expect(monthStart('2026-10-28')).toBe('2026-10-01')
    expect(monthEnd('2026-10-28')).toBe('2026-10-31')
    expect(monthEnd('2026-11-05')).toBe('2026-11-30')
    expect(monthEnd('2026-12-31')).toBe('2026-12-31')
  })

  it('handles February in common and leap years', () => {
    expect(monthEnd('2027-02-10')).toBe('2027-02-28')
    expect(monthEnd('2028-02-10')).toBe('2028-02-29')
  })
})
