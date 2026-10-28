import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  type SegmentValue,
} from '@ionic/react'
import { settingsOutline } from 'ionicons/icons'
import { useState } from 'react'
import { useAllDays } from '../../data/hooks'
import { monthRange, weekRange } from '../../domain/totals'
import { useToday } from '../../hooks/useToday'
import { PeriodShelves, PeriodTable, StreakTable } from './StatsTables'
import './stats.css'

type Period = 'week' | 'month'

const isPeriod = (value: SegmentValue | undefined): value is Period => value === 'week' || value === 'month'

export function StatsPage() {
  const today = useToday()
  const records = useAllDays()
  const [period, setPeriod] = useState<Period>('week')
  const range = period === 'week' ? weekRange(today) : monthRange(today)

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton aria-label="הגדרות" routerLink="/tabs/stats/settings">
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>סטטיסטיקה</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="leather-header">
          <IonToolbar>
            <IonTitle size="large">סטטיסטיקה</IonTitle>
          </IonToolbar>
        </IonHeader>
        {records && records.length === 0 && (
          <div className="empty-state">
            <h2>עוד אין נתונים</h2>
            <p>מסמנים תפילה במסך היום, והסיכומים והרצפים יופיעו כאן.</p>
          </div>
        )}
        {records && records.length > 0 && (
          <>
            <IonSegment
              className="period-segment"
              value={period}
              onIonChange={(event) => isPeriod(event.detail.value) && setPeriod(event.detail.value)}
            >
              <IonSegmentButton value="week">
                <IonLabel>השבוע</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="month">
                <IonLabel>החודש</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            <PeriodTable records={records} range={range} today={today} />
            <PeriodShelves records={records} range={range} today={today} />
            <StreakTable records={records} today={today} />
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
