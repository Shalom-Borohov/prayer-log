import { beforeEach, describe, expect, it } from 'vitest'
import { exportBackup, parseBackup, restoreBackup } from '../../src/data/backup'
import { allDays, setPrayer, setTorah, setTorahNote, setWorn } from '../../src/data/repo'
import { resetDb } from '../helpers/db'

const exportedAt = Date.UTC(2026, 9, 28, 20)

async function logTwoDays() {
  await setPrayer('2026-10-24', 'shacharit', 'minyan')
  await setPrayer('2026-10-24', 'musaf', 'minyan')
  await setPrayer('2026-10-24', 'mincha', 'alone')
  await setTorah('2026-10-24', true)
  await setTorahNote('2026-10-24', 'פרשת לך לך')
  await setPrayer('2026-10-25', 'maariv', 'alone')
  await setPrayer('2026-10-25', 'shacharit', 'shema')
  await setWorn('2026-10-24', 'tallit', true)
  await setWorn('2026-10-25', 'tefillin', true)
  await setWorn('2026-10-25', 'tallit', true)
}

const twoDays = [
  {
    date: '2026-10-24',
    prayers: { shacharit: 'minyan', musaf: 'minyan', mincha: 'alone' },
    torah: true,
    torahNote: 'פרשת לך לך',
    tallit: true,
  },
  { date: '2026-10-25', prayers: { maariv: 'alone', shacharit: 'shema' }, torah: false, tefillin: true, tallit: true },
]

const daysBeforeTefillin = [
  { date: '2026-10-20', prayers: { shacharit: 'minyan' }, torah: true },
  { date: '2026-10-21', prayers: { mincha: 'alone' }, torah: false },
]

describe('backup', () => {
  beforeEach(resetDb)

  it('backup round-trips', async () => {
    await logTwoDays()

    const backup = parseBackup(JSON.stringify(await exportBackup(exportedAt)))

    await resetDb()
    await setTorah('2026-10-27', true)
    await restoreBackup(backup)

    expect(backup.version).toBe(1)
    expect(backup.exportedAt).toBe(exportedAt)
    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('restore skips days with nothing marked', async () => {
    const empty = { date: '2026-10-20', prayers: {}, torah: false }

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: [empty, ...twoDays] })))

    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('restores a backup made before תפילין, טלית and ק״ש בלבד existed', async () => {
    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: daysBeforeTefillin })))

    expect(await allDays()).toStrictEqual(daysBeforeTefillin)
  })

  it('restores a day with only תפילין or טלית marked', async () => {
    const wornOnly = [{ date: '2026-10-20', prayers: {}, torah: false, tefillin: true }]

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: wornOnly })))

    expect(await allDays()).toStrictEqual(wornOnly)
  })

  it('invalid backup leaves data intact', async () => {
    await logTwoDays()

    const valid = await exportBackup(exportedAt)
    const [day] = valid.days
    const { torah: _torah, ...noTorah } = day

    const withDay = (change: object) => ({ ...valid, days: [{ ...day, ...change }] })

    const invalid = [
      null,
      'גיבוי',
      [],
      { ...valid, version: 2 },
      { ...valid, exportedAt: '2026-10-28' },
      { ...valid, days: undefined },
      { ...valid, days: [noTorah] },
      withDay({ date: 20261024 }),
      withDay({ date: '24/10/2026' }),
      withDay({ date: '2026-10-24T00:00' }),
      withDay({ date: '2026-02-30' }),
      withDay({ date: '2026-13-01' }),
      withDay({ prayers: null }),
      withDay({ prayers: { neilah: 'minyan' } }),
      withDay({ prayers: { shacharit: 'late' } }),
      withDay({ prayers: { mincha: null } }),
      withDay({ torah: 'true' }),
      withDay({ torahNote: 5 }),
      withDay({ torahNote: null }),
      withDay({ tefillin: 'yes' }),
      withDay({ tallit: null }),
    ]

    const invalidTexts = ['', 'not json', '{"version":1', ...invalid.map((json) => JSON.stringify(json))]

    for (const text of invalidTexts) {
      expect(() => parseBackup(text), text).toThrow('קובץ הגיבוי לא תקין')
    }

    expect(await allDays()).toStrictEqual(twoDays)
  })
})
