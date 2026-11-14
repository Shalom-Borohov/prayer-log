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
import { PeriodButtons } from '../../components/PeriodButtons'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { LIST_SEPARATOR, gregorianLabel, weekdayName } from '../../domain/format'
import { hebrewDateLabel, holidayNames, weeklyParsha } from '../../domain/hebrewCalendar'
import { DAYS_PER_WEEK, addDays, daysInRange } from '../../domain/logicalDay'
import { defaultPlace, knownPlaces } from '../../domain/places'
import { prayersForDay } from '../../domain/prayersForDay'
import { shelfRows } from '../../domain/shelf'
import { hasStreak, streaks } from '../../domain/streaks'
import { usePeriodSwipe } from '../../hooks/usePeriodSwipe'
import { type Tab, dayParentPath, dayPath } from '../../navigation/paths'
import { BackfillBanner } from './BackfillBanner'
import { TODAY_COPY } from './copy'
import { PrayerRow } from './PrayerRow'
import { TorahRow } from './TorahRow'
import { WeekSummary } from './WeekSummary'
import { WornCard } from './WornCard'
import './day-page.css'

const BACK_LABELS = { calendar: COMMON_COPY.calendar, stats: COMMON_COPY.learningLog }

export function DayView({ date, today, tab }: { date: string; today: string; tab: Tab }) {
  const records = useAllDays()
  const record = records?.find((day) => day.date === date)
  const dayStreaks = records && streaks(records, date, today)
  const places = records && knownPlaces(records)
  const shelves = records && shelfRows(records, daysInRange(addDays(date, 1 - DAYS_PER_WEEK), date), today)
  const dayPrayers = prayersForDay(date)
  const router = useIonRouter()
  const title = date === today ? COMMON_COPY.today : weekdayName(date)
  const holidays = holidayNames(date)

  const dateLine = [weekdayName(date), hebrewDateLabel(date), weeklyParsha(date), gregorianLabel(date)]
    .filter((part) => part !== null)
    .join(LIST_SEPARATOR)

  const openDay = (target: string) => router.push(dayPath(tab, target, today), 'none', 'replace')

  const period = {
    onPrevious: () => openDay(addDays(date, -1)),
    onNext: () => openDay(addDays(date, 1)),
    nextDisabled: date >= today,
  }

  const { areaRef, paneRef } = usePeriodSwipe({ ...period, periodKey: date })

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          {tab !== 'today' && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={dayParentPath(tab)} text={BACK_LABELS[tab]} />
            </IonButtons>
          )}
          <IonTitle>{title}</IonTitle>
          <PeriodButtons previousLabel={TODAY_COPY.previousDay} nextLabel={TODAY_COPY.nextDay} {...period} />
          <SettingsButton tab={tab} />
        </IonToolbar>
      </IonHeader>
      <IonContent ref={areaRef} fullscreen>
        <IonHeader collapse="condense" className="app-header">
          <IonToolbar>
            <IonTitle size="large">{title}</IonTitle>
            {holidays.length > 0 && (
              <div slot="end" className="holiday-chips">
                {holidays.map((holiday) => (
                  <span key={holiday} className="holiday-chip">
                    {holiday}
                  </span>
                ))}
              </div>
            )}
          </IonToolbar>
          <div className="day-heading">
            <p>{dateLine}</p>
          </div>
        </IonHeader>
        <div ref={paneRef}>
          {records && dayStreaks && places && shelves && (
            <>
              {date === today && <BackfillBanner records={records} today={today} onOpen={openDay} />}
              <div className="inset-group">
                {shelves.map(
                  ({ key, slots }) =>
                    key !== 'torah' &&
                    dayPrayers.includes(key) && (
                      <PrayerRow
                        key={`${date}-${key}`}
                        date={date}
                        prayer={key}
                        attendance={record?.prayers[key]}
                        place={record?.places?.[key]}
                        rememberedPlace={defaultPlace(records, key)}
                        knownPlaces={places}
                        streak={hasStreak(key) ? dayStreaks[key].current : null}
                        shelf={slots}
                        endsToday={date === today}
                      />
                    ),
                )}
              </div>
              <WornCard date={date} record={record} />
              {shelves.map(
                ({ key, slots }) =>
                  key === 'torah' && (
                    <TorahRow
                      key={date}
                      date={date}
                      learned={record?.torah === true}
                      note={record?.torahNote}
                      entries={record?.learning}
                      records={records}
                      streak={dayStreaks.torah.current}
                      shelf={slots}
                      endsToday={date === today}
                    />
                  ),
              )}
              <WeekSummary records={records} date={date} today={today} />
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  )
}
