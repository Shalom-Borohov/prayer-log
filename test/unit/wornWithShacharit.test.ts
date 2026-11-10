import { beforeEach, describe, expect, it } from 'vitest'
import { allDays, setPrayer, setWorn } from '../../src/data/repo'
import { resetDb } from '../helpers/db'

const WEDNESDAY = '2026-10-28'
const SHABBAT = '2026-10-24'
const TISHA_BAV = '2027-08-12'
const POSTPONED_TISHA_BAV = '2029-07-22'

describe('תפילין and טלית follow שחרית', () => {
  beforeEach(resetDb)

  it.each(['minyan', 'alone', 'shema'] as const)('a first %s שחרית checks both on a weekday', async (attendance) => {
    await setPrayer(WEDNESDAY, 'shacharit', attendance)

    expect(await allDays()).toStrictEqual([
      { date: WEDNESDAY, prayers: { shacharit: attendance }, torah: false, tefillin: true, tallit: true },
    ])
  })

  it('checks only טלית on שבת', async () => {
    await setPrayer(SHABBAT, 'shacharit', 'minyan')

    expect(await allDays()).toStrictEqual([
      { date: SHABBAT, prayers: { shacharit: 'minyan' }, torah: false, tallit: true },
    ])
  })

  it('leaves the checks alone when switching between states', async () => {
    await setPrayer(WEDNESDAY, 'shacharit', 'alone')
    await setWorn(WEDNESDAY, 'tallit', false)
    await setPrayer(WEDNESDAY, 'shacharit', 'minyan')

    expect(await allDays()).toStrictEqual([
      { date: WEDNESDAY, prayers: { shacharit: 'minyan' }, torah: false, tefillin: true },
    ])
  })

  it('clears both when שחרית is cleared, and the day with them', async () => {
    await setPrayer(WEDNESDAY, 'shacharit', 'minyan')
    await setPrayer(WEDNESDAY, 'shacharit', null)

    expect(await allDays()).toStrictEqual([])
  })

  it.each([TISHA_BAV, POSTPONED_TISHA_BAV])('checks nothing on ט׳ באב (%s)', async (date) => {
    await setPrayer(date, 'shacharit', 'alone')

    expect(await allDays()).toStrictEqual([{ date, prayers: { shacharit: 'alone' }, torah: false }])
  })

  it('keeps the checks from מנחה when שחרית is cleared on ט׳ באב', async () => {
    await setPrayer(TISHA_BAV, 'shacharit', 'alone')
    await setWorn(TISHA_BAV, 'tefillin', true)
    await setWorn(TISHA_BAV, 'tallit', true)
    await setPrayer(TISHA_BAV, 'shacharit', null)

    expect(await allDays()).toStrictEqual([
      { date: TISHA_BAV, prayers: {}, torah: false, tefillin: true, tallit: true },
    ])
  })

  it('leaves the checks alone when another prayer is marked or cleared', async () => {
    await setPrayer(WEDNESDAY, 'mincha', 'minyan')
    await setWorn(WEDNESDAY, 'tallit', true)
    await setPrayer(WEDNESDAY, 'mincha', null)

    expect(await allDays()).toStrictEqual([{ date: WEDNESDAY, prayers: {}, torah: false, tallit: true }])
  })
})
