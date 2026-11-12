import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, useIonRouter } from '@ionic/react'
import { useState } from 'react'
import { PeriodButtons } from '../../components/PeriodButtons'
import { SettingsButton } from '../../components/SettingsButton'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { LIST_SEPARATOR, monthTitle } from '../../domain/format'
import { addDays, monthEnd, monthStart } from '../../domain/logicalDay'
import { monthWeeks } from '../../domain/monthWeeks'
import { usePeriodSwipe } from '../../hooks/usePeriodSwipe'
import { useToday } from '../../hooks/useToday'
import { dayPath } from '../../navigation/paths'
import { CALENDAR_COPY } from './copy'
import { hebrewMonthsLabel } from './labels'
import { WeekCard } from './WeekCard'
import './calendar.css'

export function CalendarPage() {
  const today = useToday()
  const records = useAllDays()
  const router = useIonRouter()
  const currentMonth = monthStart(today)
  const [chosenPastMonth, setChosenPastMonth] = useState<string | null>(null)
  const month = chosenPastMonth ?? currentMonth

  const showMonth = (target: string) => setChosenPastMonth(target < currentMonth ? target : null)

  const period = {
    onPrevious: () => showMonth(monthStart(addDays(month, -1))),
    onNext: () => showMonth(addDays(monthEnd(month), 1)),
    nextDisabled: month >= currentMonth,
  }

  const { areaRef, paneRef } = usePeriodSwipe({ ...period, periodKey: month })

  return (
    <IonPage>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonTitle>{COMMON_COPY.calendar}</IonTitle>
          <PeriodButtons previousLabel={CALENDAR_COPY.previousMonth} nextLabel={CALENDAR_COPY.nextMonth} {...period} />
          <SettingsButton tab="calendar" />
        </IonToolbar>
      </IonHeader>
      <IonContent ref={areaRef} fullscreen>
        <IonHeader collapse="condense" className="app-header">
          <IonToolbar>
            <IonTitle size="large">{COMMON_COPY.calendar}</IonTitle>
          </IonToolbar>
          <div className="day-heading">
            <p>
              <span>{monthTitle(month)}</span>
              {LIST_SEPARATOR}
              <span>{hebrewMonthsLabel(month)}</span>
            </p>
          </div>
        </IonHeader>
        <div ref={paneRef} className="week-cards">
          {records &&
            monthWeeks(month, today).map((dates) => (
              <WeekCard
                key={dates[0]}
                dates={dates}
                month={month}
                today={today}
                records={records}
                onOpenDay={(date) => router.push(dayPath('calendar', date, today))}
              />
            ))}
        </div>
      </IonContent>
    </IonPage>
  )
}
