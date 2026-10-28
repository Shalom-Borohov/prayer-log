import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { useAllDays } from '../../data/hooks'
import { gregorianLabel, weekdayName } from '../../domain/format'
import { hebrewDateLabel, holidayNames } from '../../domain/hebrewCalendar'
import { addDays } from '../../domain/logicalDay'
import { prayersForDay } from '../../domain/prayersForDay'
import { shelfSlots } from '../../domain/shelf'
import { streaks } from '../../domain/streaks'
import { BackfillBanner } from './BackfillBanner'
import { type DayTab, dayPath } from './dayPath'
import { PrayerRow } from './PrayerRow'
import { TorahRow } from './TorahRow'
import { WeekSummary } from './WeekSummary'
import './day.css'

const SHELF_DAYS = 7

export function DayView({ date, today, tab }: { date: string; today: string; tab: DayTab }) {
  const records = useAllDays()
  const record = records?.find((day) => day.date === date)
  const dayStreaks = records && streaks(records, date, today)
  const router = useIonRouter()
  const title = date === today ? 'היום' : weekdayName(date)
  const holidays = holidayNames(date)

  const go = (target: string) => router.push(dayPath(tab, target, today), 'none', 'replace')

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          {tab === 'calendar' && (
            <IonButtons slot="start">
              <IonBackButton defaultHref="/tabs/calendar" text="לוח" />
            </IonButtons>
          )}
          <IonButtons slot="end">
            <IonButton aria-label="היום הקודם" onClick={() => go(addDays(date, -1))}>
              <IonIcon slot="icon-only" icon={chevronForward} />
            </IonButton>
            <IonButton aria-label="היום הבא" disabled={date >= today} onClick={() => go(addDays(date, 1))}>
              <IonIcon slot="icon-only" icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="leather-header">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="day-heading">
          <p>{`${weekdayName(date)} · ${hebrewDateLabel(date)} · ${gregorianLabel(date)}`}</p>
          {holidays.length > 0 && <p className="holidays">{holidays.join(' · ')}</p>}
        </div>
        {records && dayStreaks && (
          <>
            {date === today && <BackfillBanner records={records} today={today} onOpen={go} />}
            <div className="inset-group">
              {prayersForDay(date).map((prayer) => (
                <PrayerRow
                  key={`${date}-${prayer}`}
                  date={date}
                  prayer={prayer}
                  attendance={record?.prayers[prayer]}
                  streak={prayer === 'musaf' ? null : dayStreaks[prayer].current}
                  slots={prayer === 'musaf' ? null : shelfSlots(records, prayer, date, SHELF_DAYS)}
                />
              ))}
            </div>
            <div className="inset-group">
              <TorahRow
                key={date}
                date={date}
                learned={record?.torah === true}
                note={record?.torahNote}
                streak={dayStreaks.torah.current}
                slots={shelfSlots(records, 'torah', date, SHELF_DAYS)}
              />
            </div>
            <WeekSummary records={records} date={date} today={today} />
          </>
        )}
      </IonContent>
    </IonPage>
  )
}
