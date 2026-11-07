import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveLastBackup } from '../../src/backup/lastBackup'
import { db } from '../../src/data/db'
import { chooseBackupFile, stubShare } from '../helpers/backupFile'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { buttonByLabel, expectInOrder, ionElement } from '../helpers/ionic'
import { alertShown, clickAlertButton, toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const NEVER_LABEL = 'עדיין לא נעשה גיבוי'

const logged = days('2026-10-28', '2026-11-05', { prayers: allMinyan })

const dayContentLoaded = () => ionElement('.inset-group')

const overlaysSettled = () => new Promise((resolve) => setTimeout(resolve, 50))

async function importFileExportedAt(exportedAt: number) {
  renderAt('/tabs/stats/settings')
  await screen.findByText('ייבוא גיבוי')

  const shown = alertShown()

  chooseBackupFile(JSON.stringify({ version: 1, exportedAt, days: [] }))
  await shown
  clickAlertButton('ייבוא')
}

beforeEach(resetDb)
freezeDate(new Date(2026, 10, 6, 10).getTime())

describe('the backup reminder', () => {
  it('says when there has never been a backup', async () => {
    await db.days.bulkPut(logged)
    renderAt('/tabs/today')

    expect(await screen.findByText(NEVER_LABEL)).toBeVisible()
  })

  it('says how long ago the last backup was', async () => {
    await db.days.bulkPut(logged)
    saveLastBackup(new Date(2026, 9, 29, 9).getTime())
    renderAt('/tabs/today')

    expect(await screen.findByText('הגיבוי האחרון לפני 8 ימים')).toBeVisible()
  })

  it('stays away after a recent backup', async () => {
    await db.days.bulkPut(logged)
    saveLastBackup(new Date(2026, 10, 1, 9).getTime())
    renderAt('/tabs/today')
    await dayContentLoaded()

    expect(screen.queryByText(/גיבוי/)).not.toBeInTheDocument()
  })

  it('stays away on an empty app', async () => {
    renderAt('/tabs/today')
    await dayContentLoaded()

    expect(screen.queryByText(NEVER_LABEL)).not.toBeInTheDocument()
  })

  it('does not show on a past day', async () => {
    await db.days.bulkPut(logged)
    renderAt('/tabs/today/2026-11-04')
    await dayContentLoaded()

    expect(screen.queryByText(NEVER_LABEL)).not.toBeInTheDocument()
  })

  it('sits below the rows for days to fill', async () => {
    await db.days.bulkPut([...days('2026-10-20', '2026-11-03', { prayers: allMinyan }), day('2026-11-05', { prayers: allMinyan })])
    renderAt('/tabs/today')

    await expectInOrder(['יום רביעי 4.11 לא מולא', NEVER_LABEL])
  })

  it('shares the backup when tapped, then goes away', async () => {
    await db.days.bulkPut(logged)

    const share = stubShare(() => Promise.resolve())

    renderAt('/tabs/today')
    fireEvent.click(await screen.findByText(NEVER_LABEL))

    await waitFor(() => expect(share).toHaveBeenCalledOnce())
    expect(share.mock.calls[0][0].files?.map((file) => file.name)).toEqual(['prayers-backup-2026-11-06.json'])
    await waitFor(() => expect(screen.queryByText(NEVER_LABEL)).not.toBeInTheDocument())
  })

  it('stays, with no message, when the share is cancelled', async () => {
    await db.days.bulkPut(logged)

    const share = stubShare(() => Promise.reject(new DOMException('cancelled', 'AbortError')))

    renderAt('/tabs/today')
    fireEvent.click(await screen.findByText(NEVER_LABEL))
    await waitFor(() => expect(share).toHaveBeenCalledOnce())
    await overlaysSettled()

    expect(screen.getByText(NEVER_LABEL)).toBeInTheDocument()
    expect(toasts()).toEqual([])
  })

  it('stays and says so in Hebrew when the share fails', async () => {
    await db.days.bulkPut(logged)
    stubShare(() => Promise.reject(new Error('The request is not allowed')))

    renderAt('/tabs/today')
    fireEvent.click(await screen.findByText(NEVER_LABEL))

    await waitFor(() => expect(toasts()).toEqual(['הפעולה נכשלה']))
    expect(screen.getByText(NEVER_LABEL)).toBeInTheDocument()
  })

  it('opens one share sheet when tapped twice', async () => {
    await db.days.bulkPut(logged)

    const share = stubShare(() => Promise.resolve())

    renderAt('/tabs/today')

    const row = await screen.findByText(NEVER_LABEL)

    fireEvent.click(row)
    fireEvent.click(row)
    await waitFor(() => expect(screen.queryByText(NEVER_LABEL)).not.toBeInTheDocument())

    expect(share).toHaveBeenCalledOnce()
  })

  it('goes away when the backup is exported from הגדרות', async () => {
    await db.days.bulkPut(logged)
    stubShare(() => Promise.resolve())

    renderAt('/tabs/today')
    await screen.findByText(NEVER_LABEL)
    fireEvent.click(await buttonByLabel('הגדרות'))

    const exportRow = await screen.findByText('ייצוא גיבוי')

    expect(screen.getAllByText(NEVER_LABEL, { selector: 'ion-label' })).toHaveLength(1)

    fireEvent.click(exportRow)

    await waitFor(() => expect(screen.queryAllByText(NEVER_LABEL, { selector: 'ion-label' })).toEqual([]))
  })
})

describe('the last backup line in הגדרות', () => {
  it('says when there has never been a backup', async () => {
    renderAt('/tabs/stats/settings')

    expect(await screen.findByText(NEVER_LABEL)).toBeVisible()
  })

  it('shows the time of the last backup', async () => {
    saveLastBackup(new Date(2026, 10, 5, 9, 30).getTime())
    renderAt('/tabs/stats/settings')

    expect(await screen.findByText('גיבוי אחרון: 5.11.2026 09:30')).toBeVisible()
  })

  it('updates after an export', async () => {
    stubShare(() => Promise.resolve())
    renderAt('/tabs/stats/settings')

    fireEvent.click(await screen.findByText('ייצוא גיבוי'))

    expect(await screen.findByText('גיבוי אחרון: 6.11.2026 10:00')).toBeVisible()
  })

  it('counts a download as a backup where the browser cannot share a file', async () => {
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)

    Object.assign(navigator, { canShare: () => false })
    Object.assign(URL, { createObjectURL: () => 'blob:backup', revokeObjectURL: () => undefined })
    renderAt('/tabs/stats/settings')

    fireEvent.click(await screen.findByText('ייצוא גיבוי'))

    expect(await screen.findByText('גיבוי אחרון: 6.11.2026 10:00')).toBeVisible()
    expect(download).toHaveBeenCalledOnce()
    download.mockRestore()
  })

  it('takes the time from the file after an import', async () => {
    await importFileExportedAt(new Date(2026, 9, 20, 8, 15).getTime())

    expect(await screen.findByText('גיבוי אחרון: 20.10.2026 08:15')).toBeVisible()
  })

  it('moves the time back when an older file is imported', async () => {
    saveLastBackup(new Date(2026, 10, 5, 9, 30).getTime())

    await importFileExportedAt(new Date(2026, 9, 20, 8, 15).getTime())

    expect(await screen.findByText('גיבוי אחרון: 20.10.2026 08:15')).toBeVisible()
  })

  it('counts a file dated in the future as made now', async () => {
    await importFileExportedAt(new Date(2030, 0, 1).getTime())

    expect(await screen.findByText('גיבוי אחרון: 6.11.2026 10:00')).toBeVisible()
  })
})
