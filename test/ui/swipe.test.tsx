import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { ionField } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'
import { swipe, swipeLeft, swipeRight } from '../helpers/swipe'

const SETTLE_MS = 600

const settle = () => new Promise((resolve) => setTimeout(resolve, SETTLE_MS))

describe('swiping', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('moves to the previous day with a swipe left and back with a swipe right', async () => {
    renderAt('/tabs/today')
    await screen.findByText('יום רביעי · י״ז בחשון · וירא · 28.10')

    await swipeLeft()

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-27'))
    expect(await screen.findByText('יום שלישי · ט״ז בחשון · וירא · 27.10')).toBeInTheDocument()

    await swipeRight()

    await waitFor(() => expect(currentPath()).toBe('/tabs/today'))
  })

  it('never swipes into the future', async () => {
    renderAt('/tabs/today')
    await screen.findByText('יום רביעי · י״ז בחשון · וירא · 28.10')

    await swipeRight()
    await settle()

    expect(currentPath()).toBe('/tabs/today')
  })

  it('ignores a short drag', async () => {
    renderAt('/tabs/today')
    await screen.findByText('יום רביעי · י״ז בחשון · וירא · 28.10')

    await swipe(-0.1)
    await settle()

    expect(currentPath()).toBe('/tabs/today')
  })

  it('leaves a drag in the note field to the field', async () => {
    renderAt('/tabs/today')

    await swipe(-0.6, await ionField('הערה'))
    await settle()

    expect(currentPath()).toBe('/tabs/today')
  })

  it('steps a day opened from לוח', async () => {
    renderAt('/tabs/calendar/2026-10-15')
    await screen.findByText('יום חמישי · ד׳ בחשון · נח · 15.10')

    await swipeLeft()

    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar/2026-10-14'))
  })

  it('moves between months on לוח but not past this one', async () => {
    renderAt('/tabs/calendar')
    await screen.findByText('אוקטובר 2026')

    await swipeRight()
    await settle()

    expect(screen.getByText('אוקטובר 2026')).toBeInTheDocument()

    await swipeLeft()

    expect(await screen.findByText('ספטמבר 2026')).toBeInTheDocument()
  })
})
