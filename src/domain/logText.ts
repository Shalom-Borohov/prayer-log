import { LOG_TEXT_COPY } from '../copy/logText'
import { MARKS_SEPARATOR, dayMarks } from './dayMarks'
import { LIST_SEPARATOR, fullDateLabel, weekdayName } from './format'
import { hebrewDateLabel } from './hebrewCalendar'
import { learningLabel } from './learning'
import type { DayRecord } from './types'

const LINE_SEPARATOR = '\n'

const DAY_SEPARATOR = '\n\n'

const dateLine = (date: string) => [weekdayName(date), hebrewDateLabel(date), fullDateLabel(date)].join(LIST_SEPARATOR)

function dayParagraph(record: DayRecord): string {
  const marks = dayMarks(record, record.places)

  return [
    dateLine(record.date),
    ...(marks.length > 0 ? [marks.join(MARKS_SEPARATOR)] : []),
    ...(record.learning ?? []).map(learningLabel),
    ...(record.torahNote ? [LOG_TEXT_COPY.torahNote(record.torahNote)] : []),
  ].join(LINE_SEPARATOR)
}

const newestFirst = (first: DayRecord, second: DayRecord) => second.date.localeCompare(first.date)

export function logText(days: DayRecord[]): string {
  return days.toSorted(newestFirst).map(dayParagraph).join(DAY_SEPARATOR)
}
