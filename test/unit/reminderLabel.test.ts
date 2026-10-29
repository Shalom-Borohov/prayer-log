import { describe, expect, it } from 'vitest'
import { reminderLabel } from '../../src/pages/today/reminderLabel'

describe('reminderLabel', () => {
  it('agrees in gender with an empty day', () => {
    expect(reminderLabel({ date: '2026-10-24', kind: 'empty' })).toBe('שבת 24.10 לא מולאה')
    expect(reminderLabel({ date: '2026-10-27', kind: 'empty' })).toBe('יום שלישי 27.10 לא מולא')
  })

  it('names the eve whose ערבית is blank', () => {
    expect(reminderLabel({ date: '2026-10-23', kind: 'eveMaariv' })).toBe('ערבית של יום שישי 23.10 לא סומנה')
  })
})
