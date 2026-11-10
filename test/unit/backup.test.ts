import { beforeEach, describe, expect, it } from 'vitest'
import { countBadRecords, exportBackup, parseBackup, restoreBackup } from '../../src/data/backup'
import { addLearning, allDays, setPrayer, setTorah, setTorahNote, setWorn } from '../../src/data/repo'
import { resetDb } from '../helpers/db'
import { gemara, mishna } from '../helpers/learning'

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

const badLearning = [
  { kind: 'halacha', tractate: 'shabbat', daf: 12 },
  { kind: 'gemara', tractate: 'peah', daf: 12 },
  { kind: 'gemara', tractate: 'brachot', daf: 12 },
  { kind: 'gemara', tractate: 'shabbat', daf: 0 },
  { kind: 'gemara', tractate: 'shabbat', daf: -3 },
  { kind: 'gemara', tractate: 'shabbat', daf: 12.5 },
  { kind: 'gemara', tractate: 'shabbat', daf: '12' },
  { kind: 'gemara', tractate: 'shabbat' },
  { kind: 'mishna', tractate: 'berakhot', daf: 2 },
  { kind: 'mishna', tractate: 'berakhot', chapter: 0 },
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
    await restoreBackup(backup, null)

    expect(backup.version).toBe(1)
    expect(backup.exportedAt).toBe(exportedAt)
    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('restore skips days with nothing marked', async () => {
    const empty = { date: '2026-10-20', prayers: {}, torah: false }

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: [empty, ...twoDays] })), null)

    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('restores a backup made before תפילין, טלית and ק״ש בלבד existed', async () => {
    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: daysBeforeTefillin })), null)

    expect(await allDays()).toStrictEqual(daysBeforeTefillin)
  })

  it('round-trips the places prayers were prayed at', async () => {
    await setPrayer('2026-10-26', 'shacharit', 'minyan', 'בית יוסף')
    await setPrayer('2026-10-26', 'maariv', 'minyan', 'הגר"א')
    await setPrayer('2026-10-26', 'mincha', 'alone')

    const backup = parseBackup(JSON.stringify(await exportBackup(exportedAt)))

    await resetDb()
    await restoreBackup(backup, null)

    expect(await allDays()).toStrictEqual([
      {
        date: '2026-10-26',
        prayers: { shacharit: 'minyan', maariv: 'minyan', mincha: 'alone' },
        places: { shacharit: 'בית יוסף', maariv: 'הגר"א' },
        torah: false,
        tefillin: true,
        tallit: true,
      },
    ])
  })

  it('drops restored places that are blank or not on a prayer marked במניין', async () => {
    const withStrayPlaces = {
      date: '2026-10-26',
      prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'minyan' },
      places: { shacharit: 'בית יוסף', mincha: 'הגר"א', maariv: '' },
      torah: false,
    }

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: [withStrayPlaces] })), null)

    expect((await allDays())[0].places).toStrictEqual({ shacharit: 'בית יוסף' })
  })

  it('restores a backup made before places existed', async () => {
    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: twoDays })), null)

    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('restores a day with only תפילין or טלית marked', async () => {
    const wornOnly = [{ date: '2026-10-20', prayers: {}, torah: false, tefillin: true }]

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: wornOnly })), null)

    expect(await allDays()).toStrictEqual(wornOnly)
  })

  it('restores a day with only a note', async () => {
    const noteOnly = [{ date: '2026-10-20', prayers: {}, torah: false, torahNote: 'דף יומי' }]

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: noteOnly })), null)

    expect(await allDays()).toStrictEqual(noteOnly)
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
      withDay({ places: null }),
      withDay({ places: { neilah: 'הגר"א' } }),
      withDay({ places: { shacharit: 5 } }),
      ...badLearning.map((entry) => withDay({ learning: [entry] })),
      withDay({ learning: null }),
      withDay({ learning: gemara('shabbat', 12) }),
    ]

    const invalidTexts = ['', 'not json', '{"version":1', ...invalid.map((json) => JSON.stringify(json))]

    for (const text of invalidTexts) {
      expect(() => parseBackup(text), text).toThrow('קובץ הגיבוי לא תקין')
    }

    expect(await allDays()).toStrictEqual(twoDays)
  })

  it('round-trips learning entries', async () => {
    await addLearning('2026-10-26', gemara('shabbat', 12))
    await addLearning('2026-10-26', mishna('berakhot', 2))

    const backup = parseBackup(JSON.stringify(await exportBackup(exportedAt)))

    await resetDb()
    await restoreBackup(backup, null)

    expect(await allDays()).toStrictEqual([
      { date: '2026-10-26', prayers: {}, torah: true, learning: [gemara('shabbat', 12), mishna('berakhot', 2)] },
    ])
  })

  it('restores an entry past the end of its מסכת, so a later fix to the list never locks out a backup', async () => {
    const pastTheEnd = [{ date: '2026-10-20', prayers: {}, torah: true, learning: [gemara('berakhot', 90)] }]

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days: pastTheEnd })), null)

    expect(await allDays()).toStrictEqual(pastTheEnd)
  })

  it('restores an empty learning list as no entries', async () => {
    const days = [
      { date: '2026-10-20', prayers: {}, torah: false, torahNote: 'דף יומי', learning: [] },
      { date: '2026-10-21', prayers: {}, torah: false, learning: [] },
    ]

    await restoreBackup(parseBackup(JSON.stringify({ version: 1, exportedAt, days })), null)

    expect(await allDays()).toStrictEqual([{ date: '2026-10-20', prayers: {}, torah: false, torahNote: 'דף יומי' }])
  })

  it('counts a day with a bad learning entry as a bad record', () => {
    const days = [
      { date: '2026-10-20', prayers: {}, torah: true, learning: [gemara('shabbat', 12)] },
      ...badLearning.map((entry) => ({ date: '2026-10-21', prayers: {}, torah: true, learning: [entry] })),
    ]

    expect(countBadRecords(JSON.stringify({ version: 1, exportedAt, days }))).toBe(badLearning.length)
  })
})
