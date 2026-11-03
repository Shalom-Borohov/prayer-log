import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { settingsOutline } from 'ionicons/icons'
import { COMMON_COPY } from '../copy/common'
import { type Tab, settingsPath } from '../navigation/paths'

export function SettingsButton({ tab }: { tab: Tab }) {
  return (
    <IonButtons slot="end">
      <IonButton aria-label={COMMON_COPY.settings} routerLink={settingsPath(tab)}>
        <IonIcon slot="icon-only" icon={settingsOutline} />
      </IonButton>
    </IonButtons>
  )
}
