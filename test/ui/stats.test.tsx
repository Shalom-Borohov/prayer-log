import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { ionChange, ionElement, visibleAll } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'
import { spinesOf, spineStatesOf, todaySlotsOf } from '../helpers/shelves'

function cells(table: HTMLElement, rowName: string) {
  const row = within(table).getByRole('rowheader', { name: rowName }).closest('tr')

  if (!row) {
    throw new Error(`no row ${rowName}`)
  }

  return within(row)
    .getAllByRole('cell')
    .map((cell) => cell.textContent)
}

function prayerRow(rows: HTMLElement, name: string) {
  const row = within(rows).getByRole('heading', { name }).closest('li')

  if (!row) {
    throw new Error(`no prayer row ${name}`)
  }

  return row
}

const numbersOf = (rows: HTMLElement, name: string, numbers: string) =>
  within(prayerRow(rows, name)).getByText(numbers)

const shelfOf = (rows: HTMLElement, name: string) => within(prayerRow(rows, name)).getByRole('img')

const WEEK_AND_MONTH = [
  ...days('2026-10-19', '2026-10-23', { prayers: allMinyan }),
  day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'alone' } }),
  day('2026-10-25', { prayers: { shacharit: 'minyan' }, torah: true }),
  day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' }, torah: true }),
  day('2026-10-27', { prayers: { shacharit: 'minyan', maariv: 'shema' }, torah: true }),
]

const DAYS_AHEAD = ['spine-blank', 'spine-blank', 'spine-blank']

function figures() {
  return Object.fromEntries(visibleAll('dt').map((term) => [term.textContent, term.nextElementSibling?.textContent]))
}

describe('stats', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('leads with the prayers במניין out of the period’s prayers, counting today once marked', async () => {
    await db.days.bulkPut([
      ...days('2026-10-19', '2026-10-23', { prayers: allMinyan }),
      day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'alone' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
      day('2026-10-28', { prayers: { shacharit: 'minyan' } }),
    ])
    renderAt('/tabs/stats')

    expect(await screen.findByRole('heading', { name: '2 במניין מתוך 10 תפילות' })).toBeInTheDocument()

    ionChange(await ionElement('ion-segment'), 'month')

    expect(await screen.findByRole('heading', { name: '18 במניין מתוך 29 תפילות' })).toBeInTheDocument()
  })

  it('shows three figures and a row per prayer with its count, streak and best, then this month', async () => {
    await db.days.bulkPut(WEEK_AND_MONTH)
    renderAt('/tabs/stats')

    const rows = await screen.findByRole('list', { name: 'לפי תפילה' })

    await waitFor(() => expect(numbersOf(rows, 'שחרית', '3 מתוך 3 · 9 ברצף · שיא 9')).toBeInTheDocument())
    expect(numbersOf(rows, 'מנחה', '0 מתוך 3 · 0 ברצף · שיא 5')).toBeInTheDocument()
    expect(numbersOf(rows, 'ערבית', '0 מתוך 3 · 0 ברצף · שיא 5')).toBeInTheDocument()
    expect(numbersOf(rows, 'תורה', '3 מתוך 3 · 3 ברצף · שיא 3')).toBeInTheDocument()
    expect(within(rows).queryByRole('heading', { name: 'מוסף' })).not.toBeInTheDocument()
    expect(figures()).toEqual({ ביחידות: '1', 'ק״ש בלבד': '1', 'ימי לימוד': '3' })

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(numbersOf(rows, 'שחרית', '9 מתוך 9 · 9 ברצף · שיא 9')).toBeInTheDocument())
    expect(numbersOf(rows, 'מוסף', '0 מתוך 1')).toBeInTheDocument()
    expect(figures()).toEqual({ ביחידות: '2', 'ק״ש בלבד': '1', 'ימי לימוד': '3' })
  })

  it('gives each prayer this week’s shelf, marking today and leaving the days ahead blank', async () => {
    await db.days.bulkPut(WEEK_AND_MONTH)
    renderAt('/tabs/stats')

    const rows = await screen.findByRole('list', { name: 'לפי תפילה' })

    await waitFor(() =>
      expect(spineStatesOf(shelfOf(rows, 'שחרית'))).toEqual([
        'spine-done',
        'spine-done',
        'spine-done',
        'spine-unmarked',
        ...DAYS_AHEAD,
      ]),
    )
    expect(shelfOf(rows, 'שחרית')).toHaveAccessibleName('3 מתוך 4 הימים האחרונים במניין')
    expect(spineStatesOf(shelfOf(rows, 'מנחה'))).toEqual([
      'spine-unmarked',
      'spine-alone',
      'spine-unmarked',
      'spine-unmarked',
      ...DAYS_AHEAD,
    ])
    expect(spineStatesOf(shelfOf(rows, 'ערבית')).slice(0, 4)).toEqual([
      'spine-unmarked',
      'spine-unmarked',
      'spine-shema',
      'spine-unmarked',
    ])
    expect(shelfOf(rows, 'תורה')).toHaveAccessibleName('3 מתוך 4 הימים האחרונים עם לימוד')

    const shacharit = shelfOf(rows, 'שחרית')

    expect(todaySlotsOf(shacharit)).toHaveLength(1)
    expect(todaySlotsOf(shacharit)[0]).toContainElement(spinesOf(shacharit)[3])
  })

  it('stands this month’s shelf on a board of 16 days and a board of the rest', async () => {
    await db.days.bulkPut(WEEK_AND_MONTH)
    renderAt('/tabs/stats')

    const rows = await screen.findByRole('list', { name: 'לפי תפילה' })

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(numbersOf(rows, 'מוסף', '0 מתוך 1')).toBeInTheDocument())

    const boards = [...shelfOf(rows, 'שחרית').querySelectorAll('.shelf-board')]

    expect(boards.map((board) => board.querySelectorAll('.spine').length)).toEqual([16, 15])
    expect(spineStatesOf(shelfOf(rows, 'מוסף')).filter((state) => state !== 'spine-blank')).toEqual(['spine-alone'])
    expect(todaySlotsOf(shelfOf(rows, 'שחרית'))).toHaveLength(1)
  })

  it('shows all time since the first record as numbers only, with no shelf', async () => {
    await db.days.bulkPut([
      ...days('2026-09-14', '2026-09-18', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    const rows = await screen.findByRole('list', { name: 'לפי תפילה' })

    ionChange(await ionElement('ion-segment'), 'all')

    await waitFor(() => expect(numbersOf(rows, 'שחרית', '6 מתוך 44 · 0 ברצף · שיא 5')).toBeInTheDocument())
    expect(within(rows).queryAllByRole('img')).toHaveLength(0)
  })

  it('details ביחידות and ק״ש per prayer, with a dash where ק״ש does not apply', async () => {
    await db.days.bulkPut(WEEK_AND_MONTH)
    renderAt('/tabs/stats')

    const detail = await screen.findByRole('table', { name: 'פירוט' })

    expect(within(detail).getByRole('columnheader', { name: 'ביחידות' })).toBeInTheDocument()
    expect(within(detail).getByRole('columnheader', { name: 'ק״ש' })).toBeInTheDocument()
    await waitFor(() => expect(cells(detail, 'שחרית')).toEqual(['0', '0']))
    expect(cells(detail, 'מנחה')).toEqual(['1', '–'])
    expect(cells(detail, 'ערבית')).toEqual(['0', '1'])
    expect(within(detail).queryByRole('rowheader', { name: 'מוסף' })).not.toBeInTheDocument()

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(detail, 'מוסף')).toEqual(['1', '–']))
  })

  it('shows how many days תפילין and טלית were worn, leaving שבת out of תפילין', async () => {
    await db.days.bulkPut([
      day('2026-10-22', { tefillin: true, tallit: true }),
      day('2026-10-24', { tallit: true }),
      day('2026-10-26', { tefillin: true, tallit: true }),
      day('2026-10-27', { tefillin: true }),
    ])
    renderAt('/tabs/stats')

    const worn = await screen.findByRole('table', { name: 'תפילין וטלית' })

    await waitFor(() => expect(cells(worn, 'תפילין')).toEqual(['2 מתוך 3']))
    expect(cells(worn, 'טלית')).toEqual(['1 מתוך 3'])

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(worn, 'תפילין')).toEqual(['3 מתוך 5']))
    expect(cells(worn, 'טלית')).toEqual(['3 מתוך 6'])
  })

  it('explains the empty state', async () => {
    renderAt('/tabs/stats')

    expect(await screen.findByText('עוד אין נתונים')).toBeInTheDocument()
  })
})
