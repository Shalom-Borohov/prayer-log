import { describe, expect, it } from 'vitest'
import { shelfSlots } from '../../src/domain/shelf'
import { day } from '../helpers/days'

describe('shelfSlots', () => {
  const records = [
    day('2026-10-22', { prayers: { shacharit: 'minyan' } }),
    day('2026-10-24', { prayers: { shacharit: 'alone' }, torah: true }),
    day('2026-10-25', { prayers: { mincha: 'minyan' } }),
  ]

  it('marks the days ending at the given date, oldest first', () => {
    expect(shelfSlots(records, 'shacharit', '2026-10-26', 7)).toEqual([
      'none',
      'none',
      'gold',
      'empty',
      'plain',
      'empty',
      'empty',
    ])
  })

  it('shelves a ק״ש בלבד day as a short spine', () => {
    const shemaDays = [day('2026-10-26', { prayers: { maariv: 'shema' } }), day('2026-10-27', { prayers: { maariv: 'alone' } })]

    expect(shelfSlots(shemaDays, 'maariv', '2026-10-27', 2)).toEqual(['short', 'plain'])
  })

  it('stamps Torah days gold', () => {
    expect(shelfSlots(records, 'torah', '2026-10-25', 3)).toEqual(['empty', 'gold', 'empty'])
  })
})
