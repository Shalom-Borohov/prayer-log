import { db } from '../../src/data/db'

export async function resetDb() {
  await db.days.clear()
  await db.restoreUndo.clear()
}
