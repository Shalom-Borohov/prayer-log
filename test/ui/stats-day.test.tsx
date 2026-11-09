import { fireEvent, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { buttonByLabel, ionElement } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

describe('a day opened under סטטיסטיקה', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('has a back button to the מה למדתי list', async () => {
    renderAt('/tabs/stats/2026-10-15')

    const back = await ionElement('ion-back-button')

    expect(back).toHaveAttribute('text', 'מה למדתי')
    fireEvent.click(back)

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/learning'))
  })

  it('steps to the previous day in place, so back still returns to the list', async () => {
    renderAt('/tabs/stats/2026-10-15')

    fireEvent.click(await buttonByLabel('היום הקודם'))
    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/2026-10-14'))
    fireEvent.click(await ionElement('ion-back-button'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/learning'))
  })

  it('stays under סטטיסטיקה on today’s date', async () => {
    renderAt('/tabs/stats/2026-10-28')

    expect(await ionElement('ion-back-button')).toHaveAttribute('text', 'מה למדתי')
    expect(currentPath()).toBe('/tabs/stats/2026-10-28')
  })

  it.each(['2026-10-29', 'not-a-date'])('sends %s back to the list', async (date) => {
    renderAt(`/tabs/stats/${date}`)

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/learning'))
  })
})
