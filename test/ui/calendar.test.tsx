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

  it('draws a mark for each of תפילין and טלית on a day with both', async () => {
    await db.days.put(day('2026-10-20', { tefillin: true, tallit: true }))
    renderAt('/tabs/calendar')

    const dayCell = await cell('20.10')

    expect(dayCell.querySelector('.month-day-worn')).toHaveClass('hue-shacharit')
    expect(dayCell.querySelector('.worn-mark-tefillin')).toHaveClass('is-marked')
    expect(dayCell.querySelector('.worn-mark-tallit')).toHaveClass('is-marked')
  })

  it('keeps the תפילין place blank on a day with only טלית', async () => {
    await db.days.put(day('2026-10-20', { tallit: true }))
    renderAt('/tabs/calendar')

    const dayCell = await cell('20.10')

    expect(dayCell.querySelector('.worn-mark-tefillin')).not.toHaveClass('is-marked')
    expect(dayCell.querySelector('.worn-mark-tallit')).toHaveClass('is-marked')
  })

  it('draws no תפילין or טלית mark on a blank day', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/calendar')

    const blankDay = await cell('16.10')

    expect(blankDay.querySelectorAll('.worn-mark')).toHaveLength(2)
    expect(blankDay.querySelectorAll('.is-marked')).toHaveLength(0)
  })

  it('shows the mark alongside dashed spines on a day with only תפילין', async () => {
    await db.days.put(day('2026-10-20', { tefillin: true }))
    renderAt('/tabs/calendar')

    const dayCell = await cell('20.10')

    expect(dayCell.querySelectorAll('.spine-empty')).toHaveLength(4)
    expect(dayCell.querySelector('.worn-mark-tefillin')).toHaveClass('is-marked')
  })

  it('does not draw תפילין stored on שבת', async () => {
    await db.days.put(day('2026-10-17', { tefillin: true, tallit: true }))
    renderAt('/tabs/calendar')

    const shabbat = await cell('17.10')

    expect(shabbat.querySelector('.worn-mark-tefillin')).not.toHaveClass('is-marked')
    expect(shabbat.querySelector('.worn-mark-tallit')).toHaveClass('is-marked')
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
    expect((await buttonByLabel('היום הקודם')).closest('ion-footer')).not.toBeNull()
    expect((await buttonByLabel('היום הבא')).closest('ion-footer')).not.toBeNull()
  })

  it('moves between months but not past this one', async () => {
    renderAt('/tabs/calendar')

    const next = await buttonByLabel('החודש הבא')
    const previous = await buttonByLabel('החודש הקודם')

    expect(next).toHaveAttribute('disabled')
    expect(next.closest('ion-footer')).not.toBeNull()
    expect(previous.closest('ion-footer')).not.toBeNull()
    fireEvent.click(previous)

    expect(await screen.findByText('ספטמבר 2026')).toBeInTheDocument()
    expect(await screen.findByText('יום כיפור')).toBeInTheDocument()
  })
})
