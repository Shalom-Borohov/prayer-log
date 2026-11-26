import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { useState } from 'react'
import { PeriodNav } from '../../components/PeriodNav'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { LIST_SEPARATOR, gregorianLabel, monthTitle } from '../../domain/format'
import { holidayNames } from '../../domain/hebrewCalendar'
import { addDays, daysInRange, monthEnd, monthStart } from '../../domain/logicalDay'
import { usePeriodSwipe } from '../../hooks/usePeriodSwipe'
import { useToday } from '../../hooks/useToday'
import { dayPath } from '../../navigation/paths'
import { CALENDAR_COPY } from './copy'
import { MonthGrid } from './MonthGrid'
import './calendar.css'

export function CalendarPage() {
  const today = useToday()
  const records = useAllDays()
  const router = useIonRouter()
  const currentMonth = monthStart(today)
  const [shown, setShown] = useState({ month: currentMonth, isFollowingToday: true })

  if (shown.isFollowingToday && currentMonth > shown.month) {
    setShown({ month: currentMonth, isFollowingToday: true })
  }

  const { month } = shown

  const holidays = daysInRange(month, monthEnd(month)).flatMap((date) => {
    const names = holidayNames(date)

    return names.length > 0 ? [{ date, names: names.join(LIST_SEPARATOR) }] : []
  })

  const holidayDates = new Set(holidays.map((holiday) => holiday.date))

  const showMonth = (target: string) => setShown({ month: target, isFollowingToday: target >= currentMonth })

  const period = {
    onPrevious: () => showMonth(monthStart(addDays(month, -1))),
    onNext: () => showMonth(addDays(monthEnd(month), 1)),
    nextDisabled: month >= currentMonth,
  }

  const { areaRef, paneRef } = usePeriodSwipe({ ...period, periodKey: month })

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          <IonTitle>{COMMON_COPY.calendar}</IonTitle>
          <SettingsButton tab="calendar" />
        </IonToolbar>
      </IonHeader>
      <IonContent ref={areaRef} fullscreen>
        <div className="day-heading">
          <p>{monthTitle(month)}</p>
        </div>
        <div ref={paneRef}>
          {records && (
            <MonthGrid
              month={month}
              today={today}
              records={records}
              holidayDates={holidayDates}
              onOpen={(date) => router.push(dayPath('calendar', date, today))}
            />
          )}
          {holidays.length > 0 && (
            <IonList inset>
              {holidays.map(({ date, names }) => (
                <IonItem key={date}>
                  <IonLabel>{names}</IonLabel>
                  <IonNote slot="end">{gregorianLabel(date)}</IonNote>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
      <PeriodNav previousLabel={CALENDAR_COPY.previousMonth} nextLabel={CALENDAR_COPY.nextMonth} {...period} />
    </IonPage>
  )
}
