import { IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonNote } from '@ionic/react'
import { documentTextOutline } from 'ionicons/icons'
import { SETTINGS_COPY } from './copy'
import { useShareHistory } from './useShareHistory'

export function HistorySettings() {
  const shareHistory = useShareHistory()

  return (
    <>
      <IonListHeader>
        <IonLabel>{SETTINGS_COPY.history}</IonLabel>
      </IonListHeader>
      <IonList inset>
        <IonItem button detail={false} onClick={shareHistory}>
          <IonIcon slot="start" color="primary" icon={documentTextOutline} aria-hidden="true" />
          <IonLabel>{SETTINGS_COPY.exportHistory}</IonLabel>
        </IonItem>
      </IonList>
      <IonNote className="list-footer">{SETTINGS_COPY.historyNote}</IonNote>
    </>
  )
}
