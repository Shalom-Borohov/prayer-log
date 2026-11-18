import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ReminderRecord } from '../../src/reminder/record'
import worker, { type Env } from '../../worker/src/index'
import type { SubscriptionStore } from '../../worker/src/store'

const workerUrl = 'https://prayer-log-reminder.example.workers.dev'

const appOrigin = 'https://shalom-borohov.github.io'

function fakeKv(): SubscriptionStore & { entries: Map<string, string> } {
  const entries = new Map<string, string>()

  return {
    entries,
    get: async (key: string) => entries.get(key) ?? null,
    put: async (key: string, json: string) => {
      entries.set(key, json)
    },
    delete: async (key: string) => {
      entries.delete(key)
    },
    list: async ({ prefix }: { prefix: string }) => ({
      keys: [...entries.keys()].filter((key) => key.startsWith(prefix)).map((name) => ({ name })),
      list_complete: true,
    }),
  }
}

function fakeEnv(vapidPrivateKey = '{}') {
  const kv = fakeKv()
  const env: Env = { SUBS: kv, VAPID_PRIVATE_KEY: vapidPrivateKey }

  return { env, kv }
}

const validRecord: ReminderRecord = {
  subscription: { endpoint: 'https://web.push.apple.com/device-token', keys: { p256dh: 'key', auth: 'secret' } },
  time: '22:00',
  timeZone: 'Asia/Jerusalem',
  completeDate: null,
  skipNights: ['2026-11-20'],
}

const putRecord = (env: Env, record: object) =>
  worker.fetch(
    new Request(`${workerUrl}/subscription`, {
      method: 'PUT',
      headers: { Origin: appOrigin, 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    }),
    env,
  )

describe('reminder worker fetch', () => {
  it('answers the app’s CORS preflight', async () => {
    const response = await worker.fetch(
      new Request(`${workerUrl}/subscription`, { method: 'OPTIONS', headers: { Origin: appOrigin } }),
      fakeEnv().env,
    )

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(appOrigin)
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('PUT, DELETE, OPTIONS')
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type')
    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
  })

  it('never allows another origin', async () => {
    const response = await worker.fetch(
      new Request(`${workerUrl}/subscription`, { method: 'OPTIONS', headers: { Origin: 'https://evil.example' } }),
      fakeEnv().env,
    )

    expect(response.headers.get('Access-Control-Allow-Origin')).not.toBe('https://evil.example')
  })

  it('answers 404 for any other route, still with CORS', async () => {
    const response = await worker.fetch(new Request(`${workerUrl}/other`, { method: 'GET' }), fakeEnv().env)

    expect(response.status).toBe(404)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(appOrigin)
  })

  it('stores a valid record', async () => {
    const { env, kv } = fakeEnv()
    const response = await putRecord(env, validRecord)

    expect(response.status).toBe(204)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe(appOrigin)
    expect(kv.entries.size).toBe(1)
  })

  it('keeps one record per endpoint', async () => {
    const { env, kv } = fakeEnv()
    await putRecord(env, validRecord)
    await putRecord(env, { ...validRecord, time: '21:15' })

    expect(kv.entries.size).toBe(1)
  })

  it('rejects a record that fails validation', async () => {
    const { env, kv } = fakeEnv()
    const response = await putRecord(env, { ...validRecord, time: '22:10' })

    expect(response.status).toBe(400)
    expect(kv.entries.size).toBe(0)
  })

  it('rejects an endpoint that is not https', async () => {
    const { env, kv } = fakeEnv()

    const response = await putRecord(env, {
      ...validRecord,
      subscription: { ...validRecord.subscription, endpoint: 'http://169.254.169.254/latest' },
    })

    expect(response.status).toBe(400)
    expect(kv.entries.size).toBe(0)
  })

  it('rejects a body that is not JSON', async () => {
    const { env } = fakeEnv()
    const response = await worker.fetch(
      new Request(`${workerUrl}/subscription`, { method: 'PUT', body: 'not json' }),
      env,
    )

    expect(response.status).toBe(400)
  })

  it('rejects a body over 16 KB', async () => {
    const { env, kv } = fakeEnv()
    const response = await putRecord(env, { ...validRecord, padding: 'x'.repeat(17 * 1024) })

    expect(response.status).toBe(413)
    expect(kv.entries.size).toBe(0)
  })

  it('deletes the record for an endpoint', async () => {
    const { env, kv } = fakeEnv()
    await putRecord(env, validRecord)
    const response = await worker.fetch(
      new Request(`${workerUrl}/subscription`, {
        method: 'DELETE',
        body: JSON.stringify({ endpoint: validRecord.subscription.endpoint }),
      }),
      env,
    )

    expect(response.status).toBe(204)
    expect(kv.entries.size).toBe(0)
  })

  it('rejects a delete without an endpoint', async () => {
    const { env } = fakeEnv()
    const response = await worker.fetch(
      new Request(`${workerUrl}/subscription`, { method: 'DELETE', body: JSON.stringify({}) }),
      env,
    )

    expect(response.status).toBe(400)
  })
})

const toBase64Url = (bytes: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '')

async function vapidPrivateKey() {
  const pair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])

  return JSON.stringify(await crypto.subtle.exportKey('jwk', pair.privateKey))
}

async function deviceSubscription(endpoint: string) {
  const pair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits'])
  const publicKey = await crypto.subtle.exportKey('raw', pair.publicKey)

  return { endpoint, keys: { p256dh: toBase64Url(publicKey), auth: toBase64Url(crypto.getRandomValues(new Uint8Array(16))) } }
}

function fakeContext() {
  const pending: Promise<unknown>[] = []

  return {
    ctx: { waitUntil: (promise: Promise<unknown>) => pending.push(promise) },
    settle: () => Promise.all(pending),
  }
}

async function runCron(env: Env, scheduledTime: number) {
  const { ctx, settle } = fakeContext()
  worker.scheduled({ scheduledTime }, env, ctx)
  await settle()
}

const tenPmInJerusalem = Date.UTC(2026, 10, 18, 20, 0)

const quarterHour = 15 * 60 * 1000

const pushService = (status: number) => vi.fn<typeof fetch>(async () => new Response(null, { status }))

describe('reminder worker cron', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function subscribedEnv(record: Partial<typeof validRecord> = {}) {
    const { env, kv } = fakeEnv(await vapidPrivateKey())
    const subscription = await deviceSubscription('https://web.push.apple.com/device-token')
    await putRecord(env, { ...validRecord, ...record, subscription })

    return { env, kv }
  }

  it('sends one push when the reminder is due, and not again that night', async () => {
    const { env } = await subscribedEnv()
    const sendPush = pushService(201)
    vi.stubGlobal('fetch', sendPush)

    await runCron(env, tenPmInJerusalem)
    await runCron(env, tenPmInJerusalem + quarterHour)

    expect(sendPush).toHaveBeenCalledTimes(1)
    const [endpoint, init] = sendPush.mock.calls[0]
    expect(endpoint).toBe('https://web.push.apple.com/device-token')
    expect(new Headers(init?.headers).get('TTL')).toBe('3600')
    expect(new Headers(init?.headers).get('Urgency')).toBe('high')
  })

  it('sends nothing when the reminder is not due', async () => {
    const { env } = await subscribedEnv({ completeDate: '2026-11-18' })
    const sendPush = pushService(201)
    vi.stubGlobal('fetch', sendPush)

    await runCron(env, tenPmInJerusalem)
    await runCron(env, tenPmInJerusalem - 2 * quarterHour)

    expect(sendPush).not.toHaveBeenCalled()
  })

  it('deletes a subscription the push service says is gone', async () => {
    const { env, kv } = await subscribedEnv()
    vi.stubGlobal('fetch', pushService(410))

    await runCron(env, tenPmInJerusalem)

    expect(kv.entries.size).toBe(0)
  })

  it('retries on the next tick after the push service fails', async () => {
    const { env, kv } = await subscribedEnv()
    const sendPush = pushService(201).mockResolvedValueOnce(new Response(null, { status: 503 }))
    vi.stubGlobal('fetch', sendPush)

    await runCron(env, tenPmInJerusalem)
    await runCron(env, tenPmInJerusalem + quarterHour)

    expect(sendPush).toHaveBeenCalledTimes(2)
    expect(kv.entries.size).toBe(1)
  })

  it('keeps a record the phone replaced while the push was being sent', async () => {
    const { env, kv } = await subscribedEnv()
    const [storedJson] = kv.entries.values()
    const { subscription } = JSON.parse(storedJson)

    vi.stubGlobal(
      'fetch',
      vi.fn<typeof fetch>(async () => {
        await putRecord(env, { ...validRecord, subscription, time: '23:00' })

        return new Response(null, { status: 201 })
      }),
    )

    await runCron(env, tenPmInJerusalem)

    const [updatedJson] = kv.entries.values()

    expect(JSON.parse(updatedJson)).toMatchObject({ time: '23:00', lastSentDate: '2026-11-18' })
  })
})
