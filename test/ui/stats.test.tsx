import { screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { ionChange, ionElement } from '../helpers/ionic'
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

    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['1', '0', '4']))
    expect(cells(totals, 'מנחה')).toEqual(['0', '1', '4'])
    expect(within(totals).queryByRole('rowheader', { name: 'תורה' })).not.toBeInTheDocument()
    expect(cells(await screen.findByRole('table', { name: 'תורה' }), 'ימים עם לימוד')).toEqual(['1 מתוך 4'])

    ionChange(await ionElement('ion-segment'), 'month')

    await waitFor(() => expect(cells(totals, 'שחרית')).toEqual(['7', '0', '10']))
    expect(cells(totals, 'מוסף')).toEqual(['0', '1', '1'])
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

  it('explains the empty state', async () => {
    renderAt('/tabs/stats')

    expect(await screen.findByText('עוד אין נתונים')).toBeInTheDocument()
  })
})
