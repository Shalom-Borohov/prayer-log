import {
  IonContent,
  IonHeader,
  IonLabel,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  type SegmentValue,
} from '@ionic/react'
import { useState } from 'react'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { hasLearningLog } from '../../domain/learningLog'
import { streaks } from '../../domain/streaks'
import { periodRange, periodTotals, type StatsPeriod } from '../../domain/totals'
import type { DayRecord } from '../../domain/types'
import { useToday } from '../../hooks/useToday'
import { STATS_COPY } from './copy'
import { DetailTable } from './DetailTable'
import { HeadlineNumber } from './HeadlineNumber'
import { LearningLogEntrance } from './LearningLogEntrance'
import { PeriodFigures } from './PeriodFigures'
import { periodShelves } from './periodShelves'
import { PrayerShelves } from './PrayerShelves'
import { TrendColumns } from './TrendColumns'
import { WornCard } from './WornCard'
import './stats.css'

const isPeriod = (selected: SegmentValue | undefined): selected is StatsPeriod =>
  selected === 'week' || selected === 'month' || selected === 'all'

interface PeriodStatsProps {
  records: DayRecord[]
  period: StatsPeriod
  today: string
}

function PeriodStats({ records, period, today }: PeriodStatsProps) {
  const range = periodRange(period, records, today)
  const totals = periodTotals(records, range.from, range.to, today)

  return (
    <>
      <HeadlineNumber prayers={totals.prayers} />
      {period === 'all' && <TrendColumns records={records} range={range} today={today} />}
      <PrayerShelves
        period={period}
        totals={totals}
        streaks={streaks(records, today)}
        shelves={periodShelves(records, period, today)}
      />
      <PeriodFigures totals={totals} />
      <DetailTable totals={totals} />
      <WornCard totals={totals} />
      {hasLearningLog(records, today) && <LearningLogEntrance />}
    </>
  )
}

export function StatsPage() {
  const today = useToday()
  const records = useAllDays()
  const [period, setPeriod] = useState<StatsPeriod>('week')

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <SettingsButton tab="stats" />
          <IonTitle>{COMMON_COPY.stats}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="app-header">
          <IonToolbar>
            <IonTitle size="large">{COMMON_COPY.stats}</IonTitle>
          </IonToolbar>
        </IonHeader>
        {records && records.length === 0 && (
          <div className="empty-state">
            <h2>{COMMON_COPY.noData}</h2>
            <p>{STATS_COPY.emptyBody}</p>
          </div>
        )}
        {records && records.length > 0 && (
          <>
            <IonSegment
              className="inset-segment stats-period"
              value={period}
              onIonChange={(event) => isPeriod(event.detail.value) && setPeriod(event.detail.value)}
            >
              <IonSegmentButton value="week">
                <IonLabel>{COMMON_COPY.thisWeek}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="month">
                <IonLabel>{STATS_COPY.thisMonth}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="all">
                <IonLabel>{STATS_COPY.allTime}</IonLabel>
              </IonSegmentButton>
            </IonSegment>
            <PeriodStats records={records} period={period} today={today} />
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
