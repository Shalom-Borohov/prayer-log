import { gematriya } from '@hebcal/core'
import { LEARNING_COPY, TRACTATE_NAMES } from '../copy/learning'
import { LIST_SEPARATOR } from './format'
import type { LearningEntry } from './types'

export const learningPlace = (entry: LearningEntry) => (entry.kind === 'gemara' ? entry.daf : entry.chapter)

export const learningLabel = (entry: LearningEntry) =>
  [
    LEARNING_COPY.kinds[entry.kind],
    `${TRACTATE_NAMES[entry.tractate]} ${LEARNING_COPY.places[entry.kind]} ${gematriya(learningPlace(entry))}`,
  ].join(LIST_SEPARATOR)