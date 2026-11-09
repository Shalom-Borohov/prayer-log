import { describe, expect, it } from 'vitest'
import { learningLabel } from '../../src/domain/learning'
import { gemara, mishna } from '../helpers/learning'

describe('learning entries', () => {
  it.each([
    [gemara('shabbat', 12), 'גמרא · שבת דף י״ב'],
    [gemara('berakhot', 2), 'גמרא · ברכות דף ב׳'],
    [gemara('pesachim', 15), 'גמרא · פסחים דף ט״ו'],
    [gemara('bavaBatra', 176), 'גמרא · בבא בתרא דף קע״ו'],
    [mishna('berakhot', 2), 'משנה · ברכות פרק ב׳'],
    [mishna('kelim', 16), 'משנה · כלים פרק ט״ז'],
  ])('labels %o as %s', (entry, label) => {
    expect(learningLabel(entry)).toBe(label)
  })
})
