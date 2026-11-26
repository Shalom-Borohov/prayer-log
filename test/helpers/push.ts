import { onTestFinished, vi } from 'vitest'

const ENDPOINT = 'https://web.push.apple.com/test-endpoint'

const NO_CONTENT = 204

interface FakeSubscription {
  endpoint: string
  toJSON(): PushSubscriptionJSON
  unsubscribe(): Promise<boolean>
}

export function stubPush() {
  let current: FakeSubscription | null = null

  const subscription: FakeSubscription = {
    endpoint: ENDPOINT,
    toJSON: () => ({ endpoint: ENDPOINT, expirationTime: null, keys: { p256dh: 'test-p256dh', auth: 'test-auth' } }),
    unsubscribe: vi.fn(async () => {
      current = null

      return true
    }),
  }

  const pushManager = {
    subscribe: vi.fn(async (_options: PushSubscriptionOptionsInit) => {
      current = subscription

      return subscription
    }),
    getSubscription: vi.fn(async () => current),
  }

  const fetch = vi.fn<typeof globalThis.fetch>(async () => new Response(null, { status: NO_CONTENT }))

  class FakeNotification {
    static permission: NotificationPermission = 'granted'
  }

  Object.defineProperty(navigator, 'serviceWorker', {
    value: { ready: Promise.resolve({ pushManager }) },
    configurable: true,
  })
  vi.stubGlobal('PushManager', class {})
  vi.stubGlobal('Notification', FakeNotification)
  vi.stubGlobal('fetch', fetch)
  onTestFinished(() => {
    Reflect.deleteProperty(navigator, 'serviceWorker')
    vi.unstubAllGlobals()
  })

  const requests = (method: string) =>
    fetch.mock.calls
      .filter(([_url, init]) => init?.method === method)
      .map(([url, init]) => ({ url: String(url), body: JSON.parse(String(init?.body)) }))

  return {
    endpoint: ENDPOINT,
    pushManager,
    subscription,
    fetch,
    puts: () => requests('PUT'),
    deletes: () => requests('DELETE'),
    alreadySubscribed: () => {
      current = subscription
    },
    revokePermission: () => {
      FakeNotification.permission = 'denied'
    },
    failRequests: () => fetch.mockRejectedValue(new TypeError('Load failed')),
    answerRequests: () => fetch.mockImplementation(async () => new Response(null, { status: NO_CONTENT })),
  }
}
