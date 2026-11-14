import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Shelf } from '../../src/components/Shelf'
import type { SlotState } from '../../src/domain/shelf'
import { spinesOf, todaySlotsOf } from '../helpers/shelves'

const WEEK: SlotState[] = ['done', 'alone', 'shema', 'unmarked', 'blank', 'done', 'unmarked']

describe('Shelf', () => {
  it('draws each slot as a spine of its state, under one spoken name', () => {
    render(<Shelf slots={WEEK} label="3 מתוך 6 הימים האחרונים במניין" />)

    const shelf = screen.getByRole('img', { name: '3 מתוך 6 הימים האחרונים במניין' })

    expect(spinesOf(shelf).map((spine) => spine.className)).toEqual([
      'spine spine-done',
      'spine spine-alone',
      'spine spine-shema',
      'spine spine-unmarked',
      'spine spine-blank',
      'spine spine-done',
      'spine spine-unmarked',
    ])
  })

  it('marks today under its own slot only', () => {
    render(<Shelf slots={WEEK} label="השבוע" todayIndex={6} />)

    const shelf = screen.getByRole('img', { name: 'השבוע' })

    expect(todaySlotsOf(shelf)).toHaveLength(1)
    expect(todaySlotsOf(shelf)[0]).toContainElement(spinesOf(shelf)[6])
  })

  it('marks no slot when the shelf does not hold today', () => {
    render(<Shelf slots={WEEK} label="שבוע שעבר" />)

    expect(todaySlotsOf(screen.getByRole('img', { name: 'שבוע שעבר' }))).toHaveLength(0)
  })

  it("stamps today's spine when it turns במניין", () => {
    const { rerender } = render(<Shelf slots={WEEK} label="השבוע" todayIndex={6} stampsToday />)

    rerender(<Shelf slots={[...WEEK.slice(0, 6), 'done']} label="השבוע" todayIndex={6} stampsToday />)

    expect(spinesOf(screen.getByRole('img', { name: 'השבוע' }))[6]).toHaveClass('spine-stamp')
  })

  it('does not stamp a spine that turns ביחידות', () => {
    const { rerender } = render(<Shelf slots={WEEK} label="השבוע" todayIndex={6} stampsToday />)

    rerender(<Shelf slots={[...WEEK.slice(0, 6), 'alone']} label="השבוע" todayIndex={6} stampsToday />)

    expect(spinesOf(screen.getByRole('img', { name: 'השבוע' }))[6]).not.toHaveClass('spine-stamp')
  })

  it('stands a month on boards of the given size', () => {
    const month: SlotState[] = Array.from({ length: 31 }, () => 'done')

    render(<Shelf slots={month} label="החודש" boardSize={16} />)

    const boards = screen.getByRole('img', { name: 'החודש' }).querySelectorAll('.shelf-board')

    expect([...boards].map((board) => board.querySelectorAll('.spine').length)).toEqual([16, 15])
  })
})
