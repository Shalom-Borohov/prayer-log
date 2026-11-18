import { useSyncExternalStore } from 'react'
import { boolean, type InferOutput, object, safeParse } from 'valibot'
import { createStoreSignal } from '../hooks/storeSignal'
import { DEFAULT_REMINDER_TIME } from './config'
import { reminderRecordSchema } from './record'

const SETTINGS_KEY = 'reminder-settings'

const LAST_SENT_KEY = 'reminder-last-sent'

const settingsSchema = object({ enabled: boolean(), time: reminderRecordSchema.entries.time })

export type ReminderSettings = InferOutput<typeof settingsSchema>

const DEFAULT_SETTINGS: ReminderSettings = { enabled: false, time: DEFAULT_REMINDER_TIME }

const settingsSignal = createStoreSignal()

let cached: { stored: string | null; settings: ReminderSettings } = { stored: null, settings: DEFAULT_SETTINGS }

function parseSettings(stored: string | null): ReminderSettings {
  if (stored === null) {
    return DEFAULT_SETTINGS
  }

  try {
    const parsed = safeParse(settingsSchema, JSON.parse(stored))

    return parsed.success ? parsed.output : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function readReminderSettings(): ReminderSettings {
  const stored = localStorage.getItem(SETTINGS_KEY)

  if (stored !== cached.stored) {
    cached = { stored, settings: parseSettings(stored) }
  }

  return cached.settings
}

export function saveReminderSettings(settings: ReminderSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))

  if (!settings.enabled) {
    localStorage.removeItem(LAST_SENT_KEY)
  }

  settingsSignal.notify()
}

export const readLastSent = () => localStorage.getItem(LAST_SENT_KEY)

export const saveLastSent = (signature: string) => localStorage.setItem(LAST_SENT_KEY, signature)

export const useReminderSettings = () => useSyncExternalStore(settingsSignal.subscribe, readReminderSettings)
