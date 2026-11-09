import { describe, expect, it } from 'vitest'
import { learningLog, matchesQuery } from '../../src/domain/learningLog'
import { day } from '../helpers/days'
import { gemara, mishna } from '../helpers/learning'

describe('learningLog', () => {
  it('lists days up to today with entries or a note, newest first, leaving out tick-only days', () => {
    const records = [
      day('2026-10-20', { torah: true, learning: [gemara('shabbat', 12)] }),
      day('2026-10-22', { torah: true }),
      day('2026-10-24', { torahNote: 'הלכות שבת' }),
      day('2026-10-26', { torah: true, torahNote: 'פרשת השבוע', learning: [gemara('berakhot', 2)] }),
      day('2026-10-29', { torahNote: 'מחר' }),
    ]

    expect(learningLog(records, '2026-10-28').map((record) => record.date)).toEqual([
      '2026-10-26',
      '2026-10-24',
      '2026-10-20',
    ])
  })
})

describe('matchesQuery', () => {
  const shabbat = day('2026-10-20', { learning: [gemara('shabbat', 12), mishna('berakhot', 2)], torahNote: 'עם חברותא' })

  it.each(['שבת יב', 'גמ', 'ברכות ב', "ברכות ב'", 'פרק ב׳', 'חברו', 'שַׁבָּת', 'י"ב', 'י”ב', 'פרק ב’', '  שבת   דף  '])(
    'finds a day whose words start with every word of "%s"',
    (query) => {
      expect(matchesQuery(shabbat, query)).toBe(true)
    },
  )

  it.each(['שבת יג', 'בת', 'עירובין', '20', '2026-10-20', 'חברותא נוספת'])('does not match "%s"', (query) => {
    expect(matchesQuery(shabbat, query)).toBe(false)
  })

  it.each(['רש"י', 'רש”י', 'קמא', 'בבא־קמא'])('finds a note typed with smart quotes and a maqaf by "%s"', (query) => {
    expect(matchesQuery(day('2026-10-21', { torahNote: 'רש”י על בבא־קמא' }), query)).toBe(true)
  })

  it.each(['', '   '])('matches every day for the empty query "%s"', (query) => {
    expect(matchesQuery(shabbat, query)).toBe(true)
  })
})
