import { describe, expect, it } from 'vitest'
import { prayersForDay } from '../../src/domain/prayersForDay'

describe('prayersForDay', () => {
  it('is שחרית, מנחה, ערבית on an ordinary weekday', () => {
    expect(prayersForDay('2026-10-28')).toEqual(['shacharit', 'mincha', 'maariv'])
  })

  it('adds מוסף after שחרית on a day that has it', () => {
    expect(prayersForDay('2026-10-31')).toEqual(['shacharit', 'musaf', 'mincha', 'maariv'])
    expect(prayersForDay('2026-11-10')).toEqual(['shacharit', 'musaf', 'mincha', 'maariv'])
  })
})
