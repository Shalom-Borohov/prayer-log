import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { ionElement } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

const iconsExposedToScreenReaders = () =>
  Array.from(document.querySelectorAll('ion-icon'))
    .filter((icon) => !icon.hasAttribute('aria-hidden') && !icon.hasAttribute('aria-label'))
    .map((icon) => icon.outerHTML)

describe('icons', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it.each([
    ['/tabs/today', '.round-check ion-icon'],
    ['/tabs/calendar', '.period-buttons ion-icon'],
    ['/tabs/stats', 'ion-header ion-icon'],
    ['/tabs/stats/settings', 'ion-item ion-icon'],
    ['/tabs/stats/learning', 'ion-searchbar ion-icon'],
  ])('hides decorative icons from screen readers on %s', async (path, pageOwnIcon) => {
    await db.days.put(day('2026-10-28', { tefillin: true, torah: true }))
    renderAt(path)

    await ionElement(pageOwnIcon)
    expect(iconsExposedToScreenReaders()).toEqual([])
  })
})
