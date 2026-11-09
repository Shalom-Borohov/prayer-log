import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { buttonByLabel, ionElement, visibleAll } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

describe('the settings gear', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it.each([
    ['/tabs/today', '/tabs/today/settings'],
    ['/tabs/today/2026-10-27', '/tabs/today/settings'],
    ['/tabs/calendar', '/tabs/calendar/settings'],
    ['/tabs/calendar/2026-10-15', '/tabs/calendar/settings'],
    ['/tabs/stats', '/tabs/stats/settings'],
    ['/tabs/stats/learning', '/tabs/stats/settings'],
    ['/tabs/stats/2026-10-15', '/tabs/stats/settings'],
  ])('on %s opens הגדרות in the same tab', async (path, settingsPath) => {
    renderAt(path)

    fireEvent.click(await buttonByLabel('הגדרות'))

    await waitFor(() => expect(currentPath()).toBe(settingsPath))
    expect(await screen.findByText('גיבוי')).toBeInTheDocument()
  })

  it.each([
    ['/tabs/today/settings', 'היום'],
    ['/tabs/calendar/settings', 'לוח'],
    ['/tabs/stats/settings', 'סטטיסטיקה'],
  ])('is not on %s, whose back button names the tab', async (path, tabName) => {
    renderAt(path)

    expect(await ionElement('ion-back-button')).toHaveAttribute('text', tabName)
    expect(visibleAll('ion-button[aria-label="הגדרות"]')).toHaveLength(0)
  })
})
