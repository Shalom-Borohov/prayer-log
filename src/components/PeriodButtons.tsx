import { IonButton, IonButtons, IonIcon } from '@ionic/react'
import { chevronBack, chevronForward } from 'ionicons/icons'
import './PeriodButtons.css'

interface PeriodButtonsProps {
  previousLabel: string
  nextLabel: string
  onPrevious: () => void
  onNext: () => void
  nextDisabled: boolean
}

export function PeriodButtons({ previousLabel, nextLabel, onPrevious, onNext, nextDisabled }: PeriodButtonsProps) {
  return (
    <IonButtons slot="end" className="period-buttons">
      <IonButton shape="round" aria-label={previousLabel} onClick={onPrevious}>
        <IonIcon slot="icon-only" icon={chevronForward} aria-hidden="true" />
      </IonButton>
      <IonButton shape="round" aria-label={nextLabel} disabled={nextDisabled} onClick={onNext}>
        <IonIcon slot="icon-only" icon={chevronBack} aria-hidden="true" />
      </IonButton>
    </IonButtons>
  )
}
