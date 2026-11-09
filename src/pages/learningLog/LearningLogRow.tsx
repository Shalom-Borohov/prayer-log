import { IonItem, IonLabel } from '@ionic/react'
import { fullDateLabel, LIST_SEPARATOR, weekdayName } from '../../domain/format'
import { hebrewDateWithYear } from '../../domain/hebrewCalendar'
import { learningLabel } from '../../domain/learning'
import type { DayRecord } from '../../domain/types'

interface LearningLogRowProps {
  day: DayRecord
  onOpen: (date: string) => void
}

export function LearningLogRow({ day, onOpen }: LearningLogRowProps) {
  return (
    <IonItem button detail onClick={() => onOpen(day.date)}>
      <IonLabel className="learning-log-row ion-text-wrap">
        <p className="learning-log-date">
          {[weekdayName(day.date), hebrewDateWithYear(day.date), fullDateLabel(day.date)].join(LIST_SEPARATOR)}
        </p>
        {day.learning?.map((entry, index) => (
          <p key={index} className="learning-log-entry">
            {learningLabel(entry)}
          </p>
        ))}
        {day.torahNote && <p className="learning-log-note">{day.torahNote}</p>}
      </IonLabel>
    </IonItem>
  )
}
