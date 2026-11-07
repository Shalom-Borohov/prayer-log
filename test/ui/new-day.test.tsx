import { act, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { buttonByLabel, ionElement } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'
import { leaveAndComeBackAt } from '../helpers/visibility'

const tuesdayEvening = new Date(2026, 9, 27, 21).getTime()

const wednesdayEvening = new Date(2026, 9, 28, 21).getTime()

const lateWednesdayNight = new Date(2026, 9, 29, 2, 30).getTime()

const thursdayMorning = new Date(2026, 9, 29, 8).getTime()

async function stepBackFromToday() {
  renderAt('/tabs/today')
  fireEvent.click(await buttonByLabel('היום הקודם'))
  await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-27'))
}

const pauseForRouting = () => act(() => new Promise((resolve) => setTimeout(resolve, 100)))

async function comeBackOnSettingsAndGoBack(settingsPath: string, comeBackAt: number, endsOn: string) {
  await pauseForRouting()
  fireEvent.click(await buttonByLabel('הגדרות'))
  await waitFor(() => expect(currentPath()).toBe(settingsPath))
  await pauseForRouting()

  await leaveAndComeBackAt(comeBackAt)
  await pauseForRouting()
  expect(currentPath()).toBe(settingsPath)

  fireEvent.click(await ionElement('ion-back-button'))

  await waitFor(() => expect(currentPath()).toBe(endsOn))
  await pauseForRouting()
  expect(currentPath()).toBe(endsOn)
}

const tabButton = (name: string) => {
  const button = Array.from(document.querySelectorAll('ion-tab-button')).find((tab) => tab.textContent?.includes(name))

  if (!button) {
    throw new Error(`no tab ${name}`)
  }

  return button
}

describe('היום when the app comes back', () => {
  beforeEach(resetDb)
  freezeDate(wednesdayEvening)

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns to today from a past day when the logical day has changed', async () => {
    await stepBackFromToday()

    await leaveAndComeBackAt(thursdayMorning)

    await waitFor(() => expect(currentPath()).toBe('/tabs/today'))
    expect(await screen.findByText('יום חמישי · י״ח בחשון · 29.10')).toBeInTheDocument()
  })

  it('can still step back after returning to today', async () => {
    await stepBackFromToday()
    await leaveAndComeBackAt(thursdayMorning)
    await waitFor(() => expect(currentPath()).toBe('/tabs/today'))

    fireEvent.click(await buttonByLabel('היום הקודם'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-28'))
    await pauseForRouting()
    expect(currentPath()).toBe('/tabs/today/2026-10-28')
  })

  it('stays on the past day when it comes back on the same logical day', async () => {
    await stepBackFromToday()

    await leaveAndComeBackAt(wednesdayEvening + 60_000)
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('stays on the past day after midnight and before 03:00', async () => {
    await stepBackFromToday()

    await leaveAndComeBackAt(lateWednesdayNight)
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('does not move while the app stays open across the rollover', async () => {
    await stepBackFromToday()

    await act(async () => {
      vi.setSystemTime(thursdayMorning)
    })
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('stays on the past day when the rollover happened before it left the app', async () => {
    await stepBackFromToday()

    await act(async () => {
      vi.setSystemTime(thursdayMorning)
    })
    await leaveAndComeBackAt(thursdayMorning + 60_000)
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('stays on the past day when it changes tabs after a rollover it stayed open across', async () => {
    await stepBackFromToday()

    await act(async () => {
      vi.setSystemTime(thursdayMorning)
    })
    fireEvent.click(tabButton('לוח'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar'))
    fireEvent.click(tabButton('היום'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-27'))
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('stays on the past day when the clock has moved back to an earlier logical day', async () => {
    await stepBackFromToday()

    await leaveAndComeBackAt(tuesdayEvening)
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/today/2026-10-27')
  })

  it('leaves a day opened from לוח where it is', async () => {
    renderAt('/tabs/calendar/2026-10-27')
    await buttonByLabel('היום הקודם')

    await leaveAndComeBackAt(thursdayMorning)
    await pauseForRouting()

    expect(currentPath()).toBe('/tabs/calendar/2026-10-27')
  })

  it('stays on לוח when it comes back there, and היום then opens today', async () => {
    await stepBackFromToday()
    fireEvent.click(tabButton('לוח'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar'))

    await leaveAndComeBackAt(thursdayMorning)
    await pauseForRouting()
    expect(currentPath()).toBe('/tabs/calendar')

    fireEvent.click(tabButton('היום'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today'))
  })

  it('keeps הגדרות opened from a past day open on a new day, and back ends on today', async () => {
    await stepBackFromToday()

    await comeBackOnSettingsAndGoBack('/tabs/today/settings', thursdayMorning, '/tabs/today')
  })

  it('goes back from הגדרות to the past day on the same logical day', async () => {
    await stepBackFromToday()

    await comeBackOnSettingsAndGoBack('/tabs/today/settings', wednesdayEvening + 60_000, '/tabs/today/2026-10-27')
  })

  it('goes back from הגדרות to a day opened from לוח on a new day', async () => {
    renderAt('/tabs/calendar/2026-10-27')
    await buttonByLabel('היום הקודם')

    await comeBackOnSettingsAndGoBack('/tabs/calendar/settings', thursdayMorning, '/tabs/calendar/2026-10-27')
  })

  it('reopens הגדרות on the היום tab after coming back on another tab, and back ends on today', async () => {
    await stepBackFromToday()
    await pauseForRouting()
    fireEvent.click(await buttonByLabel('הגדרות'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/today/settings'))
    await pauseForRouting()
    fireEvent.click(tabButton('לוח'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar'))

    await leaveAndComeBackAt(thursdayMorning)
    await pauseForRouting()
    fireEvent.click(tabButton('היום'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/today/settings'))
    await pauseForRouting()
    fireEvent.click(await ionElement('ion-back-button'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today'))
    await pauseForRouting()
    expect(currentPath()).toBe('/tabs/today')
  })
})
