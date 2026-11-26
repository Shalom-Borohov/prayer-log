import { fireEvent, screen, waitFor } from '@testing-library/react'
import { parse } from 'valibot'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { reminderRecordSchema } from '../../src/reminder/record'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { expectInOrder, expectNamedSheet, ionChange, ionElement } from '../helpers/ionic'
import { toasts } from '../helpers/overlays'
import { stubPush } from '../helpers/push'
import { renderAt } from '../helpers/renderAt'

vi.mock('virtual:pwa-register/react', () => ({
  useRegisterSW: () => ({ needRefresh: [false, vi.fn()], updateServiceWorker: vi.fn() }),
}))

const SETTINGS = '/tabs/today/settings'

const reminderToggle = () => screen.findByRole('switch', { name: 'תזכורת בערב' })

async function turnOn() {
  await waitFor(async () => expect(await reminderToggle()).not.toHaveAttribute('aria-disabled'))
  fireEvent.click(await reminderToggle())
}

describe('the evening reminder setting', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 9, 30).getTime())

  it('sits after היסטוריה and above the report row', async () => {
    renderAt(SETTINGS)

    await expectInOrder(['ייבוא גיבוי', 'היסטוריה', 'ייצוא היסטוריה', 'תזכורת', 'דיווח על באג / הצעה'])
  })

  it('can only be turned on once the app is on the Home Screen', async () => {
    renderAt(SETTINGS)

    expect(await reminderToggle()).toHaveAttribute('aria-disabled', 'true')
    expect(screen.getByText('כדי לקבל תזכורת, צריך קודם להוסיף את האפליקציה למסך הבית.')).toBeInTheDocument()
  })

  it('subscribes and registers the reminder for 22:00 when turned on', async () => {
    const push = stubPush()

    renderAt(SETTINGS)
    await turnOn()

    await waitFor(() => expect(push.puts()).toHaveLength(1))

    const [{ url, body }] = push.puts()
    const record = parse(reminderRecordSchema, body)

    expect(url).toBe('https://prayer-log-reminder.spotify-plus-one.workers.dev/subscription')
    expect(record.subscription.endpoint).toBe(push.endpoint)
    expect(record.time).toBe('22:00')
    expect(record.completeDate).toBeNull()
    expect(record.skipNights.slice(0, 2)).toEqual(['2026-10-30', '2026-11-06'])
    expect(push.pushManager.subscribe).toHaveBeenCalledOnce()

    const [options] = push.pushManager.subscribe.mock.calls[0]

    expect(options.userVisibleOnly).toBe(true)
    expect(options.applicationServerKey).toBeInstanceOf(Uint8Array)
    expect(options.applicationServerKey).toHaveLength(65)
    expect(await reminderToggle()).toHaveAttribute('aria-checked', 'true')
  })

  it('registers the new time when it changes', async () => {
    const push = stubPush()

    renderAt(SETTINGS)
    await turnOn()
    await waitFor(() => expect(push.puts()).toHaveLength(1))
    ionChange(await ionElement('ion-datetime'), '2026-10-28T21:30:00')

    await waitFor(() => expect(push.puts()).toHaveLength(2))
    expect(push.puts()[1].body.time).toBe('21:30')
  })

  it('offers no time between 02:00 and 02:45, whose hour would run past the end of the day', async () => {
    const push = stubPush()

    renderAt(SETTINGS)
    await turnOn()
    await waitFor(() => expect(push.puts()).toHaveLength(1))

    const picker = document.querySelector('ion-datetime')

    expect(picker?.hourValues).toContain(1)
    expect(picker?.hourValues).not.toContain(2)
    expect(picker?.hourValues).toContain(3)
    expect(picker?.hourValues).toContain(23)
  })

  it('names the time picker שעה for VoiceOver, after the row that opens it', async () => {
    const push = stubPush()

    renderAt(SETTINGS)
    await turnOn()
    await waitFor(() => expect(push.puts()).toHaveLength(1))

    const datetimeButton = await ionElement('ion-datetime-button')

    const timeButton = await waitFor(() => {
      const button = datetimeButton.shadowRoot?.querySelector('#time-button')

      if (!(button instanceof HTMLElement)) {
        throw new Error('no time button')
      }

      return button
    })

    fireEvent.click(timeButton)

    await expectNamedSheet((await ionElement('ion-datetime')).closest('ion-modal'), 'שעה')
  })

  it('unsubscribes and removes the reminder when turned off', async () => {
    const push = stubPush()

    renderAt(SETTINGS)
    await turnOn()
    await waitFor(() => expect(push.puts()).toHaveLength(1))
    fireEvent.click(await reminderToggle())

    await waitFor(() =>
      expect(push.deletes()).toEqual([
        { url: 'https://prayer-log-reminder.spotify-plus-one.workers.dev/subscription', body: { endpoint: push.endpoint } },
      ]),
    )
    expect(push.subscription.unsubscribe).toHaveBeenCalledOnce()
    expect(await reminderToggle()).toHaveAttribute('aria-checked', 'false')
    expect(screen.queryByText('שעה')).not.toBeInTheDocument()
  })

  it('says the action failed when turning it off fails', async () => {
    const push = stubPush()

    vi.mocked(push.subscription.unsubscribe).mockRejectedValueOnce(new Error('Unsubscribe failed'))
    renderAt(SETTINGS)
    await turnOn()
    await waitFor(() => expect(push.puts()).toHaveLength(1))
    fireEvent.click(await reminderToggle())

    await waitFor(() => expect(toasts()).toContain('הפעולה נכשלה'))
  })

  it('goes back off and says where to allow notifications when they are refused', async () => {
    const push = stubPush()
    const refused = Object.assign(new Error('Permission denied'), { name: 'NotAllowedError' })

    push.pushManager.subscribe.mockRejectedValue(refused)
    renderAt(SETTINGS)
    await turnOn()

    await waitFor(() => expect(toasts()).toContain('ההתראות חסומות. אפשר לאפשר אותן בהגדרות של האייפון.'))
    expect(await reminderToggle()).toHaveAttribute('aria-checked', 'false')
    expect(push.fetch).not.toHaveBeenCalled()
  })
})
