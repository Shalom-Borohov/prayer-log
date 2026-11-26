import {
  IonDatetime,
  IonDatetimeButton,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonToggle,
} from '@ionic/react'
import { useState } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { ROLLOVER_HOUR } from '../../domain/logicalDay'
import { useToast } from '../../hooks/useToast'
import { pushSupported, usePushRegistration } from '../../reminder/pushRegistration'
import { saveReminderSettings, useReminderSettings } from '../../reminder/reminderSettings'
import { disableReminder, enableReminder } from '../../reminder/subscription'
import { nameSheet } from '../../sheets/sheetName'
import { SETTINGS_COPY } from './copy'

const TIME_PICKER_ID = 'reminder-time'

const QUARTER_HOURS = '0,15,30,45'

const HOURS_PER_DAY = 24

const LAST_HOUR_OF_LOGICAL_DAY = ROLLOVER_HOUR - 1

const PICKABLE_HOURS = Array.from({ length: HOURS_PER_DAY }, (_, hour) => hour).filter(
  (hour) => hour !== LAST_HOUR_OF_LOGICAL_DAY,
)

const TIME_OF_DAY = /\d{2}:\d{2}/

const PERMISSION_REFUSED = 'NotAllowedError'

const pickedTime = (picked: string | string[] | null | undefined) =>
  typeof picked === 'string' ? picked.match(TIME_OF_DAY)?.[0] : undefined

const isPermissionRefused = (error: unknown) => error instanceof Error && error.name === PERMISSION_REFUSED

export function ReminderSettings() {
  const registration = usePushRegistration()
  const { enabled, time } = useReminderSettings()
  const [turningOn, setTurningOn] = useState(false)
  const { toast } = useToast()

  async function turnOn(pushRegistration: ServiceWorkerRegistration) {
    setTurningOn(true)

    try {
      await enableReminder(pushRegistration, time)
    } catch (error) {
      void toast(isPermissionRefused(error) ? SETTINGS_COPY.notificationsBlocked : COMMON_COPY.actionFailed)
    } finally {
      setTurningOn(false)
    }
  }

  async function turnOff(pushRegistration: ServiceWorkerRegistration) {
    try {
      await disableReminder(pushRegistration, time)
    } catch {
      void toast(COMMON_COPY.actionFailed)
    }
  }

  function toggle(checked: boolean) {
    if (!registration) {
      return
    }

    if (checked) {
      void turnOn(registration)
    } else {
      void turnOff(registration)
    }
  }

  function changeTime(picked: string | string[] | null | undefined) {
    const newTime = pickedTime(picked)

    if (newTime) {
      saveReminderSettings({ enabled, time: newTime })
    }
  }

  return (
    <>
      <IonListHeader>
        <IonLabel>{SETTINGS_COPY.reminder}</IonLabel>
      </IonListHeader>
      <IonList inset>
        <IonItem>
          <IonToggle
            disabled={!registration || turningOn}
            checked={enabled || turningOn}
            onIonChange={(event) => toggle(event.detail.checked)}
          >
            {SETTINGS_COPY.eveningReminder}
          </IonToggle>
        </IonItem>
        {enabled && (
          <IonItem>
            <IonLabel>{SETTINGS_COPY.reminderTime}</IonLabel>
            <IonDatetimeButton slot="end" datetime={TIME_PICKER_ID} />
          </IonItem>
        )}
      </IonList>
      <IonNote className="list-footer">
        {pushSupported() ? SETTINGS_COPY.reminderNote : SETTINGS_COPY.reminderNeedsHomeScreen}
      </IonNote>
      <IonModal keepContentsMounted onWillPresent={nameSheet(SETTINGS_COPY.reminderTime)}>
        <IonDatetime
          id={TIME_PICKER_ID}
          presentation="time"
          locale="he"
          hourCycle="h23"
          hourValues={PICKABLE_HOURS}
          minuteValues={QUARTER_HOURS}
          value={time}
          onIonChange={(event) => changeTime(event.detail.value)}
        />
      </IonModal>
    </>
  )
}
