import { learningLabel } from './learning'
import { latestFirst } from './places'
import type { DayRecord } from './types'

const IGNORED_MARKS = /[֑-ׇֽֿׁׂׅׄ׳״'"‘’“”]/g

const WORD_SEPARATORS = /[\s־]+/

const isListed = (day: DayRecord, today: string) => day.date <= today && Boolean(day.learning?.length || day.torahNote)

export const learningLog = (records: DayRecord[], today: string): DayRecord[] =>
  latestFirst(records.filter((day) => isListed(day, today)))

export const hasLearningLog = (records: DayRecord[], today: string) => records.some((day) => isListed(day, today))

const searchWords = (text: string) => text.replace(IGNORED_MARKS, '').split(WORD_SEPARATORS).filter(Boolean)

const searchableText = (day: DayRecord) => [day.learning?.map(learningLabel).join(' '), day.torahNote].join(' ')

export function matchesQuery(day: DayRecord, query: string): boolean {
  const dayWords = searchWords(searchableText(day))

  return searchWords(query).every((queryWord) => dayWords.some((dayWord) => dayWord.startsWith(queryWord)))
}
