import { useEffect, useMemo } from 'react'
import { safeParse } from 'valibot'
import { useAllPrayersMarked } from '../data/hooks'
import { skipNights } from '../domain/reminder'
import { useToday } from '../hooks/useToday'
import { SKIP_NIGHTS_AHEAD } from './config'
import { usePushRegistration } from './pushRegistration'
import { pushSubscriptionSchema, type ReminderRecord } from './record'
import { readLastSent, saveLastSent, saveReminderSettings, useReminderSettings } from './reminderSettings'
import { disableReminder, sendRecord } from './subscription'

type ReminderState = Pick<ReminderRecord, 'time' | 'completeDate' | 'skipNights'>

const NOTIFICATIONS_ALLOWED: NotificationPermission = 'granted'

async function syncReminder(registration: ServiceWorkerRegistration, state: ReminderState, today: string) {
  if (Notification.permission !== NOTIFICATIONS_ALLOWED) {
    await disableReminder(registration, state.time)

    return
  }

  const subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    saveReminderSettings({ enabled: false, time: state.time })

    return
  }

  const parsed = safeParse(pushSubscriptionSchema, subscription.toJSON())

  if (!parsed.success) {
    return
  }

  const record: ReminderRecord = {
    ...state,
    subscription: parsed.output,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  }

  const signature = JSON.stringify({ sentOn: today, record })

  if (signature !== readLastSent() && (await sendRecord(record))) {
    saveLastSent(signature)
  }
}

export function useReminderSync() {
  const registration = usePushRegistration()
  const { enabled, time } = useReminderSettings()
  const today = useToday()
  const allMarked = useAllPrayersMarked(today)
  const nights = useMemo(() => (enabled ? skipNights(today, SKIP_NIGHTS_AHEAD) : []), [enabled, today])

  useEffect(() => {
    if (!registration || !enabled || allMarked === undefined) {
      return
    }

    const completeDate = allMarked ? today : null
    const sync = () => void syncReminder(registration, { time, completeDate, skipNights: nights }, today)

    function syncWhenVisible() {
      if (document.visibilityState === 'visible') {
        sync()
      }
    }

    sync()
    document.addEventListener('visibilitychange', syncWhenVisible)
    window.addEventListener('online', sync)

    return () => {
      document.removeEventListener('visibilitychange', syncWhenVisible)
      window.removeEventListener('online', sync)
    }
  }, [registration, enabled, time, today, allMarked, nights])
}
