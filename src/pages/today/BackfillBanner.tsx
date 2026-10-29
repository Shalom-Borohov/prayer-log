import { IonItem, IonLabel, IonList } from '@ionic/react'
import { backfillReminders } from '../../domain/backfill'
import type { DayRecord } from '../../domain/types'
import { reminderLabel } from './reminderLabel'

interface BackfillBannerProps {
  records: DayRecord[]
  today: string
  onOpen: (date: string) => void
}

export function BackfillBanner({ records, today, onOpen }: BackfillBannerProps) {
  const reminders = backfillReminders(records, today)

  if (reminders.length === 0) {
    return null
  }

  return (
    <IonList inset className="backfill">
      {reminders.map((reminder) => (
        <IonItem key={reminder.date} button detail onClick={() => onOpen(reminder.date)}>
          <IonLabel>{reminderLabel(reminder)}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  )
}
