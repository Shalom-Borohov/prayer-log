import { describe, expect, it } from 'vitest'
import { streaks } from '../../src/domain/streaks'
import { allMinyan, day, days } from '../helpers/days'

const today = '2026-10-28'

describe('streaks', () => {
  it('is all zeros with no records', () => {
    expect(streaks([], today)).toEqual({
      shacharit: { current: 0, best: 0 },
      mincha: { current: 0, best: 0 },
      maariv: { current: 0, best: 0 },
      torah: { current: 0, best: 0 },
    })
  })

  it('counts consecutive במניין days ending today', () => {
    const records = days('2026-10-26', today, { prayers: allMinyan })

    expect(streaks(records, today).shacharit).toEqual({ current: 3, best: 3 })
  })

  it('continues through a still-blank today', () => {
    const records = [...days('2026-10-25', '2026-10-27', { prayers: allMinyan }), day(today)]

    expect(streaks(records, today).mincha).toEqual({ current: 3, best: 3 })
    expect(streaks(records.slice(0, 3), today).mincha).toEqual({ current: 3, best: 3 })
  })

  it('does not break on a today marked ביחידות before the day ends', () => {
    const records = [...days('2026-10-26', '2026-10-27', { prayers: allMinyan }), day(today, { prayers: { shacharit: 'alone' } })]

    expect(streaks(records, today).shacharit).toEqual({ current: 2, best: 2 })
  })

  it('is broken by a ק״ש בלבד day', () => {
    const records = [
      ...days('2026-10-23', '2026-10-24', { prayers: allMinyan }),
      day('2026-10-25', { prayers: { ...allMinyan, shacharit: 'shema' } }),
      ...days('2026-10-26', '2026-10-27', { prayers: allMinyan }),
    ]

    expect(streaks(records, '2026-10-27', today).shacharit).toEqual({ current: 2, best: 2 })
    expect(streaks(records, '2026-10-27', today).maariv).toEqual({ current: 5, best: 5 })
  })

  it('is broken by a blank past day once that day has ended', () => {
    const records = days('2026-10-24', '2026-10-26', { prayers: allMinyan })

    expect(streaks(records, '2026-10-27', today).shacharit).toEqual({ current: 0, best: 3 })
  })

  it('is broken by a missed day before yesterday', () => {
    const records = days('2026-10-25', '2026-10-26', { prayers: allMinyan })

    expect(streaks(records, today).maariv).toEqual({ current: 0, best: 2 })
  })

  it('is broken by ביחידות, per prayer', () => {
    const records = [
      ...days('2026-10-23', '2026-10-25', { prayers: allMinyan }),
      day('2026-10-26', { prayers: { ...allMinyan, shacharit: 'alone' } }),
      day('2026-10-27', { prayers: allMinyan }),
    ]

    const result = streaks(records, today)

    expect(result.shacharit).toEqual({ current: 1, best: 3 })
    expect(result.mincha).toEqual({ current: 5, best: 5 })
  })

  it('keeps the best run from earlier when the current run is shorter', () => {
    const records = [...days('2026-10-01', '2026-10-05', { prayers: allMinyan }), ...days('2026-10-27', today, { prayers: allMinyan })]

    expect(streaks(records, today).shacharit).toEqual({ current: 2, best: 5 })
  })

  it('is not affected by a missing or ביחידות מוסף', () => {
    const records = [
      day('2026-10-23', { prayers: allMinyan }),
      day('2026-10-24', { prayers: { ...allMinyan, musaf: 'alone' } }),
      day('2026-10-31', { prayers: allMinyan }),
      day('2026-10-25', { prayers: allMinyan }),
    ]

    const result = streaks(records, '2026-10-25')

    expect(result.shacharit).toEqual({ current: 3, best: 3 })
    expect(result).not.toHaveProperty('musaf')
  })

  it('counts consecutive days with Torah learning', () => {
    const records = [
      day('2026-10-24', { torah: true }),
      day('2026-10-25', { torah: false, torahNote: 'דף יומי' }),
      ...days('2026-10-26', '2026-10-27', { torah: true }),
    ]

    expect(streaks(records, today).torah).toEqual({ current: 2, best: 2 })
    expect(streaks(records, today).shacharit).toEqual({ current: 0, best: 0 })
  })
})
