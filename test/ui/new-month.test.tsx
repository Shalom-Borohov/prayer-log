import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { buttonByLabel, cell, ionElement } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'
import { leaveAndComeBackAt } from '../helpers/visibility'

const lastEveningOfOctober = new Date(2026, 9, 31, 21).getTime()

const lateOctoberNight = new Date(2026, 10, 1, 2, 30).getTime()

const firstMorningOfNovember = new Date(2026, 10, 1, 8).getTime()

const midAugust = new Date(2026, 7, 15, 12).getTime()

async function openOctober() {
  renderAt('/tabs/calendar')
  await screen.findByText('אוקטובר 2026')
}

async function stepBackToSeptember() {
  await openOctober()
  fireEvent.click(await buttonByLabel('החודש הקודם'))
  await screen.findByText('ספטמבר 2026')
}

describe('לוח when the app comes back in a new month', () => {
  beforeEach(resetDb)
  freezeDate(lastEveningOfOctober)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('moves to the new month', async () => {
    await openOctober()

    await leaveAndComeBackAt(firstMorningOfNovember)

    expect(await screen.findByText('נובמבר 2026')).toBeInTheDocument()
    expect(await cell('1.11')).toHaveClass('is-today')
    expect(await buttonByLabel('החודש הבא')).toHaveAttribute('disabled')
  })

  it('stays on the old month before the logical day rolls over at 03:00', async () => {
    await openOctober()

    await leaveAndComeBackAt(lateOctoberNight)

    expect(await cell('31.10')).toHaveClass('is-today')
    expect(screen.getByText('אוקטובר 2026')).toBeInTheDocument()
  })

  it('keeps a past month the user went back to, and steps forward to the new month', async () => {
    await stepBackToSeptember()

    await leaveAndComeBackAt(firstMorningOfNovember)

    expect(await cell('1.9')).toBeInTheDocument()
    expect(screen.getByText('ספטמבר 2026')).toBeInTheDocument()

    const next = await buttonByLabel('החודש הבא')

    expect(next).not.toHaveAttribute('disabled')
    fireEvent.click(next)
    await screen.findByText('אוקטובר 2026')
    expect(next).not.toHaveAttribute('disabled')
    fireEvent.click(next)

    expect(await screen.findByText('נובמבר 2026')).toBeInTheDocument()
    await waitFor(() => expect(next).toHaveAttribute('disabled'))
  })

  it('follows the date again once the user steps back to the current month', async () => {
    await stepBackToSeptember()
    fireEvent.click(await buttonByLabel('החודש הבא'))
    await screen.findByText('אוקטובר 2026')

    await leaveAndComeBackAt(firstMorningOfNovember)

    expect(await screen.findByText('נובמבר 2026')).toBeInTheDocument()
  })

  it('shows the new month on the way back from a day opened before the month changed', async () => {
    await openOctober()
    fireEvent.click(await cell('30.10'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar/2026-10-30'))

    await leaveAndComeBackAt(firstMorningOfNovember)
    expect(currentPath()).toBe('/tabs/calendar/2026-10-30')
    fireEvent.click(await ionElement('ion-back-button'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar'))
    expect(await screen.findByText('נובמבר 2026')).toBeInTheDocument()
  })

  it('follows the date again after stepping back onto the current month once the clock moved back', async () => {
    await stepBackToSeptember()

    await leaveAndComeBackAt(midAugust)
    fireEvent.click(await buttonByLabel('החודש הקודם'))
    await screen.findByText('אוגוסט 2026')

    await leaveAndComeBackAt(lastEveningOfOctober)

    expect(await screen.findByText('אוקטובר 2026')).toBeInTheDocument()
  })
})
