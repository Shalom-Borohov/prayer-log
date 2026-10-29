import Dexie, { type EntityTable } from 'dexie'
import type { DayRecord } from '../domain/types'

const DB_NAME = 'prayer-log'

class PrayerDb extends Dexie {
  days!: EntityTable<DayRecord, 'date'>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      days: 'date',
    })
  }
}

export const db = new PrayerDb()
