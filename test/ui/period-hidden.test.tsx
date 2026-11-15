import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { buttonByLabel, visibleAll } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

const pagesWithPaging = [
  { name: 'היום', path: '/tabs/today', previousLabel: 'היום הקודם', nextLabel: 'היום הבא', nextDisabled: true },
  {
    name: 'a day opened from לוח',
    path: '/tabs/calendar/2026-10-15',
    previousLabel: 'היום הקודם',
    nextLabel: 'היום הבא',
    nextDisabled: false,
  },
  {
    name: 'לוח',
    path: '/tabs/calendar',
    previousLabel: 'החודש הקודם',
    nextLabel: 'החודש הבא',
    nextDisabled: true,
  },
]

describe('the hidden previous and next buttons', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it.each(pagesWithPaging)('leaves no footer bar on $name', async ({ path, previousLabel }) => {
    renderAt(path)

    await buttonByLabel(previousLabel)

    expect(visibleAll('ion-footer')).toHaveLength(0)
  })

  it.each(pagesWithPaging)(
    'keeps previous and next focusable inside the hidden row on $name',
    async ({ path, previousLabel, nextLabel, nextDisabled }) => {
      renderAt(path)

      const previous = await buttonByLabel(previousLabel)
      const next = await buttonByLabel(nextLabel)

      expect(previous.closest('.period-nav')).not.toBeNull()
      expect(next.closest('.period-nav')).not.toBeNull()
      expect(previous.closest('[aria-hidden="true"]')).toBeNull()
      expect(next.closest('[aria-hidden="true"]')).toBeNull()
      expect(next.hasAttribute('disabled')).toBe(nextDisabled)
    },
  )
})
