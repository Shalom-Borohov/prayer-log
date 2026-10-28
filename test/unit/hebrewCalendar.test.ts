import { describe, expect, it } from 'vitest'
import { hasMusaf, hebrewDateLabel, hebrewDayNumber, holidayNames, isRestDay } from '../../src/domain/hebrewCalendar'

describe('hebrewDateLabel', () => {
  it('is the gematriya day and the month with ב, without year or niqqud', () => {
    expect(hebrewDateLabel('2026-10-28')).toBe('י״ז בחשון')
    expect(hebrewDateLabel('2026-09-12')).toBe('א׳ בתשרי')
  })

  it('names Adar I and Adar II in a leap year', () => {
    expect(hebrewDateLabel('2027-02-21')).toBe('י״ד באדר א׳')
    expect(hebrewDateLabel('2027-03-23')).toBe('י״ד באדר ב׳')
  })

  it('names plain Adar in a common year', () => {
    expect(hebrewDateLabel('2026-03-03')).toBe('י״ד באדר')
  })
})

describe('hebrewDayNumber', () => {
  it('is just the day in gematriya', () => {
    expect(hebrewDayNumber('2026-09-12')).toBe('א׳')
    expect(hebrewDayNumber('2026-09-26')).toBe('ט״ו')
    expect(hebrewDayNumber('2026-10-28')).toBe('י״ז')
    expect(hebrewDayNumber('2026-12-10')).toBe('ל׳')
  })
})

describe('hasMusaf', () => {
  it('is said on שבת, ראש חודש and חול המועד', () => {
    expect(hasMusaf('2026-10-31')).toBe(true)
    expect(hasMusaf('2026-11-10')).toBe(true)
    expect(hasMusaf('2026-11-11')).toBe(true)
    expect(hasMusaf('2026-09-28')).toBe(true)
    expect(hasMusaf('2026-10-02')).toBe(true)
    expect(hasMusaf('2027-04-26')).toBe(true)
  })

  it('is said on ראש השנה, יום כיפור and the one-day Israeli יום טוב', () => {
    expect(hasMusaf('2026-09-13')).toBe(true)
    expect(hasMusaf('2026-09-21')).toBe(true)
    expect(hasMusaf('2027-04-28')).toBe(true)
    expect(hasMusaf('2028-05-31')).toBe(true)
  })

  it('is not said on days that are יום טוב only outside Israel', () => {
    expect(hasMusaf('2026-10-04')).toBe(false)
    expect(hasMusaf('2027-04-29')).toBe(false)
    expect(hasMusaf('2028-06-01')).toBe(false)
  })

  it('is said on ראש חודש טבת during חנוכה but not on other weekdays of חנוכה', () => {
    expect(hasMusaf('2026-12-07')).toBe(false)
    expect(hasMusaf('2026-12-10')).toBe(true)
  })

  it('is not said on פורים, fast days, ערב חג or an ordinary weekday', () => {
    expect(hasMusaf('2027-03-23')).toBe(false)
    expect(hasMusaf('2026-12-20')).toBe(false)
    expect(hasMusaf('2027-08-12')).toBe(false)
    expect(hasMusaf('2027-04-21')).toBe(false)
    expect(hasMusaf('2026-10-28')).toBe(false)
  })
})

describe('holidayNames', () => {
  it('is empty on an ordinary weekday', () => {
    expect(holidayNames('2026-10-28')).toEqual([])
  })

  it('names both days of ראש חודש', () => {
    expect(holidayNames('2026-11-10')).toEqual(['ראש חודש כסלו'])
    expect(holidayNames('2026-11-11')).toEqual(['ראש חודש כסלו'])
    expect(holidayNames('2027-03-10')).toEqual(['ראש חודש אדר ב׳'])
  })

  it('names יום טוב and חול המועד days, with ראש השנה free of a year number', () => {
    expect(holidayNames('2026-09-12')).toEqual(['ראש השנה א׳'])
    expect(holidayNames('2026-09-13')).toEqual(['ראש השנה ב׳'])
    expect(holidayNames('2026-09-21')).toEqual(['יום כיפור'])
    expect(holidayNames('2026-09-28')).toEqual(['סוכות ג׳ (חוה״מ)'])
  })

  it('names minor holidays, fast days, modern holidays and ערב חג', () => {
    expect(holidayNames('2026-12-10')).toEqual(['חג הבנות', 'ראש חודש טבת', 'חנוכה: ז׳ נרות'])
    expect(holidayNames('2027-03-23')).toEqual(['פורים'])
    expect(holidayNames('2027-05-25')).toEqual(['ל״ג בעומר'])
    expect(holidayNames('2026-12-20')).toEqual(['עשרה בטבת'])
    expect(holidayNames('2027-08-12')).toEqual(['תשעה באב'])
    expect(holidayNames('2027-05-12')).toEqual(['יום העצמאות'])
    expect(holidayNames('2026-09-20')).toEqual(['ערב יום כיפור'])
  })

  it('leaves out special Shabbatot, יום כיפור קטן and בה״ב fasts', () => {
    expect(holidayNames('2027-03-06')).toEqual([])
    expect(holidayNames('2027-01-23')).toEqual(['ט״ו בשבט'])
    expect(holidayNames('2026-11-09')).toEqual([])
    expect(holidayNames('2026-10-19')).toEqual([])
  })

  it('leaves out days observed only outside Israel', () => {
    expect(holidayNames('2026-10-04')).toEqual([])
    expect(holidayNames('2028-06-01')).toEqual([])
  })
})

describe('isRestDay', () => {
  it('is true on שבת and Israeli יום טוב only', () => {
    expect(isRestDay('2026-10-24')).toBe(true)
    expect(isRestDay('2026-09-21')).toBe(true)
    expect(isRestDay('2028-05-31')).toBe(true)
    expect(isRestDay('2028-06-01')).toBe(false)
    expect(isRestDay('2026-10-28')).toBe(false)
    expect(isRestDay('2026-11-11')).toBe(false)
  })
})

describe('holidayNames civil observances', () => {
  it('drops minor civil observances but keeps the national days', () => {
    expect(holidayNames('2026-10-22')).toEqual([])
    expect(holidayNames('2026-10-18')).toEqual([])
    expect(holidayNames('2026-11-16')).toEqual([])
    expect(holidayNames('2027-05-12')).toContain('יום העצמאות')
    expect(holidayNames('2027-05-04')).toContain('יום השואה')
    expect(holidayNames('2026-10-05')).toContain('יום הזיכרון לחללי מלחמת חרבות ברזל')
  })
})
