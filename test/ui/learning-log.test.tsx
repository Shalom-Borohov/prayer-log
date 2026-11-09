import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { allMinyan, day } from '../helpers/days'
import { expectInOrder, ionChange, ionElement, ionField, ionInput, visibleAll } from '../helpers/ionic'
import { gemara, mishna } from '../helpers/learning'
import { currentPath, renderAt } from '../helpers/renderAt'

const LOG = [
  day('2026-10-20', { torah: true, learning: [gemara('shabbat', 12), mishna('berakhot', 2)] }),
  day('2026-10-22', { torah: true }),
  day('2026-10-26', { torah: true, torahNote: 'הלכות שבת עם חברותא', learning: [gemara('berakhot', 5)] }),
  day('2026-10-27', { torahNote: 'פרשת השבוע' }),
]

const torahTable = () => screen.findByRole('table', { name: 'תורה' })

const visibleRows = () => visibleAll('.learning-log-row')

describe('the מה למדתי entrance on סטטיסטיקה', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('ends the תורה table on every period and opens the list', async () => {
    await db.days.bulkPut(LOG)
    renderAt('/tabs/stats')

    expect(await within(await torahTable()).findByText('מה למדתי')).toBeInTheDocument()

    ionChange(await ionElement('ion-segment'), 'month')
    expect(within(await torahTable()).getByText('מה למדתי')).toBeInTheDocument()

    ionChange(await ionElement('ion-segment'), 'all')
    fireEvent.click(within(await torahTable()).getByText('מה למדתי'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/learning'))
  })

  it('is absent when no day has entries or a note', async () => {
    await db.days.bulkPut([day('2026-10-26', { prayers: allMinyan, torah: true })])
    renderAt('/tabs/stats')

    expect(within(await torahTable()).queryByText('מה למדתי')).not.toBeInTheDocument()
  })
})

describe('the מה למדתי list', () => {
  beforeEach(async () => {
    await resetDb()
    await db.days.bulkPut(LOG)
  })
  freezeDate(new Date(2026, 9, 28, 10).getTime())

  it('lists each day with entries or a note, newest first, under its date line', async () => {
    renderAt('/tabs/stats/learning')

    await expectInOrder([
      'יום שלישי · ט״ז בחשון תשפ״ז · 27.10.2026',
      'פרשת השבוע',
      'יום שני · ט״ו בחשון תשפ״ז · 26.10.2026',
      'גמרא · ברכות דף ה׳',
      'הלכות שבת עם חברותא',
      'יום שלישי · ט׳ בחשון תשפ״ז · 20.10.2026',
      'גמרא · שבת דף י״ב',
      'משנה · ברכות פרק ב׳',
    ])
    expect(screen.queryByText(/22\.10\.2026/)).not.toBeInTheDocument()
  })

  it('filters the days as you type, and says so when nothing matches', async () => {
    renderAt('/tabs/stats/learning')

    ionInput(await ionField('חיפוש'), 'שבת יב')

    await waitFor(() => expect(screen.queryByText('פרשת השבוע')).not.toBeInTheDocument())
    expect(screen.queryByText('הלכות שבת עם חברותא')).not.toBeInTheDocument()
    expect(screen.getByText('גמרא · שבת דף י״ב')).toBeInTheDocument()
    expect(screen.queryByText('לא נמצא לימוד')).not.toBeInTheDocument()

    ionInput(await ionField('חיפוש'), 'עירובין')

    expect(await screen.findByText('לא נמצא לימוד')).toBeInTheDocument()
    expect(screen.queryByText('גמרא · שבת דף י״ב')).not.toBeInTheDocument()
  })

  it('announces a search with no match to VoiceOver from a status region that was already there', async () => {
    renderAt('/tabs/stats/learning')

    await screen.findByText('גמרא · שבת דף י״ב')

    const status = await ionElement('.learning-log-no-match')

    expect(status).toHaveAttribute('role', 'status')
    expect(status).toBeEmptyDOMElement()

    ionInput(await ionField('חיפוש'), 'עירובין')

    await waitFor(() => expect(status).toHaveTextContent('לא נמצא לימוד'))
  })

  it('gives the search field and its clear button Hebrew spoken names', async () => {
    renderAt('/tabs/stats/learning')

    const field = await ionField('חיפוש')

    await waitFor(() =>
      expect(field.querySelector('.searchbar-clear-button')).toHaveAttribute('aria-label', 'ניקוי החיפוש'),
    )
    expect(screen.queryByLabelText('search text')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('reset')).not.toBeInTheDocument()
  })

  it('opens a tapped day, and back returns to the list with the search kept', async () => {
    renderAt('/tabs/stats/learning')

    ionInput(await ionField('חיפוש'), 'שבת')
    await waitFor(() => expect(visibleRows()).toHaveLength(2))
    fireEvent.click(await screen.findByText('יום שלישי · ט׳ בחשון תשפ״ז · 20.10.2026'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/2026-10-20'))
    fireEvent.click(await ionElement('ion-back-button'))

    await waitFor(() => expect(currentPath()).toBe('/tabs/stats/learning'))
    await waitFor(() => expect(visibleRows()).toHaveLength(2))
    expect(screen.getByLabelText('חיפוש')).toHaveValue('שבת')
  })
})
