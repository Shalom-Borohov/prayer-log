import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { ionChange, ionElement, visibleAll } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

function cells(table: HTMLElement, rowName: string) {
  const row = within(table).getByRole('rowheader', { name: rowName }).closest('tr')

  if (!row) {
    throw new Error(`no row ${rowName}`)
  }

  return within(row)
    .getAllByRole('cell')
    .map((cell) => cell.textContent)
}

const WEEK_AND_MONTH = [
  ...days('2026-10-19', '2026-10-23', { prayers: allMinyan }),
  day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'alone' } }),
  day('2026-10-25', { prayers: { shacharit: 'minyan' }, torah: true }),
  day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' }, torah: true }),
  day('2026-10-27', { prayers: { shacharit: 'minyan', maariv: 'shema' }, torah: true }),
]

function figures() {
  return Object.fromEntries(visibleAll('dt').map((term) => [term.textContent, term.nextElementSibling?.textContent]))
}

const starNames =(line: HTMLElement) =>
  within(line)
    .getAllByRole('img')
    .map((star) => star.getAttribute('aria-label'))

const starLabels = (line: HTMLElement) =>
  Array.from(line.querySelectorAll('.star-line-label'))
    .map((label) => label.textContent)
    .filter(Boolean)

const trendTicks = (unit: string) => starLabels(screen.getByRole('group', { name: unit }))

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

  it('shows three figures and a line per prayer with its count, streak and best, then this month', async () => {
    await db.days.bulkPut(WEEK_AND_MONTH)
    renderAt('/tabs/stats')

    const lines = await screen.findByRole('table', { name: 'לפי תפילה' })

    await waitFor(() => expect(cells(lines, 'שחרית')).toEqual(['3 מתוך 3', '9 ברצף', 'שיא 9']))
    expect(cells(lines, 'מנחה')).toEqual(['0 מתוך 3', '0 ברצף', 'שיא 5'])
    expect(cells(lines, 'ערבית')).toEqual(['0 מתוך 3', '0 ברצף', 'שיא 5'])
    expect(cells(lines, 'תורה')).toEqual(['3 מתוך 3', '3 ברצף', 'שיא 3'])
    expect(within(lines).queryByRole('rowheader', { name: 'מוסף' })).not.toBeInTheDocument()
    expect(figures()).toEqual({ ביחידות: '1', 'ק״ש בלבד': '1', 'ימי לימוד': '3' })

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(lines, 'שחרית')).toEqual(['9 מתוך 9', '9 ברצף', 'שיא 9']))
    expect(cells(lines, 'מוסף')).toEqual(['0 מתוך 1', '', ''])
    expect(figures()).toEqual({ ביחידות: '2', 'ק״ש בלבד': '1', 'ימי לימוד': '3' })
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

  it('draws this week as a line of day stars, speaking each tracked day so far', async () => {
    await db.days.bulkPut([day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' } })])
    renderAt('/tabs/stats')

    const line = await screen.findByRole('group', { name: 'לפי יום' })

    await waitFor(() =>
      expect(starNames(line)).toEqual([
        'יום שני 26.10: 1 במניין, 2 ביחידות או ק״ש, מתוך 3',
        'יום שלישי 27.10: 0 במניין, 0 ביחידות או ק״ש, מתוך 3',
      ]),
    )
    expect(starLabels(line)).toEqual(['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'])
    expect(screen.queryByRole('heading', { name: 'מדף' })).not.toBeInTheDocument()
  })

  it('shows all time since the first record, one star per week', async () => {
    await db.days.bulkPut([
      ...days('2026-09-14', '2026-09-18', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    const lines = await screen.findByRole('table', { name: 'לפי תפילה' })

    ionChange(await ionElement('ion-segment'), 'all')

    await waitFor(() => expect(cells(lines, 'שחרית')).toEqual(['6 מתוך 44', '0 ברצף', 'שיא 5']))

    const line = screen.getByRole('group', { name: 'לפי שבוע' })

    expect(starNames(line)).toContain('25.10–28.10: 1 במניין, 1 ביחידות או ק״ש, מתוך 9')
    expect(starNames(line)[0]).toMatch(/^14\.9–19\.9: 5 במניין, 0 ביחידות או ק״ש, מתוך \d+$/)
  })

  it('draws a + for a week with nothing marked, as for a day', async () => {
    await db.days.bulkPut([
      ...days('2026-09-14', '2026-09-18', { prayers: { shacharit: 'alone' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    const emptyWeek = await screen.findByRole('img', { name: /^20\.9–26\.9: 0 במניין, 0 ביחידות או ק״ש/ })
    const aloneWeek = screen.getByRole('img', { name: /^14\.9–19\.9: 0 במניין, 5 ביחידות או ק״ש/ })

    expect(emptyWeek.querySelector('.star-unmarked')).not.toBeNull()
    expect(aloneWeek.querySelector('.star-unmarked')).toBeNull()
  })

  it('charts a long history by quarter, marking the axis with the year on each first quarter', async () => {
    await db.days.bulkPut([
      day('2022-09-15', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    expect(await screen.findByRole('group', { name: 'לפי רבעון' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^ינואר–מרץ 2026: 1 במניין, 1 ביחידות או ק״ש, מתוך \d+$/ })).toBeInTheDocument()
    expect(trendTicks('לפי רבעון')).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('labels a first quarter that starts at the first record', async () => {
    await db.days.bulkPut([day('2023-02-10', { prayers: { shacharit: 'minyan' } })])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    await screen.findByRole('group', { name: 'לפי רבעון' })
    expect(trendTicks('לפי רבעון')).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('charts a very long history by year', async () => {
    await db.days.bulkPut([
      day('2015-03-01', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    expect(await screen.findByRole('group', { name: 'לפי שנה' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /^2026: 1 במניין, 0 ביחידות או ק״ש, מתוך \d+$/ })).toBeInTheDocument()
    expect(trendTicks('לפי שנה')).toEqual(['2015', '2017', '2019', '2021', '2023', '2025'])
  })

  it('draws this month as a line of day stars, numbering the 1st, every 5th day and today, leaving room around today', async () => {
    await db.days.bulkPut([
      day('2026-10-27', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-28', { prayers: { maariv: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'month')

    const line = await screen.findByRole('group', { name: 'לפי יום' })

    await waitFor(() =>
      expect(starNames(line)).toEqual([
        'יום שלישי 27.10: 1 במניין, 0 ביחידות או ק״ש, מתוך 3',
        'יום רביעי 28.10: 0 במניין, 1 ביחידות או ק״ש, מתוך 1',
      ]),
    )
    expect(starLabels(line)).toEqual(['1', '5', '10', '15', '20', '25', '28'])
  })

  it('explains the empty state', async () => {
    renderAt('/tabs/stats')

    expect(await screen.findByText('עוד אין נתונים')).toBeInTheDocument()
  })
})

describe('stats at the start of a week', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 25, 10).getTime())

  it('names the chart when no day of the week has a count yet', async () => {
    await db.days.put(day('2026-10-20', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/stats')

    const chart = await screen.findByRole('group', { name: 'לפי יום' })

    expect(within(chart).getByRole('img')).toHaveAccessibleName('עוד אין נתונים')
  })
})
