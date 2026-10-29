import { IonIcon, IonInput } from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { setTorah, setTorahNote } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { type SlotState, shelfLabel } from '../../domain/shelf'
import { TODAY_COPY } from './copy'

interface TorahRowProps {
  date: string
  learned: boolean
  note: string | undefined
  streak: number
  slots: SlotState[]
}

export function TorahRow({ date, learned, note, streak, slots }: TorahRowProps) {
  return (
    <section className="day-row hue-torah" role="group" aria-label={COMMON_COPY.torah}>
      <div className="day-row-top">
        <button
          type="button"
          role="checkbox"
          className="check-button torah-check"
          aria-checked={learned}
          aria-label={COMMON_COPY.learnedTorah}
          onClick={() => setTorah(date, !learned)}
        >
          <span className="round-check">{learned && <IonIcon icon={checkmark} aria-hidden="true" />}</span>
        </button>
        <div className="day-row-title">
          <h2>{COMMON_COPY.learnedTorah}</h2>
          <p>{streakLabel(streak)}</p>
        </div>
        <Shelf slots={slots} label={shelfLabel(slots, 'torah')} stamp />
      </div>
      <IonInput
        className="torah-note"
        aria-label={TODAY_COPY.torahNote}
        placeholder={TODAY_COPY.torahNotePlaceholder}
        enterkeyhint="done"
        value={note}
        onIonChange={(event) => typeof event.detail.value === 'string' && setTorahNote(date, event.detail.value)}
      />
    </section>
  )
}
