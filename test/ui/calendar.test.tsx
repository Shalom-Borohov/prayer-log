import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { buttonByLabel } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'

const cell = (date: string) => screen.findByRole('button', { name: (name) => name.includes(` ${date},`) })

describe('calendar', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('shows the month with each day’s marks', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan', mincha: 'alone' } }))
    renderAt('/tabs/calendar')

    expect(await screen.findByText('אוקטובר 2026')).toBeInTheDocument()
    expect(await cell('15.10')).toHaveAccessibleName('יום חמישי 15.10, ד׳ בחשון: שחרית במניין, מנחה ביחידות')
    expect(await cell('16.10')).toHaveAccessibleName('יום שישי 16.10, ה׳ בחשון: לא סומן')
    expect(await cell('29.10')).toBeDisabled()
  })

  it('names ק״ש בלבד, תפילין and טלית in a day’s label', async () => {
    await db.days.put(
      day('2026-10-20', {
        prayers: { shacharit: 'shema', mincha: 'minyan' },
        tefillin: true,
        tallit: true,
        torah: true,
      }),
    )
    renderAt('/tabs/calendar')

    expect(await cell('20.10')).toHaveAccessibleName(
      'יום שלישי 20.10, ט׳ בחשון: שחרית ק״ש בלבד, מנחה במניין, תפילין, טלית, למדתי תורה',
    )
  })

  it('draws a ק״ש בלבד mark as a short spine', async () => {
    await db.days.put(day('2026-10-20', { prayers: { shacharit: 'shema', maariv: 'minyan' } }))
    renderAt('/tabs/calendar')

    const shortSpines = (await cell('20.10')).querySelectorAll('.spine-short')

    expect(shortSpines).toHaveLength(1)
    expect(shortSpines[0]).toHaveClass('hue-shacharit')
  })

  it('leaves days before tracking started without slots', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/calendar')

    expect((await cell('14.10')).querySelectorAll('.spine-none')).toHaveLength(4)
    expect((await cell('16.10')).querySelectorAll('.spine-empty')).toHaveLength(4)
  })

  it('opens a past day to edit it', async () => {
    renderAt('/tabs/calendar')

    fireEvent.click(await cell('15.10'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar/2026-10-15'))
    expect(await screen.findByText('יום חמישי · ד׳ בחשון · 15.10')).toBeInTheDocument()
  })

  it('moves between months but not past this one', async () => {
    renderAt('/tabs/calendar')

    expect(await buttonByLabel('החודש הבא')).toHaveAttribute('disabled')
    fireEvent.click(await buttonByLabel('החודש הקודם'))

    expect(await screen.findByText('ספטמבר 2026')).toBeInTheDocument()
    expect(await screen.findByText('יום כיפור')).toBeInTheDocument()
  })
})
