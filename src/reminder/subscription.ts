import { REMINDER_WORKER_URL, SUBSCRIPTION_PATH, VAPID_PUBLIC_KEY } from './config'
import type { ReminderRecord } from './record'
import { saveReminderSettings } from './reminderSettings'

const SUBSCRIPTION_URL = `${REMINDER_WORKER_URL}${SUBSCRIPTION_PATH}`

function base64UrlBytes(base64Url: string): Uint8Array<ArrayBuffer> {
  const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/')

  return Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
}

async function send(method: 'PUT' | 'DELETE', body: object): Promise<boolean> {
  try {
    const response = await fetch(SUBSCRIPTION_URL, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })

    return response.ok
  } catch {
    return false
  }
}

export const sendRecord = (record: ReminderRecord) => send('PUT', record)

export async function enableReminder(registration: ServiceWorkerRegistration, time: string) {
  await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: base64UrlBytes(VAPID_PUBLIC_KEY),
  })
  saveReminderSettings({ enabled: true, time })
}

export async function disableReminder(registration: ServiceWorkerRegistration, time: string) {
  saveReminderSettings({ enabled: false, time })

  const subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    return
  }

  const { endpoint } = subscription

  await subscription.unsubscribe()
  await send('DELETE', { endpoint })
}
