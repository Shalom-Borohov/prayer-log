import { screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { shownText } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

describe('the compact header', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it.each([
    ['/tabs/today', 'היום', 'יום רביעי · י״ז בחשון · וירא · 28.10'],
    ['/tabs/today/2026-10-27', 'יום שלישי', 'יום שלישי · ט״ז בחשון · וירא · 27.10'],
    ['/tabs/calendar', 'לוח', 'אוקטובר 2026'],
    ['/tabs/stats', 'סטטיסטיקה', null],
  ])('on %s shows the title once, in the bar, with no large title', async (path, title, subtitle) => {
    renderAt(path)

    await waitFor(() => {
      const barTitles = [...document.querySelectorAll('ion-header ion-title')].map(shownText)

      expect(barTitles).toContain(title)
    })

    expect(document.querySelector('ion-title.title-large')).toBeNull()
    expect(document.querySelector('ion-header.header-collapse-condense')).toBeNull()

    if (subtitle) {
      expect(await screen.findByText(subtitle)).toBeInTheDocument()
    }
  })
})
