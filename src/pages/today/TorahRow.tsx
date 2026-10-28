import { IonIcon, IonInput } from '@ionic/react'
import { checkmark } from 'ionicons/icons'
import { Shelf } from '../../components/Shelf'
import { setTorah, setTorahNote } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { type SlotState, shelfLabel } from '../../domain/shelf'

interface TorahRowProps {
  date: string
  learned: boolean
  note: string | undefined
  streak: number
  slots: SlotState[]
}

export function TorahRow({ date, learned, note, streak, slots }: TorahRowProps) {
  return (
    <section className="day-row hue-torah" role="group" aria-label="תורה">
      <div className="day-row-top">
        <button
          type="button"
          role="checkbox"
          className="torah-check"
          aria-checked={learned}
          aria-label="למדתי תורה"
          onClick={() => setTorah(date, !learned)}
        >
          {learned && <IonIcon icon={checkmark} aria-hidden="true" />}
        </button>
        <div className="day-row-title">
          <h2>למדתי תורה</h2>
          <p>{streakLabel(streak)}</p>
        </div>
        <Shelf slots={slots} label={shelfLabel(slots, 'torah')} stamp />
      </div>
      <IonInput
        className="torah-note"
        aria-label="מה למדתי"
        placeholder="מה למדתי…"
        enterkeyhint="done"
        value={note}
        onIonChange={(event) => typeof event.detail.value === 'string' && setTorahNote(date, event.detail.value)}
      />
    </section>
  )
}
