import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { restoreFromBackup, swapLastRestore } from '../../src/backup/backupFile'
import { readLastBackup, saveLastBackup } from '../../src/backup/lastBackup'
import type { Backup } from '../../src/data/backup'
import { db } from '../../src/data/db'
import { allDays } from '../../src/data/repo'
import { resetDb } from '../helpers/db'
import { day, days } from '../helpers/days'

const phoneDays = days('2026-11-01', '2026-11-08', { torah: true })

const fileDays = days('2026-10-20', '2026-10-30', { prayers: { shacharit: 'minyan' } })

const PHONE_BACKUP_AT = new Date(2026, 10, 7, 20).getTime()

const FILE_EXPORTED_AT = new Date(2026, 9, 30, 21).getTime()

const olderFile: Backup = { version: 1, exportedAt: FILE_EXPORTED_AT, days: fileDays }

const damaged = JSON.parse('{"date":"2026-11-02","torah":false}')

describe('undoing an import', () => {
  beforeEach(async () => {
    await resetDb()
    await db.days.bulkPut(phoneDays)
    saveLastBackup(PHONE_BACKUP_AT)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('brings back the days and the backup time the import replaced', async () => {
    await restoreFromBackup(olderFile)
    await swapLastRestore()

    expect(await allDays()).toEqual(phoneDays)
    expect(readLastBackup()).toBe(PHONE_BACKUP_AT)
  })

  it('keeps days logged after the newest day the import brought', async () => {
    const loggedAfterImport = [day('2026-10-31', { torah: true }), ...days('2026-11-09', '2026-11-10', { torah: true })]

    await restoreFromBackup(olderFile)
    await db.days.bulkPut([day('2026-10-29', { tefillin: true }), ...loggedAfterImport])
    await swapLastRestore()

    expect(await allDays()).toEqual([loggedAfterImport[0], ...phoneDays, ...loggedAfterImport.slice(1)])
  })

  it('merges marks added after the import into a day the replaced data already had', async () => {
    await db.days.put(
      day('2026-11-08', { prayers: { shacharit: 'minyan' }, places: { shacharit: 'בית כנסת' }, torahNote: 'דף יומי' }),
    )
    await restoreFromBackup(olderFile)
    await db.days.put(
      day('2026-11-08', { prayers: { shacharit: 'alone', mincha: 'minyan' }, places: { mincha: 'עבודה' }, tallit: true }),
    )
    await swapLastRestore()

    expect(await db.days.get('2026-11-08')).toEqual(
      day('2026-11-08', {
        prayers: { shacharit: 'alone', mincha: 'minyan' },
        places: { mincha: 'עבודה' },
        torahNote: 'דף יומי',
        tallit: true,
      }),
    )
  })

  it('brings back days up to the newest day the import brought exactly as they were', async () => {
    await restoreFromBackup(olderFile)
    await db.days.put(day('2026-10-25', { tefillin: true }))
    await swapLastRestore()

    expect(await allDays()).toEqual(phoneDays)
  })

  it('brings the import back when undone again', async () => {
    const loggedAfterImport = day('2026-11-09', { torah: true })

    await restoreFromBackup(olderFile)
    await db.days.put(loggedAfterImport)
    await swapLastRestore()
    await swapLastRestore()

    expect(await allDays()).toEqual([...fileDays, loggedAfterImport])
    expect(readLastBackup()).toBe(FILE_EXPORTED_AT)
  })

  it('keeps a day logged after an undo when it is newer than the days the undo brought back', async () => {
    const loggedAfterImport = day('2026-11-10', { torah: true })

    const loggedAfterUndo = day('2026-11-09', { tefillin: true })

    await restoreFromBackup(olderFile)
    await db.days.put(loggedAfterImport)
    await swapLastRestore()
    await db.days.put(loggedAfterUndo)
    await swapLastRestore()

    expect(await allDays()).toEqual([...fileDays, loggedAfterUndo, loggedAfterImport])
  })

  it('imports when the backup time cannot be read', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('storage blocked')
    })

    await restoreFromBackup(olderFile)

    expect(await allDays()).toEqual(fileDays)
  })

  it('brings back a damaged record exactly as it was', async () => {
    await db.days.put(damaged)
    await restoreFromBackup(olderFile)
    await swapLastRestore()

    expect(await db.days.get('2026-11-02')).toEqual(damaged)
  })

  it('clears the backup time when there was none before the import', async () => {
    localStorage.clear()
    await restoreFromBackup(olderFile)
    await swapLastRestore()

    expect(readLastBackup()).toBeNull()
  })

  it('keeps no copy when the import replaced nothing', async () => {
    await restoreFromBackup(olderFile)
    await db.days.clear()
    await restoreFromBackup(olderFile)

    expect(await db.restoreUndo.count()).toBe(0)
  })

  it('keeps the days and the copy as they were when the import fails', async () => {
    await restoreFromBackup(olderFile)
    vi.spyOn(db.days, 'bulkPut').mockRejectedValueOnce(new Error('disk full'))

    await expect(restoreFromBackup({ ...olderFile, days: phoneDays })).rejects.toThrow()
    await swapLastRestore()

    expect(await allDays()).toEqual(phoneDays)
  })
})
