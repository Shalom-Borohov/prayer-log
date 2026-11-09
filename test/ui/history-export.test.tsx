import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { stubShare } from '../helpers/backupFile'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
import { expectInOrder } from '../helpers/ionic'
import { overlaysSettled, toasts } from '../helpers/overlays'
import { renderAt } from '../helpers/renderAt'

const NOT_A_BACKUP = 'קובץ טקסט עם כל הימים שסומנו, לקריאה או לשמירה בפתקים. זה לא גיבוי, ואי אפשר לשחזר ממנו.'

const browserShare = { share: navigator.share, canShare: navigator.canShare }

const browserObjectUrls = { createObjectURL: URL.createObjectURL, revokeObjectURL: URL.revokeObjectURL }

const shabbat = day('2026-10-24', { prayers: { shacharit: 'minyan', musaf: 'minyan' }, torah: true, torahNote: 'פרשת השבוע' })

const tuesday = day('2026-10-27', { prayers: { shacharit: 'minyan' }, places: { shacharit: 'היכל שלמה' }, tallit: true })

const HISTORY_TEXT = [
  'יום שלישי · ט״ז בחשון · 27.10.2026',
  'שחרית במניין (היכל שלמה), טלית',
  '',
  'שבת · י״ג בחשון · 24.10.2026',
  'שחרית במניין, מוסף במניין, למדתי תורה',
  'הערה: פרשת השבוע',
].join('\n')

async function openHistoryExport() {
  renderAt('/tabs/stats/settings')

  return screen.findByText('ייצוא היסטוריה')
}

function sharedFiles(share: ReturnType<typeof stubShare>) {
  const [{ files }] = share.mock.calls[0]

  if (!files) {
    throw new Error('no files shared')
  }

  return Promise.all(files.map(async (file) => ({ name: file.name, type: file.type, text: await file.text() })))
}

describe('exporting the history as text', () => {
  beforeEach(resetDb)
  freezeDate(new Date(2026, 9, 28, 9, 30).getTime())

  afterEach(() => {
    Object.assign(navigator, browserShare)
    Object.assign(URL, browserObjectUrls)
    vi.restoreAllMocks()
  })

  it('sits between the backup rows and the report row, and says it is not a backup', async () => {
    renderAt('/tabs/stats/settings')

    await expectInOrder(['ייבוא גיבוי', 'היסטוריה', 'ייצוא היסטוריה', NOT_A_BACKUP, 'דיווח על באג / הצעה'])
    expect(screen.getByText(NOT_A_BACKUP)).toBeVisible()
  })

  it('shares every marked day as one text file, newest first', async () => {
    await db.days.bulkPut([shabbat, tuesday])

    const share = stubShare(() => Promise.resolve())

    fireEvent.click(await openHistoryExport())
    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    expect(await sharedFiles(share)).toEqual([{ name: 'prayers-2026-10-28.txt', type: 'text/plain', text: HISTORY_TEXT }])
  })

  it('does not count as a backup', async () => {
    const share = stubShare(() => Promise.resolve())

    fireEvent.click(await openHistoryExport())
    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    expect(await sharedFiles(share)).toEqual([{ name: 'prayers-2026-10-28.txt', type: 'text/plain', text: '' }])
    expect(screen.getByText('עדיין לא נעשה גיבוי')).toBeVisible()
  })

  it('says nothing when the share is cancelled', async () => {
    const share = stubShare(() => Promise.reject(new DOMException('cancelled', 'AbortError')))

    fireEvent.click(await openHistoryExport())
    await waitFor(() => expect(share).toHaveBeenCalledOnce())
    await overlaysSettled()

    expect(toasts()).toEqual([])
  })

  it('says the action failed when the browser refuses the share', async () => {
    stubShare(() => Promise.reject(new DOMException('not allowed', 'NotAllowedError')))

    fireEvent.click(await openHistoryExport())

    await waitFor(() => expect(toasts()).toEqual(['הפעולה נכשלה']))
  })

  it('downloads the file where the browser cannot share one', async () => {
    const download = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined)
    const revokeObjectURL = vi.fn()

    Object.assign(navigator, { canShare: () => false })
    Object.assign(URL, { createObjectURL: () => 'blob:history', revokeObjectURL })

    fireEvent.click(await openHistoryExport())
    await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledWith('blob:history'))

    expect(download).toHaveBeenCalledOnce()
    expect(download.mock.contexts[0]).toHaveProperty('download', 'prayers-2026-10-28.txt')
  })

  it('ignores a second tap while the share sheet is still open', async () => {
    const share = stubShare(() => new Promise(() => undefined))
    const row = await openHistoryExport()

    fireEvent.click(row)
    await waitFor(() => expect(share).toHaveBeenCalledOnce())
    fireEvent.click(row)
    await overlaysSettled()

    expect(share).toHaveBeenCalledOnce()
  })
})
