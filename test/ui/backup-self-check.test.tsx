import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { alertShown, toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const nonsenseMark = JSON.parse('{"date":"2026-11-02","prayers":{"shacharit":"nonsense"},"torah":false}')

const otherNonsenseMark = JSON.parse('{"date":"2026-11-03","prayers":{"mincha":"nonsense"},"torah":false}')

const ONE_BAD = 'בגיבוי יש רשומה פגומה אחת, וייבוא הקובץ ייכשל'

function stubShare(share: () => Promise<void>) {
  const stub = vi.fn(share)

  Object.assign(navigator, { share: stub, canShare: () => true })

  return stub
}

async function openExport() {
  renderAt('/tabs/stats/settings')

  return screen.findByText('ייצוא גיבוי')
}

const alertMessage = () => document.querySelector('ion-alert .alert-message')?.textContent

const lastBackupKept = () => localStorage.getItem('last-backup-at')

describe('exporting a backup', () => {
  beforeEach(resetDb)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('still produces the file and says it holds a bad record', async () => {
    await db.days.bulkPut([day('2026-11-01', { torah: true }), nonsenseMark])
    const share = stubShare(() => Promise.resolve())
    const button = await openExport()
    const shown = alertShown()

    fireEvent.click(button)
    await shown

    expect(share).toHaveBeenCalledOnce()
    expect(alertMessage()).toBe(ONE_BAD)
  })

  it('counts several bad records', async () => {
    await db.days.bulkPut([nonsenseMark, otherNonsenseMark])
    stubShare(() => Promise.resolve())
    const button = await openExport()
    const shown = alertShown()

    fireEvent.click(button)
    await shown

    expect(alertMessage()).toBe('בגיבוי יש 2 רשומות פגומות, וייבוא הקובץ ייכשל')
  })

  it('says so even when the share is cancelled', async () => {
    await db.days.put(nonsenseMark)
    stubShare(() => Promise.reject(new DOMException('cancelled', 'AbortError')))
    const button = await openExport()
    const shown = alertShown()

    fireEvent.click(button)
    await shown

    expect(alertMessage()).toBe(ONE_BAD)
    expect(toasts()).not.toContain('הפעולה נכשלה')
    expect(lastBackupKept()).toBeNull()
  })

  it('counts a file with a bad record as a backup, as decision 31 says', async () => {
    await db.days.put(nonsenseMark)
    stubShare(() => Promise.resolve())
    const button = await openExport()
    const shown = alertShown()

    fireEvent.click(button)
    await shown

    expect(lastBackupKept()).not.toBeNull()
  })

  it('says nothing about a file with only sound records', async () => {
    await db.days.put(day('2026-11-01', { torah: true }))
    const share = stubShare(() => Promise.resolve())

    fireEvent.click(await openExport())
    await waitFor(() => expect(share).toHaveBeenCalledOnce())
    await waitFor(() => expect(lastBackupKept()).not.toBeNull())

    expect(document.querySelector('ion-alert')).toBeNull()
  })
})
