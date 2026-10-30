import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { ionChange, ionField, ionInput } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

const shabbat = day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'minyan' }, torah: true, torahNote: 'פרשת השבוע' })

async function readJson(file: Blob | undefined) {
  if (!file) {
    throw new Error('no file')
  }

  return JSON.parse(await file.text())
}

const toasts = () => Array.from(document.querySelectorAll('ion-toast'), (toast) => toast.message)

function chooseFile(text: string) {
  fireEvent.change(screen.getByLabelText('קובץ גיבוי'), {
    target: { files: [new File([text], 'backup.json', { type: 'application/json' })] },
  })
}

describe('settings', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 9, 30).getTime())

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exports a backup through the share sheet', async () => {
    await db.days.put(shabbat)

    const share = vi.fn<(data: ShareData) => Promise<void>>().mockResolvedValue()

    Object.assign(navigator, { share, canShare: () => true })
    renderAt('/tabs/stats/settings')

    fireEvent.click(await screen.findByText('ייצוא גיבוי'))

    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    const files = share.mock.calls[0][0].files

    expect(files?.map((file) => file.name)).toEqual(['prayers-backup-2026-10-28.json'])
    expect(await readJson(files?.[0])).toEqual({
      version: 1,
      exportedAt: new Date(2026, 9, 28, 9, 30).getTime(),
      days: [shabbat],
    })
  })

  it('shows the running version and when it was last updated', async () => {
    renderAt('/tabs/stats/settings')

    expect(await screen.findByText(/^גרסה \d+\.\d+\.\d+ · עודכנה \d{1,2}\.\d{1,2}\.\d{4} \d{2}:\d{2}$/)).toBeVisible()
  })

  it('opens a GitHub bug report with the text and device details', async () => {
    const openWindow = vi.spyOn(window, 'open').mockReturnValue(null)

    renderAt('/tabs/stats/settings')
    fireEvent.click(await screen.findByText('דיווח על באג / הצעה'))
    ionInput(await ionField('תיאור'), 'הרצף לא התעדכן\nסימנתי מנחה במניין')
    fireEvent.click(await screen.findByText('פתיחה ב-GitHub'))

    expect(openWindow).toHaveBeenCalledOnce()

    const [url, target, features] = openWindow.mock.calls[0]
    const { origin, pathname, searchParams } = new URL(String(url))

    expect(target).toBe('_blank')
    expect(features).toBe('noopener')
    expect(`${origin}${pathname}`).toBe('https://github.com/Shalom-Borohov/prayer-log/issues/new')
    expect(searchParams.get('title')).toBe('הרצף לא התעדכן')
    expect(searchParams.get('labels')).toBe('bug')
    expect(searchParams.get('body')).toBe(
      `הרצף לא התעדכן\nסימנתי מנחה במניין\n\n### מכשיר\n${navigator.userAgent}\nגרסה: ${__APP_VERSION__} (${__APP_BUILT_AT__})`,
    )
  })

  it('opens a suggestion with a shortened title, only once there is text', async () => {
    const openWindow = vi.spyOn(window, 'open').mockReturnValue(null)
    const idea = 'כדאי להוסיף תזכורת לפני השקיעה כשמנחה עוד לא סומנה, עם אפשרות לבחור כמה דקות לפני ובאילו ימים'

    renderAt('/tabs/stats/settings')
    fireEvent.click(await screen.findByText('דיווח על באג / הצעה'))
    ionChange(await screen.findByText('הצעה', { selector: 'ion-segment-button ion-label' }), 'idea')

    expect((await screen.findByText('פתיחה ב-GitHub')).closest('ion-button')).toHaveProperty('disabled', true)

    ionInput(await ionField('תיאור'), idea)
    fireEvent.click(screen.getByText('פתיחה ב-GitHub'))

    const { searchParams } = new URL(String(openWindow.mock.calls[0][0]))

    expect(searchParams.get('labels')).toBe('feature')
    expect(searchParams.get('title')).toBe(`${idea.slice(0, 79)}…`)
  })

  it('rejects an invalid backup file and keeps the data', async () => {
    await db.days.put(shabbat)
    renderAt('/tabs/stats/settings')
    await screen.findByText('ייבוא גיבוי')

    chooseFile('{"version":1}')

    await waitFor(() => expect(toasts()).toContain('קובץ הגיבוי לא תקין'))
    expect(await db.days.toArray()).toEqual([shabbat])
  })
})
