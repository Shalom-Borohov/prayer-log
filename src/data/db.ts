import Dexie, { type EntityTable } from 'dexie'
import type { DayRecord } from '../domain/types'

class PrayerDb extends Dexie {
  days!: EntityTable<DayRecord, 'date'>

  constructor() {
    super('prayer-log')
    this.version(1).stores({
      days: 'date',
    })
  }
}

export const db = new PrayerDb()
