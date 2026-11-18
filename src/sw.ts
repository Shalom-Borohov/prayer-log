import { cleanupOutdatedCaches, createHandlerBoundToURL, precacheAndRoute } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { db } from './data/db'
import { logicalToday } from './domain/logicalDay'
import { TODAY_PATH } from './navigation/paths'
import { REMINDER_COPY } from './reminder/copy'
import { type ReminderNotification, reminderNotification } from './sw/notification'

declare let self: ServiceWorkerGlobalScope

const SKIP_WAITING = 'SKIP_WAITING'

const REMINDER_TAG = 'reminder'

const APP_SHELL = 'index.html'

const todayUrl = () => `${self.registration.scope}#${TODAY_PATH}`

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)
registerRoute(new NavigationRoute(createHandlerBoundToURL(APP_SHELL)))

self.addEventListener('message', (event) => {
  if (event.data?.type === SKIP_WAITING) {
    void self.skipWaiting()
  }
})

async function todayNotification(): Promise<ReminderNotification> {
  try {
    const today = logicalToday(Date.now())

    return reminderNotification(await db.days.get(today), today)
  } catch {
    return { title: REMINDER_COPY.title, body: REMINDER_COPY.someMissing }
  }
}

async function showReminder() {
  const { title, body } = await todayNotification()

  await self.registration.showNotification(title, { body, tag: REMINDER_TAG })
}

async function openToday() {
  const url = todayUrl()
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
  const [open] = windows

  if (open) {
    await open.focus()
    await open.navigate(url)

    return
  }

  await self.clients.openWindow(url)
}

self.addEventListener('push', (event) => {
  event.waitUntil(showReminder())
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(openToday())
})
