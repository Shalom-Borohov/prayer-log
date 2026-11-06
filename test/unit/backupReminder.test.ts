import { describe, expect, it } from 'vitest'
import { backupReminder } from '../../src/domain/backupReminder'
import { day } from '../helpers/days'

const records = [day('2026-10-28', { torah: true }), day('2026-10-30', { torah: true })]

const at = (dayOfMonth: number, hour = 9) => new Date(2026, 10, dayOfMonth, hour).getTime()

describe('backupReminder', () => {
  it('stays quiet on an empty app, even with an old backup', () => {
    expect(backupReminder([], null, '2026-11-20')).toBeNull()
    expect(backupReminder([], at(1), '2026-11-20')).toBeNull()
  })

  it('counts from the first record when there was never a backup', () => {
    expect(backupReminder(records, null, '2026-11-03')).toBeNull()
    expect(backupReminder(records, null, '2026-11-04')).toEqual({ kind: 'never' })
  })

  it('appears seven days after the last backup, not six', () => {
    expect(backupReminder(records, at(1), '2026-11-07')).toBeNull()
    expect(backupReminder(records, at(1), '2026-11-08')).toEqual({ kind: 'stale', days: 7 })
  })

  it('reports how many days have passed since the last backup', () => {
    expect(backupReminder(records, at(1), '2026-11-13')).toEqual({ kind: 'stale', days: 12 })
  })

  it('counts a backup before the 03:00 rollover as the previous day', () => {
    expect(backupReminder(records, at(2, 0), '2026-11-08')).toEqual({ kind: 'stale', days: 7 })
    expect(backupReminder(records, at(2, 3), '2026-11-08')).toBeNull()
  })

  it('counts across a daylight saving change', () => {
    expect(backupReminder(records, new Date(2026, 9, 20, 9).getTime(), '2026-10-27')).toEqual({ kind: 'stale', days: 7 })
  })
})
