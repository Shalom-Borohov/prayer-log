import { IonIcon } from '@ionic/react'
import { chevronBack } from 'ionicons/icons'
import { learningLabel } from '../../../domain/learning'
import type { LearningEntry } from '../../../domain/types'
import { TODAY_COPY } from '../copy'
import './learning.css'

interface LearningRowsProps {
  entries: LearningEntry[] | undefined
  hints: LearningEntry[]
  onEdit: (entry: LearningEntry, index: number) => void
  onHint: (entry: LearningEntry) => void
}

export function LearningRows({ entries, hints, onEdit, onHint }: LearningRowsProps) {
  return (
    <>
      {entries?.map((entry, index) => (
        <button
          key={`entry-${index}`}
          type="button"
          className="learning-row learning-entry"
          onClick={() => onEdit(entry, index)}
        >
          <span className="learning-text">{learningLabel(entry)}</span>
          <IonIcon icon={chevronBack} className="learning-chevron" aria-hidden="true" />
        </button>
      ))}
      {hints.map((hint, index) => (
        <button
          key={`hint-${index}`}
          type="button"
          className="learning-row learning-hint"
          aria-label={TODAY_COPY.learningHint(learningLabel(hint))}
          onClick={() => onHint(hint)}
        >
          <span className="round-check" aria-hidden="true" />
          <span className="learning-text">{learningLabel(hint)}</span>
        </button>
      ))}
    </>
  )
}
