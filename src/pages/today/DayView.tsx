import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { PeriodNav } from '../../components/PeriodNav'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { LIST_SEPARATOR, gregorianLabel, weekdayName } from '../../domain/format'
import { hebrewDateLabel, holidayNames } from '../../domain/hebrewCalendar'
import { addDays } from '../../domain/logicalDay'
import { defaultPlace, knownPlaces } from '../../domain/places'
import { prayersForDay } from '../../domain/prayersForDay'
import { shelfSlots } from '../../domain/shelf'
import { streaks } from '../../domain/streaks'
import { WORN_AT_PRAYER } from '../../domain/types'
import { usePeriodSwipe } from '../../hooks/usePeriodSwipe'
import { CALENDAR_PATH, type DayTab, dayPath } from '../../navigation/paths'
import { BackfillBanner } from './BackfillBanner'
import { TODAY_COPY } from './copy'
import { PrayerRow } from './PrayerRow'
import { TorahRow } from './TorahRow'
import { WeekSummary } from './WeekSummary'
import { WornChecks } from './WornChecks'
import './day.css'

const SHELF_DAYS = 7

export function DayView({ date, today, tab }: { date: string; today: string; tab: DayTab }) {
  const records = useAllDays()
  const record = records?.find((day) => day.date === date)
  const dayStreaks = records && streaks(records, date, today)
  const places = records && knownPlaces(records)
  const router = useIonRouter()
  const title = date === today ? COMMON_COPY.today : weekdayName(date)
  const holidays = holidayNames(date)

  const openDay = (target: string) => router.push(dayPath(tab, target, today), 'none', 'replace')

  const period = {
    onPrevious: () => openDay(addDays(date, -1)),
    onNext: () => openDay(addDays(date, 1)),
    nextDisabled: date >= today,
  }

  const { areaRef, paneRef } = usePeriodSwipe({ ...period, periodKey: date })

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          {tab === 'calendar' && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={CALENDAR_PATH} text={COMMON_COPY.calendar} />
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
          <SettingsButton tab={tab} />
        </IonToolbar>
      </IonHeader>
      <IonContent ref={areaRef} fullscreen>
        <IonHeader collapse="condense" className="leather-header">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
          </IonToolbar>
          <div className="day-heading">
            <p>{[weekdayName(date), hebrewDateLabel(date), gregorianLabel(date)].join(LIST_SEPARATOR)}</p>
            {holidays.length > 0 && <p className="holidays">{holidays.join(LIST_SEPARATOR)}</p>}
          </div>
        </IonHeader>
        <div ref={paneRef}>
          {records && dayStreaks && places && (
            <>
              {date === today && <BackfillBanner records={records} today={today} onOpen={openDay} />}
              <div className="inset-group">
                {prayersForDay(date).map((prayer) => (
                  <PrayerRow
                    key={`${date}-${prayer}`}
                    date={date}
                    prayer={prayer}
                    attendance={record?.prayers[prayer]}
                    place={record?.places?.[prayer]}
                    rememberedPlace={defaultPlace(records, prayer)}
                    knownPlaces={places}
                    streak={prayer === 'musaf' ? null : dayStreaks[prayer].current}
                    slots={prayer === 'musaf' ? null : shelfSlots(records, prayer, date, SHELF_DAYS)}
                  >
                    {prayer === WORN_AT_PRAYER && <WornChecks date={date} record={record} />}
                  </PrayerRow>
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
        </div>
      </IonContent>
      <PeriodNav previousLabel={TODAY_COPY.previousDay} nextLabel={TODAY_COPY.nextDay} {...period} />
    </IonPage>
  )
}
