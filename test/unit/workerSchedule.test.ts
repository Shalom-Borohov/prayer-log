import { describe, expect, it } from 'vitest'
import { reminderDue } from '../../worker/src/schedule'
import type { StoredReminder } from '../../worker/src/store'

const reminder = (overrides: Partial<StoredReminder> = {}): StoredReminder => ({
  subscription: { endpoint: 'https://web.push.apple.com/abc', keys: { p256dh: 'key', auth: 'secret' } },
  time: '22:00',
  timeZone: 'Asia/Jerusalem',
  completeDate: null,
  skipNights: [],
  lastSentDate: null,
  ...overrides,
})

describe('reminderDue', () => {
  it('is due at the picked time in the record’s time zone', () => {
    expect(reminderDue(reminder(), Date.UTC(2026, 10, 18, 20, 0))).toBe('2026-11-18')
  })

  it('reads the clock in the record’s time zone, not UTC', () => {
    expect(reminderDue(reminder({ timeZone: 'UTC' }), Date.UTC(2026, 10, 18, 20, 0))).toBeNull()
    expect(reminderDue(reminder({ timeZone: 'UTC' }), Date.UTC(2026, 10, 18, 22, 0))).toBe('2026-11-18')
  })

  it('stays due for the hour after the picked time, and not before or after it', () => {
    expect(reminderDue(reminder(), Date.UTC(2026, 10, 18, 19, 45))).toBeNull()
    expect(reminderDue(reminder(), Date.UTC(2026, 10, 18, 20, 59))).toBe('2026-11-18')
    expect(reminderDue(reminder(), Date.UTC(2026, 10, 18, 21, 0))).toBeNull()
  })

  it('counts a time after midnight for the previous date', () => {
    const afterMidnight = reminder({ time: '00:30' })

    expect(reminderDue(afterMidnight, Date.UTC(2026, 10, 18, 22, 30))).toBe('2026-11-18')
    expect(reminderDue(afterMidnight, Date.UTC(2026, 10, 18, 10, 30))).toBeNull()
  })

  it('stays due across midnight for a late evening time', () => {
    expect(reminderDue(reminder({ time: '23:30' }), Date.UTC(2026, 10, 18, 22, 15))).toBe('2026-11-18')
  })

  it('skips a night whose day is already complete', () => {
    expect(reminderDue(reminder({ completeDate: '2026-11-18' }), Date.UTC(2026, 10, 18, 20, 0))).toBeNull()
    expect(reminderDue(reminder({ completeDate: '2026-11-17' }), Date.UTC(2026, 10, 18, 20, 0))).toBe('2026-11-18')
  })

  it('skips a night it already reminded for', () => {
    expect(reminderDue(reminder({ lastSentDate: '2026-11-18' }), Date.UTC(2026, 10, 18, 20, 15))).toBeNull()
    expect(reminderDue(reminder({ lastSentDate: '2026-11-17' }), Date.UTC(2026, 10, 18, 20, 15))).toBe('2026-11-18')
  })

  it('skips a night listed in skipNights', () => {
    const fridayNight = reminder({ skipNights: ['2026-11-13', '2026-11-20'] })

    expect(reminderDue(fridayNight, Date.UTC(2026, 10, 20, 20, 0))).toBeNull()
    expect(reminderDue(fridayNight, Date.UTC(2026, 10, 19, 20, 0))).toBe('2026-11-19')
  })

  it('is never due for an unknown time zone', () => {
    expect(reminderDue(reminder({ timeZone: 'Mars/Olympus' }), Date.UTC(2026, 10, 18, 20, 0))).toBeNull()
  })
})
