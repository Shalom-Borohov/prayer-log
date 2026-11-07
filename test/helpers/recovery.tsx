import { render, screen } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { App } from '../../src/App'
import { db } from '../../src/data/db'
import type { DayRecord } from '../../src/domain/types'
import { resetDb } from './db'

export const missingPrayers = JSON.parse('{"date":"2026-11-02","torah":false}')

export function prepareRecoveryScreen() {
  beforeEach(async () => {
    await resetDb()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
    window.location.hash = ''
  })
}

export async function openRecoveryScreen(soundRecords: DayRecord[] = []) {
  await db.days.bulkPut([...soundRecords, missingPrayers])
  window.location.hash = '#/tabs/today'
  render(<App />)

  return screen.findByRole('heading', { name: 'משהו השתבש' })
}
