import { IonItem, IonLabel, IonList } from '@ionic/react'
import { backfillReminders } from '../../domain/backfill'
import { blankMaarivLabel, emptyDayLabel } from '../../domain/format'
import type { DayRecord } from '../../domain/types'

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
      {reminders.map(({ date, kind }) => (
        <IonItem key={date} button detail onClick={() => onOpen(date)}>
          <IonLabel>{kind === 'empty' ? emptyDayLabel(date) : blankMaarivLabel(date)}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  )
}
