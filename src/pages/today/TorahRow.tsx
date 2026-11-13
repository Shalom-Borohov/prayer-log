import { IonIcon, IonInput } from '@ionic/react'
import { add, checkmark } from 'ionicons/icons'
import { useState } from 'react'
import { COMMON_COPY } from '../../copy/common'
import { setTorah, setTorahNote } from '../../data/repo'
import { streakLabel } from '../../domain/format'
import { learningHints, startingEntry } from '../../domain/learningPlaces'
import type { SlotState } from '../../domain/shelf'
import type { DayRecord, LearningEntry } from '../../domain/types'
import { useSave } from '../../hooks/useSave'
import { TODAY_COPY } from './copy'
import { LearningRows } from './learning/LearningRows'
import { type LearningTarget, LearningSheet } from './learning/LearningSheet'
import { WeekShelf } from './WeekShelf'
import './checks.css'
import './day-row.css'
import './torah-row.css'

interface TorahRowProps {
  date: string
  learned: boolean
  note: string | undefined
  entries: LearningEntry[] | undefined
  records: DayRecord[]
  streak: number
  shelf: SlotState[]
  endsToday: boolean
}

interface SheetState {
  target: LearningTarget | null
  open: boolean
}

export function TorahRow({ date, learned, note, entries, records, streak, shelf, endsToday }: TorahRowProps) {
  const save = useSave()
  const [typed, setTyped] = useState<string | null>(null)
  const [sheet, setSheet] = useState<SheetState>({ target: null, open: false })
  const streakText = streakLabel(streak)

  function saveTyped(value: string) {
    setTyped(value)
    void save(setTorahNote(date, value))
  }

  const openSheet = (entry: LearningEntry, index: number | null) => setSheet({ target: { entry, index }, open: true })

  return (
    <section className="torah-card hue-torah" role="group" aria-label={COMMON_COPY.torah}>
      <div className="day-row-top">
        <div className="day-row-title">
          <h2 className="day-row-name">{COMMON_COPY.torah}</h2>
          <p className="day-row-meta">{streakText && <span>{streakText}</span>}</p>
        </div>
        <WeekShelf shelfKey="torah" slots={shelf} endsToday={endsToday} />
      </div>
      <button
        type="button"
        role="checkbox"
        className="check-button torah-line torah-check"
        aria-checked={learned}
        onClick={() => save(setTorah(date, !learned))}
      >
        <span className="round-check">{learned && <IonIcon icon={checkmark} aria-hidden="true" />}</span>
        {COMMON_COPY.learnedTorah}
      </button>
      <LearningRows
        entries={entries}
        hints={learningHints(records, date)}
        onEdit={openSheet}
        onHint={(entry) => openSheet(entry, null)}
      />
      <div className="torah-line torah-note-line">
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
