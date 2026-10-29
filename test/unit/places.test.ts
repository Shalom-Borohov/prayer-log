import { describe, expect, it } from 'vitest'
import { defaultPlace, knownPlaces } from '../../src/domain/places'
import { day } from '../helpers/days'

const records = [
  day('2026-10-26', {
    prayers: { mincha: 'minyan', maariv: 'minyan' },
    places: { mincha: 'אוהל משה', maariv: 'הגר"א' },
  }),
  day('2026-10-20', {
    prayers: { shacharit: 'minyan', mincha: 'minyan' },
    places: { shacharit: 'בית יוסף', mincha: 'הגר"א' },
  }),
  day('2026-10-27', { prayers: { shacharit: 'minyan', mincha: 'alone' }, places: { shacharit: 'אוהל משה' } }),
]

describe('places', () => {
  it('lists each place once, most recently used first', () => {
    expect(knownPlaces(records)).toEqual(['אוהל משה', 'הגר"א', 'בית יוסף'])
  })

  it('lists a day’s later prayer first', () => {
    const oneDay = day('2026-10-28', {
      prayers: { shacharit: 'minyan', maariv: 'minyan' },
      places: { shacharit: 'בית יוסף', maariv: 'הגר"א' },
    })

    expect(knownPlaces([oneDay])).toEqual(['הגר"א', 'בית יוסף'])
  })

  it('knows no places before any is recorded', () => {
    expect(knownPlaces([day('2026-10-27', { prayers: { shacharit: 'minyan' } })])).toEqual([])
  })

  it('defaults each prayer to its own latest place', () => {
    expect(defaultPlace(records, 'shacharit')).toBe('אוהל משה')
    expect(defaultPlace(records, 'mincha')).toBe('אוהל משה')
    expect(defaultPlace(records, 'maariv')).toBe('הגר"א')
  })

  it('has no default for a prayer never prayed at a place', () => {
    expect(defaultPlace(records, 'musaf')).toBeUndefined()
  })
})
