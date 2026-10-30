import { describe, expect, it } from 'vitest'
import {
  dateTimeLabel,
  fullDateLabel,
  gregorianLabel,
  monthTitle,
  shortWeekday,
  streakLabel,
  weekdayName,
} from '../../src/domain/format'

describe('weekdayName', () => {
  it('names each day of a Sunday–Saturday week', () => {
    const week = ['2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29', '2026-10-30', '2026-10-31']

    expect(week.map(weekdayName)).toEqual([
      'יום ראשון',
      'יום שני',
      'יום שלישי',
      'יום רביעי',
      'יום חמישי',
      'יום שישי',
      'שבת',
    ])
  })
})

describe('shortWeekday', () => {
  it('uses a letter with geresh', () => {
    expect(shortWeekday('2026-10-25')).toBe('א׳')
    expect(shortWeekday('2026-10-30')).toBe('ו׳')
    expect(shortWeekday('2026-10-31')).toBe('ש׳')
  })
})

describe('gregorianLabel', () => {
  it('is day.month without padding', () => {
    expect(gregorianLabel('2026-10-28')).toBe('28.10')
    expect(gregorianLabel('2027-03-05')).toBe('5.3')
  })
})

describe('fullDateLabel', () => {
  it('is day.month.year without padding', () => {
    expect(fullDateLabel('2026-10-29')).toBe('29.10.2026')
    expect(fullDateLabel('2027-03-05')).toBe('5.3.2027')
  })
})

describe('dateTimeLabel', () => {
  it('is the full date and a zero-padded local time', () => {
    expect(dateTimeLabel(new Date(2026, 9, 29, 14, 5).getTime())).toBe('29.10.2026 14:05')
    expect(dateTimeLabel(new Date(2027, 2, 5, 0, 30).getTime())).toBe('5.3.2027 00:30')
  })
})

describe('streakLabel', () => {
  it('reads as plain Hebrew counts', () => {
    expect([0, 1, 2, 12].map(streakLabel)).toEqual(['אין רצף', 'יום אחד ברצף', '2 ימים ברצף', '12 ימים ברצף'])
  })
})

describe('monthTitle', () => {
  it('names the Gregorian month in Hebrew', () => {
    expect(monthTitle('2026-10-28')).toBe('אוקטובר 2026')
  })
})
