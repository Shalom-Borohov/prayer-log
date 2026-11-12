import { IonItem, IonList } from '@ionic/react'
import { COMMON_COPY } from '../../copy/common'
import { LEARNING_LOG_PATH } from '../../navigation/paths'

export function LearningLogEntrance() {
  return (
    <IonList inset className="learning-log-entrance">
      <IonItem button detail lines="none" routerLink={LEARNING_LOG_PATH}>
        {COMMON_COPY.learningLog}
      </IonItem>
    </IonList>
  )
}
