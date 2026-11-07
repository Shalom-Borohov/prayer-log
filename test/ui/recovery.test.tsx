import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/App'
import { db } from '../../src/data/db'
import { stubShare } from '../helpers/backupFile'
import { resetDb } from '../helpers/db'
import { day } from '../helpers/days'

const RECOVERY_HEADING = 'משהו השתבש'

const EXPORT_BUTTON = 'ייצוא גיבוי'

const missingPrayers = JSON.parse('{"date":"2026-11-02","torah":false}')

const goodDay = day('2026-11-01', { prayers: { shacharit: 'minyan' } })

async function sharedFileText(share: ReturnType<typeof stubShare>) {
  const [data] = share.mock.calls[0]
  const [file] = data.files ?? []

  return file.text()
}

async function openOnStoredRecords() {
  await db.days.bulkPut([goodDay, missingPrayers])
  window.location.hash = '#/tabs/today'
  render(<App />)

  return screen.findByRole('heading', { name: RECOVERY_HEADING })
}

describe('a malformed stored record', () => {
  beforeEach(async () => {
    await resetDb()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.location.hash = ''
  })

  it('shows the recovery screen instead of a blank page', async () => {
    expect(await openOnStoredRecords()).toBeVisible()
  })

  it('exports every stored record from the recovery screen, the bad one included', async () => {
    const share = stubShare(() => Promise.resolve())

    await openOnStoredRecords()
    fireEvent.click(screen.getByRole('button', { name: EXPORT_BUTTON }))
    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    const exported = JSON.parse(await sharedFileText(share))

    expect(exported.days.map((stored: { date: string }) => stored.date)).toEqual(['2026-11-01', '2026-11-02'])
  })

  it('says at export time that the file holds a record that cannot be restored', async () => {
    stubShare(() => Promise.resolve())

    await openOnStoredRecords()
    fireEvent.click(screen.getByRole('button', { name: EXPORT_BUTTON }))

    expect(await screen.findByText('בגיבוי יש רשומה פגומה אחת, וייבוא הקובץ ייכשל')).toBeVisible()
  })

  it('reports a failed export on the recovery screen', async () => {
    stubShare(() => Promise.reject(new Error('share failed')))

    await openOnStoredRecords()
    fireEvent.click(screen.getByRole('button', { name: EXPORT_BUTTON }))

    expect(await screen.findByText('הפעולה נכשלה')).toBeVisible()
  })

  it('never changes what is stored', async () => {
    await openOnStoredRecords()

    expect(await db.days.toArray()).toEqual([goodDay, missingPrayers])
  })

  it('offers a reload', async () => {
    await openOnStoredRecords()

    expect(screen.getByRole('button', { name: 'טעינה מחדש' })).toBeVisible()
  })
})

describe('the app with sound records', () => {
  beforeEach(resetDb)

  it('does not show the recovery screen', async () => {
    await db.days.put(goodDay)
    window.location.hash = '#/tabs/today'
    render(<App />)

    expect(await screen.findByRole('group', { name: 'שחרית' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: RECOVERY_HEADING })).not.toBeInTheDocument()
  })
})
