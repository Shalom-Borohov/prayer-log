import { type Attendance, type DayRecord, isEmptyDay, type Prayer, PRAYERS, type WornItem } from '../domain/types'
import { db } from './db'

async function updateDay(date: string, change: (day: DayRecord) => DayRecord) {
  await db.transaction('rw', db.days, async () => {
    const day = withMinyanPlacesOnly(change((await db.days.get(date)) ?? { date, prayers: {}, torah: false }))

    if (isEmptyDay(day)) {
      await db.days.delete(date)
    } else {
      await db.days.put(day)
    }
  })
}

export function withMinyanPlacesOnly({ places, ...day }: DayRecord): DayRecord {
  const kept: Partial<Record<Prayer, string>> = {}

  for (const prayer of PRAYERS) {
    const place = places?.[prayer]

    if (place && day.prayers[prayer] === 'minyan') {
      kept[prayer] = place
    }
  }

  return Object.keys(kept).length > 0 ? { ...day, places: kept } : day
}

function withPlace(day: DayRecord, prayer: Prayer, place: string | null): DayRecord {
  const { [prayer]: _previous, ...others } = { ...day.places }

  return { ...day, places: place ? { ...others, [prayer]: place } : others }
}

export async function setPrayer(date: string, prayer: Prayer, attendance: Attendance | null, place?: string) {
  await updateDay(date, (day) => {
    const { [prayer]: _previous, ...prayers } = day.prayers
    const marked = { ...day, prayers: attendance ? { ...prayers, [prayer]: attendance } : prayers }

    return place ? withPlace(marked, prayer, place) : marked
  })
}

export async function setPlace(date: string, prayer: Prayer, place: string | null) {
  await updateDay(date, (day) => withPlace(day, prayer, place))
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
