import { IonLabel, IonListHeader, IonNote, IonSegment, IonSegmentButton } from '@ionic/react'
import { APPEARANCES, isAppearance } from '../../appearance/appearance'
import { saveAppearance, useAppearance } from '../../appearance/appearanceStore'
import { SETTINGS_COPY } from './copy'

export function AppearanceSettings() {
  const appearance = useAppearance()

  return (
    <>
      <IonListHeader>
        <IonLabel>{SETTINGS_COPY.appearance}</IonLabel>
      </IonListHeader>
      <IonSegment
        className="inset-segment"
        value={appearance}
        onIonChange={({ detail: { value } }) => typeof value === 'string' && isAppearance(value) && saveAppearance(value)}
      >
        {APPEARANCES.map((option) => (
          <IonSegmentButton key={option} value={option}>
            <IonLabel>{SETTINGS_COPY.appearanceOptions[option]}</IonLabel>
          </IonSegmentButton>
        ))}
      </IonSegment>
      <IonNote className="list-footer">{SETTINGS_COPY.appearanceFooter}</IonNote>
    </>
  )
}
