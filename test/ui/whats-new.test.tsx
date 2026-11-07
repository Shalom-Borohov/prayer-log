import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { saveSeenVersion } from '../../src/appUpdate/seenVersion'
import { resetDb } from '../helpers/db'
import { expectInOrder } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

vi.mock('../../src/appUpdate/changelog', () => ({
  CHANGELOG: [
    { version: '0.1.0', features: ['הכי ישן'], fixes: [] },
    { version: __APP_VERSION__, features: ['פס עדכון'], fixes: ['כותרת חדה'] },
    { version: '0.2.0', features: ['ישן'], fixes: [] },
  ],
}))

const OLDEST_SEEN = '0.1.0'
const SEEN_VERSION_KEY = 'prayer-log:seen-version'
const SHARED_ORIGIN_KEY = 'seen-version'
const ABOVE_ANY_RUNNING_VERSION = '999.0.0'

const closeButton = () => screen.findByText('סגירה')

const expectSheetNeverOpens = () => expect(screen.findByText('מה חדש')).rejects.toThrow()

beforeEach(async () => {
  await resetDb()
})

describe('what’s new after an update', () => {
  it('lists the releases since the last one seen, newest first', async () => {
    saveSeenVersion(OLDEST_SEEN)
    renderAt('/tabs/calendar')

    expect(await screen.findByText('מה חדש')).toBeInTheDocument()
    expect(screen.getByText('פס עדכון')).toBeInTheDocument()
    expect(screen.getByText('כותרת חדה')).toBeInTheDocument()
    expect(screen.getByText('ישן')).toBeInTheDocument()
    expect(screen.queryByText('הכי ישן')).not.toBeInTheDocument()
    await expectInOrder([`גרסה ${__APP_VERSION__}`, 'גרסה 0.2.0'])
  })

  it('shows only once', async () => {
    saveSeenVersion(OLDEST_SEEN)
    renderAt('/tabs/calendar')

    fireEvent.click(await closeButton())
    await waitFor(() => expect(screen.queryByText('פס עדכון')).not.toBeInTheDocument())

    cleanup()
    renderAt('/tabs/calendar')

    expect(await screen.findAllByText('לוח')).not.toHaveLength(0)
    expect(screen.queryByText('מה חדש')).not.toBeInTheDocument()
  })

  it('shows only the running release when no version was seen before', async () => {
    localStorage.clear()
    renderAt('/tabs/calendar')

    expect(await screen.findByText(`גרסה ${__APP_VERSION__}`)).toBeInTheDocument()
    expect(screen.queryByText('גרסה 0.2.0')).not.toBeInTheDocument()
  })

  it('opens every release from the version line in הגדרות', async () => {
    renderAt('/tabs/stats/settings')

    fireEvent.click(await screen.findByText(new RegExp(`^גרסה ${__APP_VERSION__} · עודכנה`)))

    expect(await screen.findByText('מה חדש')).toBeInTheDocument()
    expect(screen.getByText('הכי ישן')).toBeInTheDocument()
    expect(screen.getByText('ישן')).toBeInTheDocument()
    expect(screen.getByText('פס עדכון')).toBeInTheDocument()
  })
})

describe('the seen version shared with a sibling app on the same origin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the running release when the old key holds a version above the running one', async () => {
    localStorage.setItem(SHARED_ORIGIN_KEY, ABOVE_ANY_RUNNING_VERSION)
    renderAt('/tabs/calendar')

    expect(await screen.findByText(`גרסה ${__APP_VERSION__}`)).toBeInTheDocument()
    expect(screen.queryByText('גרסה 0.2.0')).not.toBeInTheDocument()
  })

  it('counts an old key at the running version as seen', async () => {
    localStorage.setItem(SHARED_ORIGIN_KEY, __APP_VERSION__)
    renderAt('/tabs/calendar')

    await expectSheetNeverOpens()
  })

  it('lists the releases after an old key below the running version', async () => {
    localStorage.setItem(SHARED_ORIGIN_KEY, OLDEST_SEEN)
    renderAt('/tabs/calendar')

    expect(await screen.findByText(`גרסה ${__APP_VERSION__}`)).toBeInTheDocument()
    expect(screen.getByText('גרסה 0.2.0')).toBeInTheDocument()
    expect(screen.queryByText('הכי ישן')).not.toBeInTheDocument()
  })

  it('writes only the new key, and only when the sheet closes', async () => {
    localStorage.setItem(SHARED_ORIGIN_KEY, ABOVE_ANY_RUNNING_VERSION)
    renderAt('/tabs/calendar')

    const close = await closeButton()

    expect(localStorage.getItem(SEEN_VERSION_KEY)).toBeNull()

    fireEvent.click(close)

    await waitFor(() => expect(localStorage.getItem(SEEN_VERSION_KEY)).toBe(__APP_VERSION__))
    expect(localStorage.getItem(SHARED_ORIGIN_KEY)).toBe(ABOVE_ANY_RUNNING_VERSION)
  })

  it('keeps the sheet closed when the new key is current, whatever the old key holds', async () => {
    saveSeenVersion(__APP_VERSION__)
    localStorage.setItem(SHARED_ORIGIN_KEY, OLDEST_SEEN)
    renderAt('/tabs/calendar')

    await expectSheetNeverOpens()
  })

  it('lists the releases after the new key, even when the old key is above the running version', async () => {
    saveSeenVersion(OLDEST_SEEN)
    localStorage.setItem(SHARED_ORIGIN_KEY, ABOVE_ANY_RUNNING_VERSION)
    renderAt('/tabs/calendar')

    expect(await screen.findByText(`גרסה ${__APP_VERSION__}`)).toBeInTheDocument()
    expect(screen.getByText('גרסה 0.2.0')).toBeInTheDocument()
  })
})
