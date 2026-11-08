import { describe, expect, it } from 'vitest'
import { importComparison, summarizeDates } from '../../src/domain/restorePreview'
import { asRead, NO_BREAK_SPACE } from '../helpers/text'

const olderFile = summarizeDates(['2026-10-30', '2026-11-03', '2026-11-01'])

const newerPhone = summarizeDates(['2026-11-01', '2026-11-08', '2026-11-02', '2026-11-05'])

const empty = summarizeDates([])

const comparedAsRead = (file: typeof empty, phone: typeof empty) => importComparison({ file, phone }).map(asRead)

describe('comparing a backup with the phone', () => {
  it('shows how many days each side has and its newest day', () => {
    expect(comparedAsRead(newerPhone, olderFile)).toEqual(['בקובץ: 4 ימים, עד 8.11.2026', 'בטלפון: 3 ימים, עד 3.11.2026'])
  })

  it('says so when the phone has days after the newest day in the file', () => {
    expect(comparedAsRead(olderFile, newerPhone)).toEqual([
      'בקובץ: 3 ימים, עד 3.11.2026',
      'בטלפון: 4 ימים, עד 8.11.2026',
      'בטלפון יש ימים אחרי 3.11.2026.',
    ])
  })

  it('says when a side has no data', () => {
    expect(comparedAsRead(olderFile, empty)).toEqual(['בקובץ: 3 ימים, עד 3.11.2026', 'בטלפון: אין נתונים'])
    expect(comparedAsRead(empty, newerPhone)).toEqual(['בקובץ: אין נתונים', 'בטלפון: 4 ימים, עד 8.11.2026'])
  })

  it('names a single day', () => {
    expect(comparedAsRead(summarizeDates(['2026-11-03']), empty)[0]).toBe('בקובץ: יום אחד, 3.11.2026')
  })

  it('keeps each count and each date with its word, so a long line breaks only at the comma', () => {
    const together = (...words: string[]) => words.join(NO_BREAK_SPACE)

    expect(importComparison({ file: olderFile, phone: newerPhone })).toEqual([
      `בקובץ: ${together('3', 'ימים')}, ${together('עד', '3.11.2026')}`,
      `בטלפון: ${together('4', 'ימים')}, ${together('עד', '8.11.2026')}`,
      `בטלפון יש ימים ${together('אחרי', '3.11.2026.')}`,
    ])
    expect(importComparison({ file: summarizeDates(['2026-11-03']), phone: empty })[0]).toBe(
      `בקובץ: ${together('יום', 'אחד')}, 3.11.2026`,
    )
  })
})
