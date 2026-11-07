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

function trendTicks() {
  return visibleAll('.trend-ticks span')
    .map((tick) => tick.textContent)
    .filter(Boolean)
}

describe('stats', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('shows this week per prayer, then this month', async () => {
    await db.days.bulkPut([
      ...days('2026-10-19', '2026-10-23', { prayers: allMinyan, torah: true }),
      day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'alone' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' }, torah: true }),
    ])
    renderAt('/tabs/stats')

    const totals = await screen.findByRole('table', { name: 'לפי תפילה' })

    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['1', '0', '0', '4']))
    expect(cells(totals, 'מנחה')).toEqual(['0', '1', '–', '4'])
    expect(within(totals).queryByRole('rowheader', { name: 'תורה' })).not.toBeInTheDocument()
    expect(cells(await screen.findByRole('table', { name: 'תורה' }), 'ימים עם לימוד')).toEqual(['1 מתוך 4'])

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['7', '0', '0', '10']))
    expect(cells(totals, 'מוסף')).toEqual(['0', '1', '–', '1'])
  })

  it('counts ק״ש בלבד per prayer, with a dash where it does not apply', async () => {
    await db.days.bulkPut([
      day('2026-10-25', { prayers: { shacharit: 'shema', mincha: 'alone', maariv: 'shema' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', maariv: 'shema' } }),
    ])
    renderAt('/tabs/stats')

    const totals = await screen.findByRole('table', { name: 'לפי תפילה' })

    expect(within(totals).getByRole('columnheader', { name: 'ק״ש' })).toBeInTheDocument()
    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['1', '0', '1', '4']))
    expect(cells(totals, 'מנחה')).toEqual(['0', '1', '–', '4'])
    expect(cells(totals, 'ערבית')).toEqual(['0', '0', '2', '4'])
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

    await waitFor(() => expect(cells(worn, 'תפילין')).toEqual(['2 מתוך 4']))
    expect(cells(worn, 'טלית')).toEqual(['1 מתוך 4'])

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(worn, 'תפילין')).toEqual(['3 מתוך 6']))
    expect(cells(worn, 'טלית')).toEqual(['3 מתוך 7'])
  })

  it('shows current and best streaks', async () => {
    await db.days.bulkPut([
      ...days('2026-10-10', '2026-10-15', { prayers: { shacharit: 'minyan' } }),
      ...days('2026-10-25', '2026-10-27', { prayers: { shacharit: 'minyan' }, torah: true }),
    ])
    renderAt('/tabs/stats')

    const table = await screen.findByRole('table', { name: 'רצפים' })

    await waitFor(() => expect(cells(table, 'שחרית')).toEqual(['3', '6']))
    expect(cells(table, 'תורה')).toEqual(['3', '3'])
    expect(cells(table, 'ערבית')).toEqual(['0', '0'])
  })

  it('charts this week by day, with the shelves under the tables', async () => {
    await db.days.bulkPut([day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' } })])
    renderAt('/tabs/stats')

    expect(await screen.findByRole('group', { name: 'לפי יום' })).toBeInTheDocument()
    expect(await screen.findByRole('img', { name: /יום שני 26\.10: 1 במניין, 2 ביחידות או ק״ש, מתוך 3/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'מדף' })).toBeInTheDocument()
  })

  it('shows all time since the first record, without the shelves', async () => {
    await db.days.bulkPut([
      ...days('2026-09-14', '2026-09-18', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    const totals = await screen.findByRole('table', { name: 'לפי תפילה' })

    ionChange(await ionElement('ion-segment'), 'all')

    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['6', '0', '0', '45']))
    expect(screen.getByRole('group', { name: 'לפי שבוע' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /25\.10–28\.10: 1 במניין, 1 ביחידות או ק״ש, מתוך 9/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'מדף' })).not.toBeInTheDocument()
  })

  it('charts a long history by quarter, marking the axis with the year on each first quarter', async () => {
    await db.days.bulkPut([
      day('2022-09-15', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    expect(await screen.findByRole('group', { name: 'לפי רבעון' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /ינואר–מרץ 2026: 1 במניין, 1 ביחידות או ק״ש, מתוך \d+/ })).toBeInTheDocument()
    expect(trendTicks()).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('labels a first quarter that starts at the first record', async () => {
    await db.days.bulkPut([day('2023-02-10', { prayers: { shacharit: 'minyan' } })])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    await screen.findByRole('group', { name: 'לפי רבעון' })
    expect(trendTicks()).toEqual(['2023', '2024', '2025', '2026'])
  })

  it('charts a very long history by year', async () => {
    await db.days.bulkPut([
      day('2015-03-01', { prayers: { shacharit: 'alone' } }),
      day('2026-02-10', { prayers: { shacharit: 'minyan' } }),
    ])
    renderAt('/tabs/stats')

    ionChange(await ionElement('ion-segment'), 'all')

    expect(await screen.findByRole('group', { name: 'לפי שנה' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /(^| · )2026: 1 במניין, 0 ביחידות או ק״ש, מתוך \d+/ })).toBeInTheDocument()
    expect(trendTicks()).toEqual(['2015', '2017', '2019', '2021', '2023', '2025'])
  })

  it('leaves days before tracking out of a shelf’s count', async () => {
    await db.days.put(day('2026-10-27', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/stats')

    expect(await screen.findByRole('img', { name: '1 מתוך 2 הימים האחרונים במניין' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: '0 מתוך 2 הימים האחרונים עם לימוד' })).toBeInTheDocument()
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
