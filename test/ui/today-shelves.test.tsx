import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { markIn, markInMinyanSkippingPlace, row } from '../helpers/dayRows'
import { renderAt } from '../helpers/renderAt'
import { spineStatesOf, spinesOf, todaySlotsOf } from '../helpers/shelves'

const wednesday = new Date(2026, 9, 28, 10).getTime()

const shelfOf = async (label: string) => within(await row(label)).getByRole('img')

const shownDaySpine = async (label: string) => spinesOf(await shelfOf(label)).at(-1)

describe('the week shelves on היום', () => {
  beforeEach(resetDb)
  freezeDate(wednesday)

  it.each([
    ['במניין', 'spine-done'],
    ['ביחידות', 'spine-alone'],
    ['ק״ש בלבד', 'spine-shema'],
  ] as const)('stands today’s שחרית spine as %s', async (attendance, spineState) => {
    renderAt('/tabs/today')

    if (attendance === 'במניין') {
      await markInMinyanSkippingPlace('שחרית')
    } else {
      await markIn('שחרית', attendance)
    }

    await waitFor(async () => expect(await shownDaySpine('שחרית')).toHaveClass(spineState))
  })

  it('stamps today’s spine when it is marked במניין, and not when it is marked ביחידות', async () => {
    renderAt('/tabs/today')

    await markInMinyanSkippingPlace('שחרית')
    await markIn('מנחה', 'ביחידות')

    await waitFor(async () => expect(await shownDaySpine('שחרית')).toHaveClass('spine-done', 'spine-stamp'))
    await waitFor(async () => expect(await shownDaySpine('מנחה')).toHaveClass('spine-alone'))
    expect(await shownDaySpine('מנחה')).not.toHaveClass('spine-stamp')
  })

  it('does not stamp a spine that was already במניין when the day opened', async () => {
    await db.days.put(day('2026-10-28', { prayers: { maariv: 'minyan' } }))
    renderAt('/tabs/today')

    await waitFor(async () => expect(await shownDaySpine('ערבית')).toHaveClass('spine-done'))
    expect(await shownDaySpine('ערבית')).not.toHaveClass('spine-stamp')
  })

  it('marks today under the last slot of today’s shelves', async () => {
    renderAt('/tabs/today')

    const shelf = await shelfOf('שחרית')

    expect(spinesOf(shelf)).toHaveLength(7)
    expect(todaySlotsOf(shelf)).toHaveLength(1)
    expect(todaySlotsOf(shelf)[0]).toContainElement(spinesOf(shelf)[6])
    expect(todaySlotsOf(await shelfOf('תורה'))).toHaveLength(1)
  })

  it('marks no today slot on a past day’s shelves, which end on that day', async () => {
    await db.days.put(day('2026-10-27', { prayers: { shacharit: 'alone' } }))
    renderAt('/tabs/today/2026-10-27')

    await waitFor(async () => expect(await shownDaySpine('שחרית')).toHaveClass('spine-alone'))
    expect(todaySlotsOf(await shelfOf('שחרית'))).toHaveLength(0)
    expect(todaySlotsOf(await shelfOf('תורה'))).toHaveLength(0)
  })

  it('leaves מוסף’s slot blank on the days it is not said, with no streak in its row', async () => {
    await db.days.bulkPut([
      day('2026-10-17', { prayers: { shacharit: 'minyan', musaf: 'minyan' } }),
      day('2026-10-24', { prayers: { musaf: 'minyan' } }),
    ])
    renderAt('/tabs/today/2026-10-24')

    await waitFor(async () =>
      expect(spineStatesOf(await shelfOf('מוסף'))).toEqual([
        'spine-blank',
        'spine-blank',
        'spine-blank',
        'spine-blank',
        'spine-blank',
        'spine-blank',
        'spine-done',
      ]),
    )
    expect(spineStatesOf(await shelfOf('שחרית')).slice(0, 6)).toEqual(Array(6).fill('spine-unmarked'))
    expect(within(await row('מוסף')).queryByText(/ברצף/)).not.toBeInTheDocument()
  })

  it('stands the Torah spine done when למדתי תורה is ticked', async () => {
    await db.days.put(day('2026-10-27', { prayers: { shacharit: 'alone' } }))
    renderAt('/tabs/today')

    await waitFor(async () => expect(await shownDaySpine('תורה')).toHaveClass('spine-unmarked'))

    fireEvent.click(await screen.findByRole('checkbox', { name: 'למדתי תורה' }))

    await waitFor(async () => expect(await shownDaySpine('תורה')).toHaveClass('spine-done'))
  })

  it('names each shelf by its track and the days since tracking started', async () => {
    await db.days.put(day('2026-10-27', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/today')

    expect(await screen.findByRole('img', { name: 'שחרית: 1 מתוך 2 הימים האחרונים במניין' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'ערבית: 0 מתוך 2 הימים האחרונים במניין' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'תורה: 0 מתוך 2 הימים האחרונים עם לימוד' })).toBeInTheDocument()
  })

  it('counts מוסף only on the days it applied', async () => {
    await db.days.put(day('2026-10-24', { prayers: { musaf: 'minyan' } }))
    renderAt('/tabs/today/2026-10-24')

    expect(await screen.findByRole('img', { name: 'מוסף: 1 מתוך יום אחד במניין' })).toBeInTheDocument()
  })
})
