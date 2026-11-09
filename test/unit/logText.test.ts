import { describe, expect, it } from 'vitest'
import { logText } from '../../src/domain/logText'
import { day, days } from '../helpers/days'
import { gemara, mishna } from '../helpers/learning'

const fullFriday = day('2026-11-06', {
  prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' },
  places: { shacharit: 'היכל שלמה' },
  tefillin: true,
  tallit: true,
  torah: true,
  torahNote: 'ברכות ה׳ ע״א',
})

describe('logText', () => {
  it('is empty when nothing was marked', () => {
    expect(logText([])).toBe('')
  })

  it('writes a day as its dates, its marks and what was learned', () => {
    expect(logText([fullFriday])).toBe(
      [
        'יום שישי · כ״ו בחשון · 6.11.2026',
        'שחרית במניין (היכל שלמה), מנחה ביחידות, ערבית ק״ש בלבד, תפילין, טלית, למדתי תורה',
        'הערה: ברכות ה׳ ע״א',
      ].join('\n'),
    )
  })

  it('leaves out the marks line on a day with only a note', () => {
    expect(logText([day('2026-11-05', { torahNote: 'דף יומי' })])).toBe(
      'יום חמישי · כ״ה בחשון · 5.11.2026\nהערה: דף יומי',
    )
  })

  it('writes each learning entry on its own line, before the note', () => {
    const learned = day('2026-11-05', {
      torah: true,
      learning: [gemara('shabbat', 12), mishna('berakhot', 2)],
      torahNote: 'עם חברותא',
    })

    expect(logText([learned])).toBe(
      [
        'יום חמישי · כ״ה בחשון · 5.11.2026',
        'למדתי תורה',
        'גמרא · שבת דף י״ב',
        'משנה · ברכות פרק ב׳',
        'הערה: עם חברותא',
      ].join('\n'),
    )
  })

  it('writes מוסף on שבת and leaves out תפילין stored on it', () => {
    const shabbat = day('2026-11-07', { prayers: { shacharit: 'minyan', musaf: 'minyan' }, tefillin: true, tallit: true })

    expect(logText([shabbat])).toBe('שבת · כ״ז בחשון · 7.11.2026\nשחרית במניין, מוסף במניין, טלית')
  })

  it('keeps the date line of a stored day whose only mark does not apply that day', () => {
    expect(logText([day('2026-11-07', { tefillin: true })])).toBe('שבת · כ״ז בחשון · 7.11.2026')
  })

  it('leaves out מוסף stored on a weekday', () => {
    const weekday = day('2026-11-05', { prayers: { shacharit: 'alone', musaf: 'alone' } })

    expect(logText([weekday])).toBe('יום חמישי · כ״ה בחשון · 5.11.2026\nשחרית ביחידות')
  })

  it('puts the newest day first, with a blank line between days', () => {
    expect(logText(days('2026-11-04', '2026-11-05', { torah: true }))).toBe(
      'יום חמישי · כ״ה בחשון · 5.11.2026\nלמדתי תורה\n\nיום רביעי · כ״ד בחשון · 4.11.2026\nלמדתי תורה',
    )
  })

  it('leaves out the note line on a day with no note', () => {
    expect(logText([day('2026-11-05', { torah: true })])).toBe('יום חמישי · כ״ה בחשון · 5.11.2026\nלמדתי תורה')
  })
})
