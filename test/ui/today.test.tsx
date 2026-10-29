import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day, days } from '../helpers/days'
import { buttonByLabel, ionChange, ionField } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const wednesday = new Date(2026, 9, 28, 10).getTime()

const row = (label: string) => screen.findByRole('group', { name: label })

async function markIn(label: string, state: 'במניין' | 'ביחידות' | 'ק״ש בלבד') {
  fireEvent.click(within(await row(label)).getByRole('button', { name: state }))
}

describe('today', () => {
  beforeEach(resetDb)
  freezeDate(wednesday)

  it('shows the date header and the three daily prayers', async () => {
    renderAt('/tabs/today')

    expect(await screen.findByText('יום רביעי · י״ז בחשון · 28.10')).toBeInTheDocument()
    expect(await row('שחרית')).toBeInTheDocument()
    expect(await row('מנחה')).toBeInTheDocument()
    expect(await row('ערבית')).toBeInTheDocument()
    expect(screen.queryByRole('group', { name: 'מוסף' })).not.toBeInTheDocument()
  })

  it('treats 02:30 as the previous day', async () => {
    vi.setSystemTime(new Date(2026, 9, 29, 2, 30))
    renderAt('/tabs/today')

    expect(await screen.findByText('יום רביעי · י״ז בחשון · 28.10')).toBeInTheDocument()
  })

  it('marks a prayer and clears it with a second tap', async () => {
    renderAt('/tabs/today')

    await markIn('שחרית', 'במניין')

    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ shacharit: 'minyan' }))
    expect(within(await row('שחרית')).getByRole('button', { name: 'במניין' })).toHaveAttribute('aria-pressed', 'true')

    await markIn('שחרית', 'ביחידות')
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ shacharit: 'alone' }))

    await markIn('שחרית', 'ביחידות')
    await waitFor(async () => expect(await db.days.get('2026-10-28')).toBeUndefined())
  })

  it('offers ק״ש בלבד on שחרית and ערבית but not on מנחה', async () => {
    renderAt('/tabs/today')

    const segments = async (label: string) =>
      within(await row(label))
        .getAllByRole('button')
        .map((segment) => segment.textContent)

    expect(await segments('שחרית')).toEqual(['במניין', 'ביחידות', 'ק״ש בלבד'])
    expect(await segments('ערבית')).toEqual(['במניין', 'ביחידות', 'ק״ש בלבד'])
    expect(await segments('מנחה')).toEqual(['במניין', 'ביחידות'])
  })

  it('marks ק״ש בלבד and clears it with a second tap', async () => {
    renderAt('/tabs/today')

    await markIn('שחרית', 'ק״ש בלבד')

    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.prayers).toEqual({ shacharit: 'shema' }))
    expect(within(await row('שחרית')).getByRole('button', { name: 'ק״ש בלבד' })).toHaveAttribute('aria-pressed', 'true')

    await markIn('שחרית', 'ק״ש בלבד')
    await waitFor(async () => expect(await db.days.get('2026-10-28')).toBeUndefined())
  })

  it('shelves a ק״ש בלבד day as a short spine', async () => {
    renderAt('/tabs/today')

    await markIn('ערבית', 'ק״ש בלבד')

    await waitFor(async () =>
      expect(within(await row('ערבית')).getByRole('img').lastElementChild).toHaveClass('spine-short'),
    )
  })

  it('records wearing תפילין in the שחרית row and clears it with a second tap', async () => {
    renderAt('/tabs/today')

    const shacharit = await row('שחרית')

    expect(within(shacharit).getByRole('checkbox', { name: 'טלית' })).toHaveAttribute('aria-checked', 'false')

    fireEvent.click(within(shacharit).getByRole('checkbox', { name: 'תפילין' }))
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.tefillin).toBe(true))
    expect(within(await row('שחרית')).getByRole('checkbox', { name: 'תפילין' })).toHaveAttribute('aria-checked', 'true')

    fireEvent.click(within(await row('שחרית')).getByRole('checkbox', { name: 'תפילין' }))
    await waitFor(async () => expect(await db.days.get('2026-10-28')).toBeUndefined())
  })

  it.each([
    ['שבת', '2026-10-24'],
    ['חול המועד', '2026-09-28'],
  ])('offers only טלית on %s', async (_occasion, date) => {
    renderAt(`/tabs/today/${date}`)

    const shacharit = await row('שחרית')

    expect(within(shacharit).getByRole('checkbox', { name: 'טלית' })).toBeInTheDocument()
    expect(within(shacharit).queryByRole('checkbox', { name: 'תפילין' })).not.toBeInTheDocument()
  })

  it('stamps today’s spine only when the tap marks it במניין', async () => {
    await db.days.put(day('2026-10-28', { prayers: { maariv: 'minyan' } }))
    renderAt('/tabs/today')

    const lastSpine = async (label: string) => within(await row(label)).getByRole('img').lastElementChild

    await waitFor(async () => expect(await lastSpine('ערבית')).toHaveClass('spine-gold'))
    expect(await lastSpine('ערבית')).not.toHaveClass('spine-stamp')

    await markIn('שחרית', 'במניין')

    await waitFor(async () => expect(await lastSpine('שחרית')).toHaveClass('spine-gold', 'spine-stamp'))
  })

  it('shows each prayer streak, counting a still-blank today', async () => {
    await db.days.bulkPut([
      ...days('2026-10-24', '2026-10-27', { prayers: { shacharit: 'minyan' } }),
      day('2026-10-27', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/today')

    expect(within(await row('שחרית')).getByText('4 ימים ברצף')).toBeInTheDocument()
    expect(within(await row('מנחה')).getByText('אין רצף')).toBeInTheDocument()
  })

  it('shows מוסף on שבת', async () => {
    renderAt('/tabs/today/2026-10-24')

    expect(await screen.findByText('שבת · י״ג בחשון · 24.10')).toBeInTheDocument()
    expect(await row('מוסף')).toBeInTheDocument()
  })

  it('shows the holiday name in the header', async () => {
    vi.setSystemTime(new Date(2026, 10, 11, 10))
    renderAt('/tabs/today')

    expect(await screen.findByText('ראש חודש כסלו')).toBeInTheDocument()
    expect(await row('מוסף')).toBeInTheDocument()
  })

  it('records Torah learning with a note', async () => {
    renderAt('/tabs/today')

    fireEvent.click(await screen.findByRole('checkbox', { name: 'למדתי תורה' }))
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.torah).toBe(true))

    ionChange(await ionField('מה למדתי'), ' דף יומי ברכות ה׳ ')
    await waitFor(async () => expect((await db.days.get('2026-10-28'))?.torahNote).toBe('דף יומי ברכות ה׳'))
  })

  it('sums the week so far', async () => {
    await db.days.bulkPut([
      day('2026-10-25', { prayers: allMinyan, torah: true }),
      day('2026-10-26', { prayers: { shacharit: 'minyan', mincha: 'alone' } }),
    ])
    renderAt('/tabs/today')

    const week = await screen.findByRole('table', { name: 'השבוע' })

    await waitFor(() => expect(within(week).getByText('4 מתוך 12')).toBeInTheDocument())
    expect(within(week).getByText('1')).toBeInTheDocument()
    expect(within(week).getByText('1 מתוך 4')).toBeInTheDocument()
  })

  it('sums ק״ש בלבד, תפילין and טלית for the week, with תפילין skipping שבת', async () => {
    await db.days.bulkPut([
      day('2026-10-22', {
        prayers: { shacharit: 'minyan', mincha: 'alone', maariv: 'shema' },
        torah: true,
        tefillin: true,
        tallit: true,
      }),
      day('2026-10-23', { prayers: { shacharit: 'shema' } }),
      day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'minyan' }, tallit: true }),
    ])
    renderAt('/tabs/today/2026-10-24')

    const week = await screen.findByRole('table', { name: '18.10–24.10' })

    const weekRows = () =>
      within(week)
        .getAllByRole('row')
        .map((weekRow) => [
          within(weekRow).getByRole('rowheader').textContent,
          within(weekRow).getByRole('cell').textContent,
        ])

    await waitFor(() =>
      expect(weekRows()).toEqual([
        ['במניין', '3 מתוך 10'],
        ['ביחידות', '1'],
        ['ק״ש בלבד', '2'],
        ['תפילין', '1 מתוך 2'],
        ['טלית', '2 מתוך 3'],
        ['למדתי תורה', '1 מתוך 3'],
      ]),
    )
  })

  it('steps back through past days but never into the future', async () => {
    renderAt('/tabs/today')

    expect(await buttonByLabel('היום הבא')).toHaveAttribute('disabled')
    fireEvent.click(await buttonByLabel('היום הקודם'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-27'))
    expect(await screen.findByText('יום שלישי · ט״ז בחשון · 27.10')).toBeInTheDocument()

    await markIn('ערבית', 'במניין')
    await waitFor(async () => expect((await db.days.get('2026-10-27'))?.prayers).toEqual({ maariv: 'minyan' }))
  })

  it('offers to fill a fully empty recent day', async () => {
    await db.days.bulkPut([
      ...days('2026-10-20', '2026-10-23', { prayers: allMinyan }),
      ...days('2026-10-25', '2026-10-27', { prayers: { shacharit: 'alone' } }),
    ])
    renderAt('/tabs/today')

    fireEvent.click(await screen.findByText('שבת 24.10 לא מולאה'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-24'))
  })

  it('offers to fill a blank ערבית on the eve of שבת', async () => {
    await db.days.bulkPut([
      day('2026-10-22', { prayers: allMinyan }),
      day('2026-10-23', { prayers: { shacharit: 'minyan', mincha: 'minyan' } }),
      ...days('2026-10-24', '2026-10-27', { prayers: { shacharit: 'minyan' } }),
    ])
    renderAt('/tabs/today')

    fireEvent.click(await screen.findByText('ערבית של יום שישי 23.10 לא סומנה'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/today/2026-10-23'))
  })
})
