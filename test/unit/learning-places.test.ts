import { describe, expect, it } from 'vitest'
import { learningHints, startingEntry, withPlaceInRange } from '../../src/domain/learningPlaces'
import { day } from '../helpers/days'
import { gemara, mishna } from '../helpers/learning'

describe('learningHints', () => {
  it('offers the entries of the latest earlier day that has entries', () => {
    const records = [
      day('2026-11-01', { learning: [gemara('berakhot', 5)] }),
      day('2026-11-03', { learning: [gemara('shabbat', 12), mishna('peah', 2)] }),
      day('2026-11-04', { torah: true }),
    ]

    expect(learningHints(records, '2026-11-05')).toEqual([gemara('shabbat', 12), mishna('peah', 2)])
  })

  it('ignores the day itself and later days', () => {
    const records = [
      day('2026-11-01', { learning: [gemara('berakhot', 5)] }),
      day('2026-11-03', { learning: [gemara('shabbat', 12)] }),
      day('2026-11-04', { learning: [mishna('avot', 3)] }),
    ]

    expect(learningHints(records, '2026-11-02')).toEqual([gemara('berakhot', 5)])
    expect(learningHints(records, '2026-11-01')).toEqual([])
  })

  it('hides a hint once its kind and tractate are logged on the day', () => {
    const records = [
      day('2026-11-03', { learning: [gemara('shabbat', 12), mishna('shabbat', 2), gemara('berakhot', 7)] }),
      day('2026-11-04', { learning: [gemara('shabbat', 13)] }),
    ]

    expect(learningHints(records, '2026-11-04')).toEqual([mishna('shabbat', 2), gemara('berakhot', 7)])
  })
})

describe('startingEntry', () => {
  const records = [
    day('2026-11-01', { learning: [mishna('avot', 2), gemara('berakhot', 5)] }),
    day('2026-11-03', { learning: [gemara('shabbat', 12), gemara('eruvin', 7)] }),
    day('2026-11-05', { learning: [gemara('yoma', 3), mishna('peah', 4)] }),
  ]

  it('starts on the entry last added on or before the day', () => {
    const mishnaLast = [day('2026-11-01', { learning: [gemara('berakhot', 5), mishna('avot', 2)] })]

    expect(startingEntry(mishnaLast, '2026-11-02')).toEqual(mishna('avot', 2))
    expect(startingEntry(records, '2026-11-03')).toEqual(gemara('eruvin', 7))
    expect(startingEntry(records, '2026-11-04')).toEqual(gemara('eruvin', 7))
  })

  it('starts each kind on its latest place on or before the day', () => {
    expect(startingEntry(records, '2026-11-03', 'gemara')).toEqual(gemara('eruvin', 7))
    expect(startingEntry(records, '2026-11-04', 'mishna')).toEqual(mishna('avot', 2))
  })

  it('starts on גמרא, ברכות דף ב when nothing was logged by then', () => {
    expect(startingEntry(records, '2026-10-30')).toEqual(gemara('berakhot', 2))
    expect(startingEntry([], '2026-11-04', 'gemara')).toEqual(gemara('berakhot', 2))
    expect(startingEntry(records, '2026-10-30', 'mishna')).toEqual(mishna('berakhot', 1))
  })

  it('starts a stored place past the end of its tractate on that end', () => {
    expect(startingEntry([day('2026-11-01', { learning: [gemara('makkot', 40)] })], '2026-11-02')).toEqual(
      gemara('makkot', 24),
    )
  })
})

describe('withPlaceInRange', () => {
  it('moves a place past either end of the tractate onto that end', () => {
    expect(withPlaceInRange(gemara('makkot', 40))).toEqual(gemara('makkot', 24))
    expect(withPlaceInRange(gemara('tamid', 3))).toEqual(gemara('tamid', 26))
    expect(withPlaceInRange(mishna('avot', 9))).toEqual(mishna('avot', 6))
    expect(withPlaceInRange(mishna('avot', 4))).toEqual(mishna('avot', 4))
  })
})
