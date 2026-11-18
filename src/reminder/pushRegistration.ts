import { useEffect, useState } from 'react'

export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

export function usePushRegistration(): ServiceWorkerRegistration | null {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if (!pushSupported()) {
      return
    }

    let active = true

    void navigator.serviceWorker.ready.then((ready) => active && setRegistration(ready))

    return () => {
      active = false
    }
  }, [])

  return registration
}
