import { screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { saveReminderSettings } from '../../src/reminder/reminderSettings'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day } from '../helpers/days'
import { markIn } from '../helpers/dayRows'
import { stubPush } from '../helpers/push'
import { renderAt } from '../helpers/renderAt'
import { leaveAndComeBackAt } from '../helpers/visibility'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, vi.fn()], updateServiceWorker: vi.fn() }),
}))

const SETTLE_MS = 100

const earlyThursday = new Date(2026, 9, 29, 3, 30).getTime()

const mondayEvening = new Date(2026, 9, 26, 20).getTime()

const tuesdayEvening = new Date(2026, 9, 27, 20).getTime()

const laterTuesdayEvening = new Date(2026, 9, 27, 21).getTime()

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

  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it('never reports a new day complete with the answer of the day before', async () => {
    await db.days.put(day('2026-10-28', { prayers: allMinyan }))

    const push = reminderOn()

    renderAt('/tabs/today')
    await waitFor(() => expect(lastPut(push.puts())).toBe('2026-10-28'))

    await leaveAndComeBackAt(earlyThursday)

    await waitFor(() => expect(lastPut(push.puts())).toBeNull())
    expect(push.puts().map(({ body }) => body.completeDate)).not.toContain('2026-10-29')
  })

  it('sends an unchanged record again once on the next day', async () => {
    vi.setSystemTime(mondayEvening)

    const push = reminderOn()

    renderAt('/tabs/today')
    await waitFor(() => expect(push.puts()).toHaveLength(1))

    await leaveAndComeBackAt(tuesdayEvening)
    await waitFor(() => expect(push.puts()).toHaveLength(2))

    await leaveAndComeBackAt(laterTuesdayEvening)
    await new Promise((resolve) => setTimeout(resolve, SETTLE_MS))

    const [mondayRecord, tuesdayRecord] = push.puts().map(({ body }) => body)

    expect(push.puts()).toHaveLength(2)
    expect(tuesdayRecord).toEqual(mondayRecord)
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

  it('turns the reminder off and drops its record when notifications were turned off in the phone’s settings', async () => {
    const push = reminderOn()

    push.revokePermission()
    renderAt('/tabs/today/settings')

    await waitFor(async () =>
      expect(await screen.findByRole('switch', { name: 'תזכורת בערב' })).toHaveAttribute('aria-checked', 'false'),
    )
    expect(screen.queryByText('שעה')).not.toBeInTheDocument()
    await waitFor(() => expect(push.deletes().map(({ body }) => body)).toEqual([{ endpoint: push.endpoint }]))
    expect(push.puts()).toHaveLength(0)
  })

  it('still drops the record when the phone fails to unsubscribe after notifications were turned off', async () => {
    const push = reminderOn()

    push.revokePermission()
    vi.mocked(push.subscription.unsubscribe).mockRejectedValueOnce(new Error('Unsubscribe failed'))
    renderAt('/tabs/today/settings')

    await waitFor(() => expect(push.deletes().map(({ body }) => body)).toEqual([{ endpoint: push.endpoint }]))
  })
})
