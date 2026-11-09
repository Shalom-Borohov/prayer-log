import { IonIcon, IonInput } from '@ionic/react'
import { add, checkmark } from 'ionicons/icons'
import { useState } from 'react'
import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { setTorah, setTorahNote } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { learningHints, startingEntry } from '../../domain/learningPlaces'
import { type SlotState, shelfLabel } from '../../domain/shelf'
import type { DayRecord, LearningEntry } from '../../domain/types'
import { useSave } from '../../hooks/useSave'
import { TODAY_COPY } from './copy'
import { LearningRows } from './learning/LearningRows'
import { type LearningTarget, LearningSheet } from './learning/LearningSheet'

interface TorahRowProps {
  date: string
  learned: boolean
  note: string | undefined
  entries: LearningEntry[] | undefined
  records: DayRecord[]
  streak: number
  slots: SlotState[]
}

interface SheetState {
  target: LearningTarget | null
  open: boolean
}

export function TorahRow({ date, learned, note, entries, records, streak, slots }: TorahRowProps) {
  const save = useSave()
  const [typed, setTyped] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetState>({ target: null, open: false })

  function saveTyped(value: string) {
    setTyped(value)
    void save(setTorahNote(date, value))
  }

  const openSheet = (entry: LearningEntry, index: number | null) => setSheet({ target: { entry, index }, open: true })

  return (
    <section className="day-row hue-torah" role="group" aria-label={COMMON_COPY.torah}>
      <div className="day-row-top">
        <button
          type="button"
          role="checkbox"
          className="check-button torah-check"
          aria-checked={learned}
          aria-label={COMMON_COPY.learnedTorah}
          onClick={() => save(setTorah(date, !learned))}
        >
          <span className="round-check">{learned && <IonIcon icon={checkmark} aria-hidden="true" />}</span>
        </button>
        <div className="day-row-title">
          <h2>{COMMON_COPY.learnedTorah}</h2>
          <p>{streakLabel(streak)}</p>
        </div>
        <Shelf slots={slots} label={shelfLabel(slots, 'torah')} stamp />
      </div>
      <LearningRows
        entries={entries}
        hints={learningHints(records, date)}
        onEdit={openSheet}
        onHint={(entry) => openSheet(entry, null)}
      />
      <div className="torah-note-line">
        <IonInput
          className="torah-note"
          aria-label={TODAY_COPY.torahNote}
          placeholder={TODAY_COPY.torahNotePlaceholder}
          enterkeyhint="done"
          value={typed ?? note}
          onIonInput={(event) => typeof event.detail.value === 'string' && saveTyped(event.detail.value)}
          onIonBlur={() => setTyped(null)}
        />
        <button
          type="button"
          className="add-learning"
          aria-label={TODAY_COPY.addLearning}
          onClick={() => openSheet(startingEntry(records, date), null)}
        >
          <IonIcon icon={add} aria-hidden="true" />
        </button>
      </div>
      <LearningSheet
        date={date}
        records={records}
        target={sheet.target}
        isOpen={sheet.open}
        onClose={() => setSheet((current) => ({ ...current, open: false }))}
        onDismissed={() => setSheet({ target: null, open: false })}
      />
    </section>
  )
}
