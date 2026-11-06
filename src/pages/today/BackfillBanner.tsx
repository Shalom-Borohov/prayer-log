import { IonItem, IonLabel, IonList } from '@ionic/react'
import { useLastBackup } from '../../backup/lastBackup'
import { useExportBackup } from '../../backup/useExportBackup'
import { backfillReminders } from '../../domain/backfill'
import { backupReminder } from '../../domain/backupReminder'
import type { DayRecord } from '../../domain/types'
import { backupReminderLabel, reminderLabel } from './reminderLabel'

interface BackfillBannerProps {
  records: DayRecord[]
  today: string
  onOpen: (date: string) => void
}

export function BackfillBanner({ records, today, onOpen }: BackfillBannerProps) {
  const reminders = backfillReminders(records, today)
  const lastBackup = useLastBackup()
  const backup = backupReminder(records, lastBackup, today)
  const exportData = useExportBackup()

  if (reminders.length === 0 && backup === null) {
    return null
  }

  return (
    <IonList inset className="backfill">
      {reminders.map((reminder) => (
        <IonItem key={reminder.date} button detail onClick={() => onOpen(reminder.date)}>
          <IonLabel>{reminderLabel(reminder)}</IonLabel>
        </IonItem>
      ))}
      {backup && (
        <IonItem button detail={false} onClick={exportData}>
          <IonLabel>{backupReminderLabel(backup)}</IonLabel>
        </IonItem>
      )}
    </IonList>
  )
}
