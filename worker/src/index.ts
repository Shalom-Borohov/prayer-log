import { type GenericSchema, type InferOutput, safeParse } from 'valibot'
import { SUBSCRIPTION_PATH } from '../../src/reminder/config'
import { endpointOnlySchema, reminderRecordSchema } from '../../src/reminder/record'
import { APP_ORIGIN, sendReminder } from './push'
import { reminderDue } from './schedule'
import {
  deleteReminder,
  listReminders,
  markSent,
  putReminder,
  type StoredReminder,
  type SubscriptionStore,
} from './store'

export interface Env {
  SUBS: SubscriptionStore
  VAPID_PRIVATE_KEY: string
}

type CronTick = { scheduledTime: number }

type BackgroundWork = { waitUntil(promise: Promise<void>): void }

const MAX_BODY_BYTES = 16 * 1024

const PREFLIGHT_MAX_AGE_SECONDS = 86400

const CORS_HEADERS = { 'Access-Control-Allow-Origin': APP_ORIGIN }

const PREFLIGHT_HEADERS = {
  ...CORS_HEADERS,
  'Access-Control-Allow-Methods': 'PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': String(PREFLIGHT_MAX_AGE_SECONDS),
}

const HTTP_STATUS = {
  noContent: 204,
  badRequest: 400,
  notFound: 404,
  payloadTooLarge: 413,
} as const

const respond = (status: number) => new Response(null, { status, headers: CORS_HEADERS })

type ParsedBody<TSchema extends GenericSchema> =
  | { ok: true; body: InferOutput<TSchema> }
  | { ok: false; status: number }

function parseJson(text: string) {
  try {
    return { ok: true, json: JSON.parse(text) } as const
  } catch {
    return { ok: false } as const
  }
}

async function readBody<TSchema extends GenericSchema>(request: Request, schema: TSchema): Promise<ParsedBody<TSchema>> {
  const bytes = await request.arrayBuffer()
  if (bytes.byteLength > MAX_BODY_BYTES) {
    return { ok: false, status: HTTP_STATUS.payloadTooLarge }
  }

  const parsedJson = parseJson(new TextDecoder().decode(bytes))
  const parsed = parsedJson.ok ? safeParse(schema, parsedJson.json) : null

  return parsed?.success ? { ok: true, body: parsed.output } : { ok: false, status: HTTP_STATUS.badRequest }
}

async function withBody<TSchema extends GenericSchema>(
  request: Request,
  schema: TSchema,
  action: (body: InferOutput<TSchema>) => Promise<void>,
): Promise<Response> {
  const parsed = await readBody(request, schema)
  if (!parsed.ok) {
    return respond(parsed.status)
  }

  await action(parsed.body)

  return respond(HTTP_STATUS.noContent)
}

function handleSubscription(request: Request, env: Env): Promise<Response> | Response {
  if (request.method === 'PUT') {
    return withBody(request, reminderRecordSchema, (record) => putReminder(env.SUBS, record))
  }

  if (request.method === 'DELETE') {
    return withBody(request, endpointOnlySchema, ({ endpoint }) => deleteReminder(env.SUBS, endpoint))
  }

  return respond(HTTP_STATUS.notFound)
}

async function handleFetch(request: Request, env: Env): Promise<Response> {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: HTTP_STATUS.noContent, headers: PREFLIGHT_HEADERS })
  }

  if (new URL(request.url).pathname === SUBSCRIPTION_PATH) {
    return handleSubscription(request, env)
  }

  return respond(HTTP_STATUS.notFound)
}

async function remindIfDue(env: Env, stored: StoredReminder, now: number): Promise<void> {
  const date = reminderDue(stored, now)
  if (!date) {
    return
  }

  const outcome = await sendReminder(env.VAPID_PRIVATE_KEY, stored.subscription)

  if (outcome === 'gone') {
    await deleteReminder(env.SUBS, stored.subscription.endpoint)
  } else if (outcome === 'sent') {
    await markSent(env.SUBS, stored.subscription.endpoint, date)
  }
}

async function sendDueReminders(env: Env, now: number): Promise<void> {
  const reminders = await listReminders(env.SUBS)

  const results = await Promise.allSettled(reminders.map((stored) => remindIfDue(env, stored, now)))
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(result.reason)
    }
  }
}

function handleScheduled(controller: CronTick, env: Env, ctx: BackgroundWork): void {
  ctx.waitUntil(sendDueReminders(env, controller.scheduledTime))
}

export default { fetch: handleFetch, scheduled: handleScheduled }
