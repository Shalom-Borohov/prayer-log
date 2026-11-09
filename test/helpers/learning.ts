import type { LearningEntry } from '../../src/domain/types'
import type { GemaraTractate, MishnaTractate } from '../../src/domain/tractates'

export const gemara = (tractate: GemaraTractate, daf: number): LearningEntry => ({ kind: 'gemara', tractate, daf })

export const mishna = (tractate: MishnaTractate, chapter: number): LearningEntry => ({
  kind: 'mishna',
  tractate,
  chapter,
})
