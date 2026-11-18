import { object, safeParse } from 'valibot'
import { type ReminderRecord, reminderRecordSchema } from '../../src/reminder/record'

export type StoredReminder = ReminderRecord & { lastSentDate: string | null }

export interface SubscriptionStore {
  get(key: string): Promise<string | null>
  put(key: string, json: string): Promise<void>
  delete(key: string): Promise<void>
  list(options: { prefix: string; cursor?: string }): Promise<KeyPage>
}

type KeyPage = { keys: { name: string }[] } & ({ list_complete: true } | { list_complete: false; cursor: string })

const KEY_PREFIX = 'sub:'

const HEX_RADIX = 16

const storedReminderSchema = object({
  ...reminderRecordSchema.entries,
  lastSentDate: reminderRecordSchema.entries.completeDate,
})

async function keyFor(endpoint: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(endpoint))
  const hex = [...new Uint8Array(digest)].map((byte) => byte.toString(HEX_RADIX).padStart(2, '0')).join('')

  return KEY_PREFIX + hex
}

async function readReminder(store: SubscriptionStore, key: string): Promise<StoredReminder | null> {
  const json = await store.get(key)
  if (json === null) {
    return null
  }

  const parsed = safeParse(storedReminderSchema, JSON.parse(json))

  return parsed.success ? parsed.output : null
}

export async function putReminder(store: SubscriptionStore, record: ReminderRecord): Promise<void> {
  const key = await keyFor(record.subscription.endpoint)
  const existing = await readReminder(store, key)
  const stored: StoredReminder = { ...record, lastSentDate: existing?.lastSentDate ?? null }

  await store.put(key, JSON.stringify(stored))
}

export async function deleteReminder(store: SubscriptionStore, endpoint: string): Promise<void> {
  await store.delete(await keyFor(endpoint))
}

export async function markSent(store: SubscriptionStore, endpoint: string, date: string): Promise<void> {
  const key = await keyFor(endpoint)
  const current = await readReminder(store, key)

  if (!current) {
    return
  }

  const sent: StoredReminder = { ...current, lastSentDate: date }

  await store.put(key, JSON.stringify(sent))
}

async function listKeys(store: SubscriptionStore): Promise<string[]> {
  const names: string[] = []
  let cursor: string | undefined

  do {
    const page = await store.list({ prefix: KEY_PREFIX, cursor })

    names.push(...page.keys.map((key) => key.name))
    cursor = page.list_complete ? undefined : page.cursor
  } while (cursor)

  return names
}

export async function listReminders(store: SubscriptionStore): Promise<StoredReminder[]> {
  const reminders = await Promise.all((await listKeys(store)).map((key) => readReminder(store, key)))

  return reminders.filter((stored) => stored !== null)
}
