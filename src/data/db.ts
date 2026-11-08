import Dexie, { type EntityTable } from 'dexie'
import type { DayRecord } from '../domain/types'
import type { RestoreUndo } from './restoreUndo'

const DB_NAME = 'prayer-log'

class PrayerDb extends Dexie {
  days!: EntityTable<DayRecord, 'date'>
  restoreUndo!: EntityTable<RestoreUndo, 'id'>

  constructor() {
    super(DB_NAME)
    this.version(1).stores({
      days: 'date',
    })
    this.version(2).stores({
      restoreUndo: 'id',
    })
  }
}

export const db = new PrayerDb()
