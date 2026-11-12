import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  type SegmentValue,
} from '@ionic/react'
import { useRef, useState } from 'react'
import { COMMON_COPY } from '../../../copy/common'
import { LEARNING_COPY } from '../../../copy/learning'
import { addLearning, removeLearning, replaceLearning } from '../../../data/repo'
import { startingEntry, withPlaceInRange } from '../../../domain/learningPlaces'
import { type DayRecord, LEARNING_KINDS, type LearningEntry, type LearningKind } from '../../../domain/types'
import { useSave } from '../../../hooks/useSave'
import { TODAY_COPY } from '../copy'
import { LearningPicker } from './LearningPicker'

const HALF_SHEET = { initialBreakpoint: 0.6, breakpoints: [0, 0.6, 1] }

export interface LearningTarget {
  entry: LearningEntry
  index: number | null
}

interface LearningFormProps {
  date: string
  records: DayRecord[]
  target: LearningTarget
  onClose: () => void
}

const isKind = (value: SegmentValue | undefined): value is LearningKind =>
  LEARNING_KINDS.some((kind) => kind === value)

function LearningForm({ date, records, target, onClose }: LearningFormProps) {
  const save = useSave()
  const saving = useRef(false)
  const [draft, setDraft] = useState(() => withPlaceInRange(target.entry))
  const { index } = target

  async function commit(write: () => Promise<void>) {
    if (saving.current) {
      return
    }

    saving.current = true

    if (await save(write())) {
      onClose()

      return
    }

    saving.current = false
  }

  const store = () =>
    commit(() => (index === null ? addLearning(date, draft) : replaceLearning(date, index, draft)))

  return (
    <>
      <IonHeader className="app-header">
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={onClose}>{COMMON_COPY.cancel}</IonButton>
          </IonButtons>
          <IonTitle>{TODAY_COPY.learningSheet}</IonTitle>
          <IonButtons slot="end">
            <IonButton strong onClick={() => void store()}>
              {TODAY_COPY.save}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSegment
          className="inset-segment"
          value={draft.kind}
          onIonChange={(event) =>
            isKind(event.detail.value) && setDraft(startingEntry(records, date, event.detail.value))
          }
        >
          {LEARNING_KINDS.map((kind) => (
            <IonSegmentButton key={kind} value={kind}>
              <IonLabel>{LEARNING_COPY.kinds[kind]}</IonLabel>
            </IonSegmentButton>
          ))}
        </IonSegment>
        <LearningPicker draft={draft} onChange={setDraft} />
        {index !== null && (
          <IonList inset>
            <IonItem button detail={false} onClick={() => void commit(() => removeLearning(date, index))}>
              <IonLabel color="danger">{TODAY_COPY.deleteLearning}</IonLabel>
            </IonItem>
          </IonList>
        )}
      </IonContent>
    </>
  )
}

interface LearningSheetProps {
  date: string
  records: DayRecord[]
  target: LearningTarget | null
  isOpen: boolean
  onClose: () => void
  onDismissed: () => void
}

export function LearningSheet({ date, records, target, isOpen, onClose, onDismissed }: LearningSheetProps) {
  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismissed} {...HALF_SHEET}>
      {target && <LearningForm date={date} records={records} target={target} onClose={onClose} />}
    </IonModal>
  )
}
