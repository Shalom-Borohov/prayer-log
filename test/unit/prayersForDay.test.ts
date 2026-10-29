import { describe, expect, it } from 'vitest'
import { attendancesFor, prayersForDay, wornItemsForDay } from '../../src/domain/prayersForDay'

describe('prayersForDay', () => {
  it('is שחרית, מנחה, ערבית on an ordinary weekday', () => {
    expect(prayersForDay('2026-10-28')).toEqual(['shacharit', 'mincha', 'maariv'])
  })

  it('adds מוסף after שחרית on a day that has it', () => {
    expect(prayersForDay('2026-10-31')).toEqual(['shacharit', 'musaf', 'mincha', 'maariv'])
    expect(prayersForDay('2026-11-10')).toEqual(['shacharit', 'musaf', 'mincha', 'maariv'])
  })
})

describe('attendancesFor', () => {
  it('offers ק״ש בלבד on the prayers that include קריאת שמע', () => {
    expect(attendancesFor('shacharit')).toEqual(['minyan', 'alone', 'shema'])
    expect(attendancesFor('maariv')).toEqual(['minyan', 'alone', 'shema'])
  })

  it('offers only במניין and ביחידות on מנחה and מוסף', () => {
    expect(attendancesFor('mincha')).toEqual(['minyan', 'alone'])
    expect(attendancesFor('musaf')).toEqual(['minyan', 'alone'])
  })
})

describe('wornItemsForDay', () => {
  it('is תפילין and טלית on a weekday', () => {
    expect(wornItemsForDay('2026-10-28')).toEqual(['tefillin', 'tallit'])
  })

  it('is only טלית on שבת and חול המועד', () => {
    expect(wornItemsForDay('2026-10-24')).toEqual(['tallit'])
    expect(wornItemsForDay('2026-09-28')).toEqual(['tallit'])
  })
})
