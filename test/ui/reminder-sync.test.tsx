import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { saveReminderSettings } from '../../src/reminder/reminderSettings'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { markIn } from '../helpers/dayRows'
import { stubPush } from '../helpers/push'
import { renderAt } from '../helpers/renderAt'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, vi.fn()], updateServiceWorker: vi.fn() }),
}))

const SETTLE_MS = 100

const lastPut = (puts: { body: { completeDate: string | null } }[]) => puts.at(-1)?.body.completeDate

function reminderOn() {
  const push = stubPush()

  push.alreadySubscribed()
  saveReminderSettings({ enabled: true, time: '22:00' })

  return push
}

describe('keeping the reminder up to date', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 20).getTime())

  it('reports today complete once its last prayer is marked, and not after it is cleared', async () => {
    await db.days.put(day('2026-10-28', { prayers: { shacharit: 'minyan', mincha: 'alone' } }))

    const push = reminderOn()

    renderAt('/tabs/today')
    await waitFor(() => expect(push.puts()).toHaveLength(1))
    expect(lastPut(push.puts())).toBeNull()

    await markIn('ערבית', 'ביחידות')
    await waitFor(() => expect(lastPut(push.puts())).toBe('2026-10-28'))

    await markIn('ערבית', 'ביחידות')
    await waitFor(() => expect(push.puts()).toHaveLength(3))
    expect(lastPut(push.puts())).toBeNull()
  })

  it('sends again when the phone is back online after a failed send', async () => {
    const push = reminderOn()

    push.failRequests()
    renderAt('/tabs/today')
    await waitFor(() => expect(push.puts()).toHaveLength(1))

    push.answerRequests()
    window.dispatchEvent(new Event('online'))
    await waitFor(() => expect(push.puts()).toHaveLength(2))

    window.dispatchEvent(new Event('online'))
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS))
    expect(push.puts()).toHaveLength(2)
  })

  it('turns the reminder off when the phone no longer has its subscription', async () => {
    stubPush()
    saveReminderSettings({ enabled: true, time: '22:00' })
    renderAt('/tabs/today/settings')

    await waitFor(async () =>
      expect(await screen.findByRole('switch', { name: 'תזכורת בערב' })).toHaveAttribute('aria-checked', 'false'),
    )
    expect(screen.queryByText('שעה')).not.toBeInTheDocument()
  })
})
