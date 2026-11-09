import { IonPicker, IonPickerColumn, IonPickerColumnOption } from '@ionic/react'
import { gematriya } from '@hebcal/core'
import { LEARNING_COPY, TRACTATE_NAMES } from '../../../copy/learning'
import { withPlaceInRange } from '../../../domain/learningPlaces'
import { learningPlace } from '../../../domain/learning'
import {
  GEMARA_TRACTATES,
  isGemaraTractate,
  isMishnaTractate,
  MISHNA_TRACTATES,
  placeRange,
} from '../../../domain/tractates'
import type { LearningEntry } from '../../../domain/types'

type PickedValue = string | number | undefined

interface LearningPickerProps {
  draft: LearningEntry
  onChange: (entry: LearningEntry) => void
}

function withTractate(draft: LearningEntry, value: PickedValue): LearningEntry | null {
  if (draft.kind === 'gemara') {
    return isGemaraTractate(value) ? withPlaceInRange({ ...draft, tractate: value }) : null
  }

  return isMishnaTractate(value) ? withPlaceInRange({ ...draft, tractate: value }) : null
}

function withPlace(draft: LearningEntry, value: PickedValue): LearningEntry | null {
  if (typeof value !== 'number') {
    return null
  }

  return draft.kind === 'gemara' ? { ...draft, daf: value } : { ...draft, chapter: value }
}

function placesOf(draft: LearningEntry) {
  const { first, last } = placeRange(draft)

  return Array.from({ length: last - first + 1 }, (_, offset) => first + offset)
}

export function LearningPicker({ draft, onChange }: LearningPickerProps) {
  const tractates = draft.kind === 'gemara' ? GEMARA_TRACTATES : MISHNA_TRACTATES

  const apply = (next: LearningEntry | null) => next && onChange(next)

  return (
    <IonPicker className="learning-picker">
      <IonPickerColumn
        aria-label={LEARNING_COPY.tractate}
        value={draft.tractate}
        onIonChange={(event) => apply(withTractate(draft, event.detail.value))}
      >
        {tractates.map((tractate) => (
          <IonPickerColumnOption key={tractate} value={tractate}>
            {TRACTATE_NAMES[tractate]}
          </IonPickerColumnOption>
        ))}
      </IonPickerColumn>
      <IonPickerColumn
        aria-label={LEARNING_COPY.places[draft.kind]}
        value={learningPlace(draft)}
        onIonChange={(event) => apply(withPlace(draft, event.detail.value))}
      >
        {placesOf(draft).map((place) => (
          <IonPickerColumnOption key={place} value={place}>
            {gematriya(place)}
          </IonPickerColumnOption>
        ))}
      </IonPickerColumn>
    </IonPicker>
  )
}
