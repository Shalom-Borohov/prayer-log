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
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { monthRange, weekRange } from '../../domain/totals'
import { useToday } from '../../hooks/useToday'
import { SETTINGS_PATH } from '../../navigation/paths'
import { STATS_COPY } from './copy'
import { PeriodShelves, PeriodTable, StreakTable } from './StatsTables'
import './stats.css'

type Period = 'week' | 'month'

const isPeriod = (selected: SegmentValue | undefined): selected is Period => selected === 'week' || selected === 'month'

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
            <IonButton aria-label={COMMON_COPY.settings} routerLink={SETTINGS_PATH}>
              <IonIcon slot="icon-only" icon={settingsOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{COMMON_COPY.stats}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="leather-header">
          <IonToolbar>
            <IonTitle size="large">{COMMON_COPY.stats}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {records && records.length === 0 && (
          <div className="empty-state">
            <h2>{STATS_COPY.emptyTitle}</h2>
            <p>{STATS_COPY.emptyBody}</p>
          </div>
        )}
        {records && records.length > 0 && (
          <>
            <IonSegment
              className="inset-segment"
              value={period}
              onIonChange={(event) => isPeriod(event.detail.value) && setPeriod(event.detail.value)}
            >
              <IonSegmentButton value="week">
                <IonLabel>{COMMON_COPY.thisWeek}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="month">
                <IonLabel>{STATS_COPY.thisMonth}</IonLabel>
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
