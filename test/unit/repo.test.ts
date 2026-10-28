import { beforeEach, describe, expect, it } from 'vitest'
import { allDays, setPrayer, setTorah, setTorahNote } from '../../src/data/repo'
import { resetDb } from '../helpers/db'

describe('repo', () => {
  beforeEach(resetDb)

  it('marking a prayer creates the day', async () => {
    await setPrayer('2026-10-28', 'shacharit', 'minyan')

    expect(await allDays()).toEqual([{ date: '2026-10-28', prayers: { shacharit: 'minyan' }, torah: false }])
  })

  it('clearing a prayer keeps the other marks', async () => {
    await setPrayer('2026-10-28', 'shacharit', 'minyan')
    await setPrayer('2026-10-28', 'mincha', 'alone')
    await setPrayer('2026-10-28', 'shacharit', null)

    expect(await allDays()).toStrictEqual([{ date: '2026-10-28', prayers: { mincha: 'alone' }, torah: false }])
  })

  it('clearing the last prayer removes the day', async () => {
    await setPrayer('2026-10-28', 'maariv', 'alone')
    await setPrayer('2026-10-28', 'maariv', null)

    expect(await allDays()).toEqual([])
  })

  it('learning Torah alone creates the day', async () => {
    await setTorah('2026-10-28', true)

    expect(await allDays()).toEqual([{ date: '2026-10-28', prayers: {}, torah: true }])
  })

  it('Torah and prayers are kept together on the same day', async () => {
    await setPrayer('2026-10-28', 'shacharit', 'minyan')
    await setTorah('2026-10-28', true)
    await setPrayer('2026-10-28', 'mincha', 'alone')

    expect(await allDays()).toEqual([
      { date: '2026-10-28', prayers: { shacharit: 'minyan', mincha: 'alone' }, torah: true },
    ])

    await setPrayer('2026-10-28', 'shacharit', null)
    await setPrayer('2026-10-28', 'mincha', null)

    expect(await allDays()).toEqual([{ date: '2026-10-28', prayers: {}, torah: true }])

    await setPrayer('2026-10-28', 'maariv', 'minyan')
    await setTorah('2026-10-28', false)

    expect(await allDays()).toEqual([{ date: '2026-10-28', prayers: { maariv: 'minyan' }, torah: false }])
  })

  it('unmarking Torah on a day with nothing else removes the day', async () => {
    await setTorah('2026-10-28', true)
    await setTorah('2026-10-28', false)

    expect(await allDays()).toEqual([])
  })

  it('stores the Torah note trimmed', async () => {
    await setTorah('2026-10-28', true)
    await setTorahNote('2026-10-28', '  דף יומי ברכות ה  ')

    expect(await allDays()).toEqual([
      { date: '2026-10-28', prayers: {}, torah: true, torahNote: 'דף יומי ברכות ה' },
    ])
  })

  it('a blank Torah note removes the note', async () => {
    await setTorah('2026-10-28', true)
    await setTorahNote('2026-10-28', 'משנה ברורה')
    await setTorahNote('2026-10-28', '   ')

    expect(await allDays()).toStrictEqual([{ date: '2026-10-28', prayers: {}, torah: true }])
  })

  it('a Torah note alone keeps the day until it is cleared', async () => {
    await setTorahNote('2026-10-28', 'פרשת השבוע')

    expect(await allDays()).toEqual([
      { date: '2026-10-28', prayers: {}, torah: false, torahNote: 'פרשת השבוע' },
    ])

    await setTorahNote('2026-10-28', '')

    expect(await allDays()).toEqual([])
  })

  it('lists days oldest first', async () => {
    await setPrayer('2026-10-28', 'shacharit', 'minyan')
    await setTorah('2025-12-31', true)
    await setPrayer('2026-01-05', 'maariv', 'alone')

    const dates = (await allDays()).map((day) => day.date)

    expect(dates).toEqual(['2025-12-31', '2026-01-05', '2026-10-28'])
  })

  it('clearing a prayer on an empty day stores nothing', async () => {
    await setPrayer('2026-10-28', 'musaf', null)

    expect(await allDays()).toEqual([])
  })
})
