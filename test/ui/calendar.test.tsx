import { fireEvent, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { buttonByLabel, cell, ionElement, shownText, visibleAll } from '../helpers/ionic'
import { currentPath, renderAt } from '../helpers/renderAt'
import { spineStatesOf } from '../helpers/shelves'

const OCTOBER_LINE = 'אוקטובר 2026 · תשרי–חשון תשפ״ז'

const columnNamed = (start: string) => screen.findByRole('button', { name: (name) => name.startsWith(start) })

const weekDates = () => visibleAll('.week-card-dates').map(shownText)

const spinesIn = (column: Element, state: string) => spineStatesOf(column).filter((spine) => spine === `spine-${state}`).length

const dayColumns = () => visibleAll('.week-shelves-day')

const weekCardOf = (column: Element) => visibleAll('.week-card').filter((card) => card.contains(column))[0]

const rowLabelsOf = (week: Element) => Array.from(week.querySelectorAll('.week-shelves-label'), shownText)

describe('calendar', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('shows the month as a card per week, newest first', async () => {
    renderAt('/tabs/calendar')

    await cell(1)

    expect(shownText(await ionElement('.day-heading p'))).toBe(OCTOBER_LINE)
    expect(weekDates()).toEqual(['25–31.10', '18–24.10', '11–17.10', '4–10.10', '27.9–3.10'])
  })

  it('names each day’s column with its marks', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan', mincha: 'alone' } }))
    renderAt('/tabs/calendar')

    expect(await cell(15)).toHaveAccessibleName('15 ד׳ בחשון, יום חמישי: שחרית במניין, מנחה ביחידות')
    expect(await cell(16)).toHaveAccessibleName('16 ה׳ בחשון, יום שישי: לא סומן')
  })

  it('names ק״ש בלבד and learning in a day’s name, but not תפילין or טלית, which לוח doesn’t show', async () => {
    await db.days.put(
      day('2026-10-20', {
        prayers: { shacharit: 'shema', mincha: 'minyan' },
        tefillin: true,
        tallit: true,
        torah: true,
      }),
    )
    renderAt('/tabs/calendar')

    expect(await cell(20)).toHaveAccessibleName('20 ט׳ בחשון, יום שלישי: שחרית ק״ש בלבד, מנחה במניין, למדתי תורה')
  })

  it('heads each column with the weekday letter, the day and the Hebrew day, and names it from the day on', async () => {
    renderAt('/tabs/calendar')

    expect(shownText(await cell(15))).toBe('ה 15 ד׳')

    const columns = dayColumns()

    expect(columns).toHaveLength(35)
    for (const column of columns) {
      const [, dayNumber, hebrewDay] = shownText(column).split(' ')

      expect(hebrewDay).toMatch(/^[א-ת]+[׳״]?[א-ת]*$/)
      expect(column).toHaveAccessibleName(expect.stringMatching(new RegExp(`^${dayNumber} ${hebrewDay} `)))
    }
  })

  it('marks today and dims the days ahead, with no spines and no way in', async () => {
    renderAt('/tabs/calendar')

    await cell(1)

    const [todayColumn] = visibleAll('.week-shelves-day.is-today')
    const ahead = await cell(31)

    expect(todayColumn).toHaveAccessibleName(expect.stringMatching(/^28 י״ז בחשון/))
    expect(visibleAll('.week-shelves-day.is-today')).toHaveLength(1)
    expect(ahead).toBeDisabled()
    expect(ahead).toHaveClass('is-dimmed')
    expect(spineStatesOf(ahead).filter((spine) => spine !== 'spine-blank')).toHaveLength(0)
  })

  it('puts the today mark under today’s day number, and on no other day', async () => {
    renderAt('/tabs/calendar')

    await cell(1)

    const marks = visibleAll('.week-today-mark')

    expect(marks).toHaveLength(1)
    expect(marks[0].closest('.week-shelves-day')).toHaveAccessibleName(expect.stringMatching(/^28 י״ז בחשון/))
  })

  it('shelves a row for each prayer of the week, then תורה, with a spine for each day', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan' } }))
    await db.days.put(day('2026-10-20', { prayers: { shacharit: 'shema', maariv: 'minyan' }, tefillin: true }))
    renderAt('/tabs/calendar')

    const marked = await cell(20)

    expect(rowLabelsOf(weekCardOf(marked))).toEqual(['שחרית', 'מוסף', 'מנחה', 'ערבית', 'תורה'])
    expect(spinesIn(marked, 'shema')).toBe(1)
    expect(spinesIn(marked, 'done')).toBe(1)
    expect(spinesIn(marked, 'unmarked')).toBe(2)
    expect(spinesIn(marked, 'blank')).toBe(1)
  })

  it('gives the מוסף row a spine only on שבת and ראש חודש', async () => {
    await db.days.put(day('2026-10-04', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/calendar')

    const musafRowIndex = rowLabelsOf(weekCardOf(await cell(18))).indexOf('מוסף')
    const musafStates = dayColumns().map((column) => spineStatesOf(column)[musafRowIndex])

    const musafDays = dayColumns()
      .filter((_, index) => musafStates[index] !== 'spine-blank')
      .map((column) => shownText(column).split(' ')[1])

    expect(musafDays).toEqual(['24', '11', '12', '17', '10'])
  })

  it('leaves days before tracking started blank', async () => {
    await db.days.put(day('2026-10-15', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/calendar')

    expect(spinesIn(await cell(14), 'blank')).toBe(5)
    expect(spinesIn(await cell(16), 'unmarked')).toBe(4)
  })

  it('marks a holiday’s day in gold and names the week’s holidays under its chart', async () => {
    renderAt('/tabs/calendar')

    expect((await cell(11)).querySelector('.week-day-number')).toHaveClass('is-holiday')
    expect((await cell(13)).querySelector('.week-day-number')).not.toHaveClass('is-holiday')
    expect(visibleAll('.week-card-holidays').map(shownText)).toEqual([
      '11–12 ראש חודש חשון',
      '5 יום הזיכרון לחללי מלחמת חרבות ברזל',
      '27 סוכות ב׳ (חוה״מ) · 28 סוכות ג׳ (חוה״מ) · 29 סוכות ד׳ (חוה״מ) · 30 סוכות ה׳ (חוה״מ) · 1 סוכות ו׳ (חוה״מ) · 2 סוכות ז׳ (הושענא רבה) · 3 שמיני עצרת',
    ])
  })

  it('keeps a holiday’s day range reading left to right inside the Hebrew line', async () => {
    renderAt('/tabs/calendar')

    await cell(11)
    const [line] = visibleAll('.week-card-holidays')

    expect(line.querySelector('[dir="ltr"]')).toHaveTextContent(/^11–12$/)
  })

  it('dims the day number of the neighbouring month and keeps its spines', async () => {
    await db.days.put(day('2026-09-30', { prayers: { shacharit: 'minyan' } }))
    renderAt('/tabs/calendar')

    const neighbour = await columnNamed('30 י״ט בתשרי')

    expect(neighbour.querySelector('.week-day-number')).toHaveClass('is-outside')
    expect((await cell(1)).querySelector('.week-day-number')).not.toHaveClass('is-outside')
    expect(neighbour).toBeEnabled()
    expect(spinesIn(neighbour, 'done')).toBe(1)
  })

  it('opens a past day to edit it', async () => {
    renderAt('/tabs/calendar')

    fireEvent.click(await cell(15))

    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar/2026-10-15'))
    expect(await screen.findByText('יום חמישי · ד׳ בחשון · נח · 15.10')).toBeInTheDocument()
    expect((await buttonByLabel('היום הקודם')).closest('ion-header')).not.toBeNull()
    expect((await buttonByLabel('היום הבא')).closest('ion-header')).not.toBeNull()
  })

  it('opens a day of the neighbouring month from a week that crosses into it', async () => {
    renderAt('/tabs/calendar')

    fireEvent.click(await columnNamed('30 י״ט בתשרי'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/calendar/2026-09-30'))
  })

  it('moves between months but not past this one', async () => {
    renderAt('/tabs/calendar')

    const next = await buttonByLabel('החודש הבא')
    const previous = await buttonByLabel('החודש הקודם')

    expect(next).toHaveAttribute('disabled')
    expect(next.closest('ion-header')).not.toBeNull()
    expect(previous.closest('ion-header')).not.toBeNull()
    fireEvent.click(previous)

    expect(await screen.findByText('ספטמבר 2026')).toBeInTheDocument()
    expect(shownText(await ionElement('.day-heading p'))).toBe('ספטמבר 2026 · אלול תשפ״ו–תשרי תשפ״ז')
    await waitFor(() => expect(visibleAll('.week-card-holidays').map(shownText).join(' · ')).toContain('21 יום כיפור'))
  })
})
