import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { buttonByLabel, ionField, ionInput } from '../helpers/ionic'
import { toasts } from '../helpers/overlays'
import { currentPath, renderAt } from '../helpers/renderAt'

const TODAY = '2026-10-28'

const storedNote = async (date = TODAY) => (await db.days.get(date))?.torahNote

const noteField = async () => {
  const field = await ionField('מה למדתי')

  if (!(field instanceof HTMLElement) || !('value' in field)) {
    throw new Error('the note field has no value')
  }

  return field
}

describe('the מה למדתי note', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is saved while typing, with no return and no blur', async () => {
    renderAt('/tabs/today')

    ionInput(await noteField(), 'דף יומי')

    await waitFor(async () => expect(await storedNote()).toBe('דף יומי'))
  })

  it('stays on the day it was typed for when the day changes right after', async () => {
    renderAt('/tabs/today')

    ionInput(await noteField(), 'דף יומי')
    fireEvent.click(await buttonByLabel('היום הקודם'))

    await waitFor(() => expect(currentPath()).toContain('2026-10-27'))
    await waitFor(async () => expect(await storedNote()).toBe('דף יומי'))
    expect(await storedNote('2026-10-27')).toBeUndefined()
  })

  it('keeps the last value when typing is faster than the writes', async () => {
    renderAt('/tabs/today')
    const field = await noteField()

    ionInput(field, 'ד')
    ionInput(field, 'דף')
    ionInput(field, 'דף י')

    await waitFor(async () => expect(await storedNote()).toBe('דף י'))
  })

  it('stores the note trimmed without taking the space away from the field', async () => {
    renderAt('/tabs/today')
    const field = await noteField()

    ionInput(field, 'דף ')

    await waitFor(async () => expect(await storedNote()).toBe('דף'))
    expect(field.value).toBe('דף ')
  })

  it('removes the record once the note is emptied, if nothing else is marked', async () => {
    await db.days.put(day(TODAY, { torahNote: 'דף' }))
    renderAt('/tabs/today')
    const field = await noteField()

    await waitFor(() => expect(field.value).toBe('דף'))
    ionInput(field, '')

    await waitFor(async () => expect(await db.days.get(TODAY)).toBeUndefined())
  })

  it('shows the stored note again after leaving the field', async () => {
    renderAt('/tabs/today')
    const field = await noteField()

    ionInput(field, ' דף ')
    await waitFor(async () => expect(await storedNote()).toBe('דף'))
    fireEvent(field, new CustomEvent('ionBlur', { bubbles: true }))

    await waitFor(() => expect(field.value).toBe('דף'))
  })

  it('shows one message, not one per letter, when the writes fail', async () => {
    renderAt('/tabs/today')
    const field = await noteField()

    vi.spyOn(db.days, 'put').mockRejectedValue(new DOMException('lost', 'UnknownError'))
    ionInput(field, 'ד')
    ionInput(field, 'דף')
    ionInput(field, 'דף י')

    await waitFor(() => expect(toasts()).toContain('לא נשמר. אפשר לנסות שוב.'))
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(toasts()).toEqual(['לא נשמר. אפשר לנסות שוב.'])
  })

  it('goes back to the stored note on leaving the field when the writes failed', async () => {
    await db.days.put(day(TODAY, { torahNote: 'דף' }))
    renderAt('/tabs/today')
    const field = await noteField()

    await waitFor(() => expect(field.value).toBe('דף'))
    vi.spyOn(db.days, 'put').mockRejectedValue(new DOMException('lost', 'UnknownError'))
    ionInput(field, 'דף יומי')

    await waitFor(() => expect(toasts()).toContain('לא נשמר. אפשר לנסות שוב.'))
    expect(field.value).toBe('דף יומי')
    fireEvent(field, new CustomEvent('ionBlur', { bubbles: true }))

    await waitFor(() => expect(field.value).toBe('דף'))
  })

  it('does not put text in the field from another day', async () => {
    await db.days.put(day('2026-10-27', { torahNote: 'אתמול' }))
    renderAt('/tabs/today')

    ionInput(await noteField(), 'היום')
    await waitFor(async () => expect(await storedNote()).toBe('היום'))
    fireEvent.click(await buttonByLabel('היום הקודם'))
    await waitFor(() => expect(currentPath()).toContain('2026-10-27'))

    await waitFor(() => expect(screen.getByLabelText('מה למדתי')).toHaveValue('אתמול'))
  })

  it('leaves a past day with only a note on the list of days to fill', async () => {
    await db.days.put(day('2026-10-27', { torahNote: 'אתמול' }))
    renderAt('/tabs/today')

    fireEvent.click(await screen.findByText('יום שלישי 27.10 לא מולא'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-27'))
    await waitFor(() => expect(screen.getByLabelText('מה למדתי')).toHaveValue('אתמול'))
  })
})
