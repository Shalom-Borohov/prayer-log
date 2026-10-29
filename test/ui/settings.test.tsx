import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../src/data/db'
import { freezeDate } from '../helpers/clock'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'
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

    expect(await screen.findByText(/גרסה [0-9a-f]{7,} · עודכנה \d+\.\d+\.\d{4}/)).toBeVisible()
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
