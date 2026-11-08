import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { restoreFromBackup } from '../../src/backup/backupFile'
import { saveLastBackup } from '../../src/backup/lastBackup'
import { parseBackup } from '../../src/data/backup'
import { db } from '../../src/data/db'
import { allDays } from '../../src/data/repo'
import { TOAST_DURATION_MS } from '../../src/hooks/useToast'
import { chooseBackupFile } from '../helpers/backupFile'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, days } from '../helpers/days'
import { alertHeader, alertMessage, alertShown, clickAlertButton, toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'
import { asRead } from '../helpers/text'

const NOW = new Date(2026, 10, 8, 10).getTime()

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

const EXPIRY_SOON_MS = 300

const UNDO = 'ביטול הייבוא האחרון'

const REDO = 'החזרת הייבוא'

const phoneDays = days('2026-11-01', '2026-11-08', { prayers: allMinyan })

const fileDays = days('2026-10-20', '2026-10-30', { torah: true })

const olderFile = JSON.stringify({ version: 1, exportedAt: new Date(2026, 9, 30, 21).getTime(), days: fileDays })

async function importOlderFile() {
  renderAt('/tabs/stats/settings')
  await screen.findByText('ייבוא גיבוי')

  const shown = alertShown()

  chooseBackupFile(olderFile)
  await shown
  clickAlertButton('ייבוא')
  await waitFor(() => expect(toasts()).toContain('הגיבוי שוחזר'))
}

const TOAST_GONE_MS = TOAST_DURATION_MS + 1500

const liveQueriesSettled = () => new Promise((resolve) => setTimeout(resolve, 50))

async function openSwap(label: string) {
  const shown = alertShown()

  fireEvent.click(await screen.findByText(label))
  await shown
}

beforeEach(async () => {
  await resetDb()
  await db.days.bulkPut(phoneDays)
  saveLastBackup(new Date(2026, 10, 7, 20).getTime())
})

afterEach(() => {
  vi.restoreAllMocks()
})

freezeDate(NOW)

describe('undoing an import in הגדרות', () => {
  it('offers the undo for 7 days after an import', async () => {
    await importOlderFile()

    expect(await screen.findByText(UNDO)).toBeVisible()
    expect(screen.getByText('אפשר לבטל עד 15.11.2026 10:00')).toBeVisible()
  })

  it('shows what comes back and changes nothing when cancelled', async () => {
    await importOlderFile()
    await openSwap(UNDO)

    expect(alertHeader()).toBe(UNDO)
    expect(asRead(alertMessage())).toBe(
      ['הנתונים שלפני הייבוא יחזרו.', 'יחזרו: 8 ימים, עד 8.11.2026', 'עכשיו: 11 ימים, עד 30.10.2026'].join('\n'),
    )

    clickAlertButton('ביטול')

    expect(await allDays()).toEqual(fileDays)
  })

  it('says how many days logged since the import will stay', async () => {
    await importOlderFile()
    await db.days.bulkPut(days('2026-11-09', '2026-11-10', { torah: true }))
    await openSwap(UNDO)

    expect(asRead(alertMessage())).toBe(
      [
        'הנתונים שלפני הייבוא יחזרו.',
        'יחזרו: 8 ימים, עד 8.11.2026',
        'עכשיו: 13 ימים, עד 10.11.2026',
        '2 ימים שסומנו מאז יישארו.',
      ].join('\n'),
    )
  })

  it('brings back the replaced data and backup time, then offers to bring the import back', async () => {
    await importOlderFile()
    await openSwap(UNDO)
    clickAlertButton('החזרה')

    await waitFor(() => expect(toasts()).toContain('הייבוא בוטל'))
    expect(await allDays()).toEqual(phoneDays)
    expect(await screen.findByText('גיבוי אחרון: 7.11.2026 20:00')).toBeVisible()
    expect(await screen.findByText(REDO)).toBeVisible()
    expect(screen.getByText('אפשר להחזיר עד 15.11.2026 10:00')).toBeVisible()
    expect(screen.queryByText(UNDO)).not.toBeInTheDocument()
  })

  it('brings the import back from the same row', async () => {
    await importOlderFile()
    await openSwap(UNDO)
    clickAlertButton('החזרה')
    await waitFor(() => expect(toasts()).toContain('הייבוא בוטל'))
    await waitFor(() => expect(toasts()).not.toContain('הייבוא בוטל'), { timeout: TOAST_GONE_MS })
    await openSwap(REDO)

    expect(asRead(alertMessage())).toBe(
      ['הנתונים מהייבוא יחזרו.', 'יחזרו: 11 ימים, עד 30.10.2026', 'עכשיו: 8 ימים, עד 8.11.2026'].join('\n'),
    )

    clickAlertButton('החזרה')

    await waitFor(() => expect(toasts()).toContain('הייבוא הוחזר'))
    expect(await allDays()).toEqual(fileDays)
  })

  it.each([
    ['still offers it a minute before', new Date(2026, 10, 15, 9, 59), 1],
    ['stops offering it a minute after', new Date(2026, 10, 15, 10, 1), 0],
  ])('%s 7 days have passed', async (_, openedAt, rows) => {
    await restoreFromBackup(parseBackup(olderFile))
    vi.setSystemTime(openedAt)
    renderAt('/tabs/stats/settings')
    await screen.findByText('ייבוא גיבוי')
    await liveQueriesSettled()

    expect(screen.queryAllByText(UNDO)).toHaveLength(rows)
  })

  it('stops offering it when the app comes back after 7 days with הגדרות still open', async () => {
    await importOlderFile()
    await screen.findByText(UNDO)

    vi.setSystemTime(new Date(2026, 10, 15, 10, 1))
    fireEvent(document, new Event('visibilitychange'))

    await waitFor(() => expect(screen.queryByText(UNDO)).not.toBeInTheDocument())
  })

  it('stops offering it at the end of the 7 days while הגדרות stays in front', async () => {
    await restoreFromBackup(parseBackup(olderFile))
    vi.setSystemTime(NOW + SEVEN_DAYS_MS - EXPIRY_SOON_MS)
    renderAt('/tabs/stats/settings')

    expect(await screen.findByText(UNDO)).toBeVisible()
    await waitFor(() => expect(screen.queryByText(UNDO)).not.toBeInTheDocument())
  })

  it('offers nothing after an import onto an empty phone', async () => {
    await db.days.clear()
    await importOlderFile()
    await liveQueriesSettled()

    expect(screen.queryByText(UNDO)).not.toBeInTheDocument()
  })

  it('says so when the swap cannot be saved', async () => {
    await importOlderFile()
    vi.spyOn(db.days, 'bulkPut').mockRejectedValueOnce(new Error('disk full'))
    await openSwap(UNDO)
    clickAlertButton('החזרה')

    await waitFor(() => expect(toasts()).toContain('לא נשמר. אפשר לנסות שוב.'))
    expect(await allDays()).toEqual(fileDays)
  })

  it('says the action failed when what comes back cannot be read', async () => {
    await importOlderFile()
    vi.spyOn(db.days, 'toArray').mockRejectedValueOnce(new Error('read failed'))
    fireEvent.click(await screen.findByText(UNDO))

    await waitFor(() => expect(toasts()).toContain('הפעולה נכשלה'))
  })
})
