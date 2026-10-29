import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from '@ionic/react'
import { chevronBack, chevronForward } from 'ionicons/icons'
import { useState } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { useAllDays } from '../../data/hooks'
import { LIST_SEPARATOR, gregorianLabel, monthTitle } from '../../domain/format'
import { holidayNames } from '../../domain/hebrewCalendar'
import { addDays, daysInRange, monthEnd, monthStart } from '../../domain/logicalDay'
import { useToday } from '../../hooks/useToday'
import { dayPath } from '../../navigation/paths'
import { CALENDAR_COPY } from './copy'
import { MonthGrid } from './MonthGrid'
import './calendar.css'

export function CalendarPage() {
  const today = useToday()
  const records = useAllDays()
  const router = useIonRouter()
  const [month, setMonth] = useState(() => monthStart(today))

  const holidays = daysInRange(month, monthEnd(month)).flatMap((date) => {
    const names = holidayNames(date)

    return names.length > 0 ? [{ date, names: names.join(LIST_SEPARATOR) }] : []
  })

  const holidayDates = new Set(holidays.map((holiday) => holiday.date))

  return (
    <IonPage>
      <IonHeader className="leather-header">
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton aria-label={CALENDAR_COPY.previousMonth} onClick={() => setMonth(monthStart(addDays(month, -1)))}>
              <IonIcon slot="icon-only" icon={chevronForward} />
            </IonButton>
            <IonButton
              aria-label={CALENDAR_COPY.nextMonth}
              disabled={month >= monthStart(today)}
              onClick={() => setMonth(addDays(monthEnd(month), 1))}
            >
              <IonIcon slot="icon-only" icon={chevronBack} />
            </IonButton>
          </IonButtons>
          <IonTitle>{COMMON_COPY.calendar}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense" className="leather-header">
          <IonToolbar>
            <IonTitle size="large">{COMMON_COPY.calendar}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <div className="day-heading">
          <p>{monthTitle(month)}</p>
        </div>
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
      </IonContent>
    </IonPage>
  )
}
