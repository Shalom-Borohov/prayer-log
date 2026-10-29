import { type Attendance, type DayRecord, isEmptyDay, type Prayer, type WornItem } from '../domain/types'
import { db } from './db'

async function updateDay(date: string, change: (day: DayRecord) => DayRecord) {
  await db.transaction('rw', db.days, async () => {
    const day = change((await db.days.get(date)) ?? { date, prayers: {}, torah: false })

    if (isEmptyDay(day)) {
      await db.days.delete(date)
    } else {
      await db.days.put(day)
    }
  })
}

export async function setPrayer(date: string, prayer: Prayer, attendance: Attendance | null) {
  await updateDay(date, (day) => {
    const { [prayer]: _previous, ...prayers } = day.prayers

    return { ...day, prayers: attendance ? { ...prayers, [prayer]: attendance } : prayers }
  })
}

export async function setTorah(date: string, learned: boolean) {
  await updateDay(date, (day) => ({ ...day, torah: learned }))
}

export async function setTorahNote(date: string, note: string) {
  const torahNote = note.trim()

  await updateDay(date, ({ torahNote: _previous, ...day }) => (torahNote ? { ...day, torahNote } : day))
}

export async function setWorn(date: string, item: WornItem, worn: boolean) {
  await updateDay(date, ({ [item]: _previous, ...day }) => (worn ? { ...day, [item]: true } : day))
}

export function allDays(): Promise<DayRecord[]> {
  return db.days.orderBy('date').toArray()
}
