import { describe, expect, it } from 'vitest'
import { reminderNotification } from '../../src/sw/notification'
import { day } from '../helpers/days'

describe('reminderNotification', () => {
  it('names every prayer of the day when nothing is logged', () => {
    expect(reminderNotification(undefined, '2026-10-28')).toEqual({
      title: 'תפילות',
      body: 'עוד לא נרשמו: שחרית, מנחה, ערבית',
    })
  })

  it('names the one prayer still missing', () => {
    const tuesday = day('2026-10-28', { prayers: { shacharit: 'minyan', mincha: 'shema' } })

    expect(reminderNotification(tuesday, '2026-10-28')).toEqual({ title: 'תפילות', body: 'עוד לא נרשמה: ערבית' })
  })

  it('names מוסף on a day that has it', () => {
    const shabbat = day('2026-10-31', { prayers: { shacharit: 'minyan', mincha: 'minyan', maariv: 'alone' } })

    expect(reminderNotification(shabbat, '2026-10-31').body).toBe('עוד לא נרשמה: מוסף')
  })

  it('says the day is logged when nothing is missing', () => {
    const tuesday = day('2026-10-28', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' } })

    expect(reminderNotification(tuesday, '2026-10-28')).toEqual({
      title: 'תפילות',
      body: 'כל התפילות של היום נרשמו',
    })
  })
})
