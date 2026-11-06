import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { row } from '../helpers/dayRows'
import { actionSheetPresented, clickSheetButton, toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const SAVE_FAILED = 'לא נשמר. אפשר לנסות שוב.'

const LOST_CONNECTION = new DOMException('Connection to Indexed Database server lost', 'UnknownError')

const failNextWrites = () => vi.spyOn(db.days, 'put').mockRejectedValue(LOST_CONNECTION)

const saveFailureShown = () => waitFor(() => expect(toasts()).toContain(SAVE_FAILED))

describe('a save that fails', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows the mark as not saved and says so', async () => {
    renderAt('/tabs/today')
    const mincha = await row('מנחה')
    const write = failNextWrites()

    fireEvent.click(within(mincha).getByRole('button', { name: 'ביחידות' }))
    await waitFor(() => expect(write).toHaveBeenCalled())
    await saveFailureShown()

    expect(within(mincha).getByRole('button', { name: 'ביחידות' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('keeps a mark on screen when clearing it fails', async () => {
    await db.days.put(day('2026-10-28', { prayers: { mincha: 'alone' } }))
    renderAt('/tabs/today')
    const mincha = await row('מנחה')

    await waitFor(() =>
      expect(within(mincha).getByRole('button', { name: 'ביחידות' })).toHaveAttribute('aria-pressed', 'true'),
    )
    vi.spyOn(db.days, 'delete').mockRejectedValue(LOST_CONNECTION)

    fireEvent.click(within(mincha).getByRole('button', { name: 'ביחידות' }))
    await saveFailureShown()

    expect(within(mincha).getByRole('button', { name: 'ביחידות' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('does not ask for a place for a במניין mark that was not saved', async () => {
    renderAt('/tabs/today')
    const mincha = await row('מנחה')

    failNextWrites()
    fireEvent.click(within(mincha).getByRole('button', { name: 'במניין' }))
    await saveFailureShown()

    expect(document.querySelector('ion-action-sheet')).toBeNull()
  })

  it('says so for the Torah check', async () => {
    renderAt('/tabs/today')
    const check = await screen.findByRole('checkbox', { name: 'למדתי תורה' })

    failNextWrites()
    fireEvent.click(check)
    await saveFailureShown()

    expect(check).toHaveAttribute('aria-checked', 'false')
  })

  it('says so for the תפילין check', async () => {
    renderAt('/tabs/today')
    const check = await screen.findByRole('checkbox', { name: 'תפילין' })

    failNextWrites()
    fireEvent.click(check)
    await saveFailureShown()

    expect(check).toHaveAttribute('aria-checked', 'false')
  })

  it('says so for a place', async () => {
    await db.days.put(day('2026-10-28', { prayers: { mincha: 'minyan' }, places: { mincha: 'הגדול' } }))
    renderAt('/tabs/today')
    const place = await within(await row('מנחה')).findByRole('button', { name: 'בית כנסת במנחה: הגדול' })
    const presented = actionSheetPresented()

    fireEvent.click(place)
    await presented
    failNextWrites()
    clickSheetButton('ללא מקום')
    await saveFailureShown()

    expect(within(await row('מנחה')).getByRole('button', { name: 'בית כנסת במנחה: הגדול' })).toBeVisible()
  })

  it('stores the mark and shows no message when the write works', async () => {
    renderAt('/tabs/today')
    const mincha = await row('מנחה')

    fireEvent.click(within(mincha).getByRole('button', { name: 'ביחידות' }))
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ mincha: 'alone' }))

    expect(toasts()).not.toContain(SAVE_FAILED)
  })
})
