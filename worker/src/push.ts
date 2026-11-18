import { buildPushHTTPRequest } from '@pushforge/builder'
import { TODAY_PATH } from '../../src/navigation/paths'
import { REMINDER_COPY } from '../../src/reminder/copy'
import type { ReminderRecord } from '../../src/reminder/record'

export const APP_ORIGIN = 'https://shalom-borohov.github.io'

const APP_URL = `${APP_ORIGIN}/prayer-log/`

const DECLARATIVE_WEB_PUSH_MAGIC = 8030

const PUSH_TTL_SECONDS = 3600

const REMINDER_TOPIC = 'evening'

const SUBSCRIPTION_GONE_STATUSES = [404, 410]

export type PushOutcome = 'sent' | 'gone' | 'failed'

const reminderPayload = {
  web_push: DECLARATIVE_WEB_PUSH_MAGIC,
  mutable: true,
  notification: { title: REMINDER_COPY.title, body: REMINDER_COPY.someMissing, navigate: `${APP_URL}#${TODAY_PATH}` },
}

export async function sendReminder(
  privateJwk: string,
  subscription: ReminderRecord['subscription'],
): Promise<PushOutcome> {
  const { endpoint, headers, body } = await buildPushHTTPRequest({
    privateJWK: privateJwk,
    subscription: { endpoint: subscription.endpoint, keys: subscription.keys },
    message: {
      payload: reminderPayload,
      adminContact: APP_URL,
      options: { ttl: PUSH_TTL_SECONDS, urgency: 'high', topic: REMINDER_TOPIC },
    },
  })

  const response = await fetch(endpoint, { method: 'POST', headers, body })

  if (response.ok) {
    return 'sent'
  }

  return SUBSCRIPTION_GONE_STATUSES.includes(response.status) ? 'gone' : 'failed'
}
