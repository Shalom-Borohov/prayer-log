import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { gemara, mishna } from '../helpers/learning'
import {
  chooseKind,
  choosePlace,
  chooseTractate,
  entryRow,
  hintRow,
  learningSheet,
  learningSheetCloses,
  openNewLearning,
  placeColumn,
  tapInSheet,
  tractateColumn,
} from '../helpers/learningSheet'
import { toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const TODAY = '2026-10-28'

const stored = () => db.days.get(TODAY)

describe('learning entries on the Torah row', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('adds a גמרא entry chosen in the sheet and ticks למדתי', async () => {
    renderAt('/tabs/today')

    await openNewLearning()
    await chooseKind('גמרא')
    await chooseTractate('shabbat')
    await choosePlace('דף', 12)
    await tapInSheet('שמירה')

    await learningSheetCloses()
    await waitFor(async () => expect((await stored())?.learning).toEqual([gemara('shabbat', 12)]))
    expect((await stored())?.torah).toBe(true)
  })

  it('adds a second entry of the other kind after the first', async () => {
    await db.days.put(day(TODAY, { torah: true, learning: [gemara('shabbat', 12)] }))
    renderAt('/tabs/today')

    await openNewLearning()
    await chooseKind('משנה')
    await chooseTractate('avot')
    await choosePlace('פרק', 3)
    await tapInSheet('שמירה')

    await waitFor(async () => expect((await stored())?.learning).toEqual([gemara('shabbat', 12), mishna('avot', 3)]))
    expect(await entryRow('גמרא · שבת דף י״ב')).toBeInTheDocument()
    expect(await entryRow('משנה · אבות פרק ג׳')).toBeInTheDocument()
  })

  it('edits an entry in place from its row', async () => {
    await db.days.put(day(TODAY, { torah: true, learning: [gemara('shabbat', 12), mishna('avot', 3)] }))
    renderAt('/tabs/today')

    fireEvent.click(await entryRow('גמרא · שבת דף י״ב'))
    expect(await tractateColumn()).toHaveProperty('value', 'shabbat')
    expect(await placeColumn('דף')).toHaveProperty('value', 12)
    await choosePlace('דף', 13)
    await tapInSheet('שמירה')

    await learningSheetCloses()
    expect((await stored())?.learning).toEqual([gemara('shabbat', 13), mishna('avot', 3)])
  })

  it('deletes an entry from its sheet and keeps the למדתי tick', async () => {
    await db.days.put(day(TODAY, { torah: true, learning: [gemara('shabbat', 12)] }))
    renderAt('/tabs/today')

    fireEvent.click(await entryRow('גמרא · שבת דף י״ב'))
    await tapInSheet('מחיקת הלימוד')

    await learningSheetCloses()
    expect(await stored()).toStrictEqual(day(TODAY, { torah: true }))
    await waitFor(() => expect(screen.queryByText('גמרא · שבת דף י״ב')).not.toBeInTheDocument())
  })

  it('offers no delete on a new entry', async () => {
    renderAt('/tabs/today')

    await openNewLearning()

    expect(within(await learningSheet()).queryByText('מחיקת הלימוד')).not.toBeInTheDocument()
    await tapInSheet('ביטול')
    await learningSheetCloses()
  })

  it('changes nothing on ביטול', async () => {
    await db.days.put(day(TODAY, { torah: true, learning: [gemara('shabbat', 12)] }))
    renderAt('/tabs/today')

    fireEvent.click(await entryRow('גמרא · שבת דף י״ב'))
    await chooseTractate('berakhot')
    await tapInSheet('ביטול')

    await learningSheetCloses()
    expect(await stored()).toStrictEqual(day(TODAY, { torah: true, learning: [gemara('shabbat', 12)] }))
  })

  it('clamps the place into the range of a newly chosen מסכת', async () => {
    renderAt('/tabs/today')

    await openNewLearning()
    await chooseKind('גמרא')
    await chooseTractate('bavaBatra')
    await choosePlace('דף', 150)
    await chooseTractate('makkot')

    expect(await placeColumn('דף')).toHaveProperty('value', 24)
    await tapInSheet('שמירה')

    await waitFor(async () => expect((await stored())?.learning).toEqual([gemara('makkot', 24)]))
  })

  it('opens a stored place past the end of its מסכת on the last place', async () => {
    await db.days.put(day(TODAY, { torah: true, learning: [mishna('avot', 9)] }))
    renderAt('/tabs/today')

    fireEvent.click(await entryRow('משנה · אבות פרק ט׳'))

    expect(await placeColumn('פרק')).toHaveProperty('value', 6)
  })
})

describe('last time\'s entries as hints', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('shows the latest earlier day\'s entries as hints that save nothing until שמירה', async () => {
    await db.days.put(day('2026-10-26', { torah: true, learning: [gemara('shabbat', 12)] }))
    renderAt('/tabs/today')

    fireEvent.click(await hintRow('גמרא · שבת דף י״ב'))
    expect(await tractateColumn()).toHaveProperty('value', 'shabbat')
    expect(await placeColumn('דף')).toHaveProperty('value', 12)
    await tapInSheet('ביטול')

    await learningSheetCloses()
    expect(await stored()).toBeUndefined()

    fireEvent.click(await hintRow('גמרא · שבת דף י״ב'))
    await choosePlace('דף', 13)
    await tapInSheet('שמירה')

    await waitFor(async () => expect((await stored())?.learning).toEqual([gemara('shabbat', 13)]))
    await waitFor(() => expect(screen.queryByLabelText('בפעם הקודמת: גמרא · שבת דף י״ב')).not.toBeInTheDocument())
  })

  it('opens "+" on the latest kind and place', async () => {
    await db.days.put(day('2026-10-26', { torah: true, learning: [gemara('shabbat', 12), mishna('avot', 3)] }))
    renderAt('/tabs/today')

    await openNewLearning()

    expect(await tractateColumn()).toHaveProperty('value', 'avot')
    expect(await placeColumn('פרק')).toHaveProperty('value', 3)

    await chooseKind('גמרא')

    expect(await tractateColumn()).toHaveProperty('value', 'shabbat')
    expect(await placeColumn('דף')).toHaveProperty('value', 12)
    await tapInSheet('ביטול')
    await learningSheetCloses()
  })
})

describe('saving an entry', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps the sheet open with the message when the write fails', async () => {
    renderAt('/tabs/today')

    await openNewLearning()
    vi.spyOn(db.days, 'put').mockRejectedValue(new Error('lost'))
    await tapInSheet('שמירה')

    await waitFor(() => expect(toasts()).toContain('לא נשמר. אפשר לנסות שוב.'))
    expect(await learningSheet()).toBeInTheDocument()

    vi.restoreAllMocks()
    await tapInSheet('שמירה')

    await learningSheetCloses()
    expect((await stored())?.learning).toEqual([gemara('berakhot', 2)])
  })

  it('stores one entry when שמירה is tapped twice', async () => {
    renderAt('/tabs/today')

    await openNewLearning()
    await tapInSheet('שמירה')
    await tapInSheet('שמירה')

    await learningSheetCloses()
    expect((await stored())?.learning).toEqual([gemara('berakhot', 2)])
  })

  it('ignores שמירה tapped again after the write, while the sheet closes', async () => {
    renderAt('/tabs/today')

    await openNewLearning()
    const save = within(await learningSheet()).getByText('שמירה')

    fireEvent.click(save)
    await waitFor(async () => expect((await stored())?.learning).toEqual([gemara('berakhot', 2)]))
    fireEvent.click(save)

    await learningSheetCloses()
    expect((await stored())?.learning).toEqual([gemara('berakhot', 2)])
  })
})
