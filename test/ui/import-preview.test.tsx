import { screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { chooseBackupFile } from '../helpers/backupFile'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { alertMessage, alertShown } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'
import { asRead } from '../helpers/text'

const exportedAt = new Date(2026, 10, 3, 21).getTime()

const fileWith = (fileDays: unknown[]) => JSON.stringify({ version: 1, exportedAt, days: fileDays })

async function chooseInSettings(fileText: string) {
  renderAt('/tabs/stats/settings')
  await screen.findByText('ייבוא גיבוי')

  const shown = alertShown()

  chooseBackupFile(fileText)
  await shown
}

beforeEach(resetDb)
freezeDate(new Date(2026, 10, 8, 10).getTime())

describe('the import confirmation in הגדרות', () => {
  it('compares the file with the phone and says when the phone is newer', async () => {
    await db.days.bulkPut(days('2026-11-01', '2026-11-08', { prayers: allMinyan }))
    await chooseInSettings(fileWith([...days('2026-11-01', '2026-11-03', { prayers: allMinyan }), day('2026-11-04')]))

    expect(asRead(alertMessage())).toBe(
      [
        'הייבוא יחליף את כל הנתונים.',
        'בקובץ: 3 ימים, עד 3.11.2026',
        'בטלפון: 8 ימים, עד 8.11.2026',
        'בטלפון יש ימים אחרי 3.11.2026.',
      ].join('\n'),
    )
  })

  it('leaves out the newer line when the file is as new as the phone', async () => {
    await db.days.put(day('2026-11-08', { torah: true }))
    await chooseInSettings(fileWith(days('2026-11-07', '2026-11-08', { torah: true })))

    expect(asRead(alertMessage())).toBe(
      ['הייבוא יחליף את כל הנתונים.', 'בקובץ: 2 ימים, עד 8.11.2026', 'בטלפון: יום אחד, 8.11.2026'].join('\n'),
    )
  })

  it('says when the phone has no data', async () => {
    await chooseInSettings(fileWith([day('2026-11-03', { torah: true })]))

    expect(asRead(alertMessage())).toBe(
      ['הייבוא יחליף את כל הנתונים.', 'בקובץ: יום אחד, 3.11.2026', 'בטלפון: אין נתונים'].join('\n'),
    )
  })
})
