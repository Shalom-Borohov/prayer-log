import { cleanup, fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { Appearance } from '../../src/appearance/appearance'
import { stubShare } from '../helpers/backupFile'
import { stubPhoneScheme } from '../helpers/colorScheme'
import { resetDb } from '../helpers/db'
import { ionChange, ionElement } from '../helpers/ionic'
import { renderAt } from '../helpers/renderAt'

const SETTINGS = '/tabs/stats/settings'

async function appearanceOption(label: string) {
  const option = (await screen.findByText(label)).closest('ion-segment-button')

  if (!option) {
    throw new Error(`no appearance option ${label}`)
  }

  return option
}

const expectSelected = (label: string) =>
  waitFor(async () => expect(await appearanceOption(label)).toHaveClass('segment-button-checked'))

const choose = async (appearance: Appearance) => ionChange(await ionElement('ion-segment'), appearance)

const isDark = () => document.documentElement.classList.contains('ion-palette-dark')

describe('the appearance setting', () => {
  beforeEach(async () => {
    await resetDb()
    localStorage.clear()
    document.documentElement.classList.remove('ion-palette-dark')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('follows the phone until something is chosen', async () => {
    stubPhoneScheme(false)
    renderAt(SETTINGS)

    await expectSelected('לפי הטלפון')
    expect(await appearanceOption('כהה')).not.toHaveClass('segment-button-checked')
  })

  it('goes dark when dark is chosen, and keeps the choice', async () => {
    stubPhoneScheme(false)
    renderAt(SETTINGS)

    await choose('dark')

    await waitFor(() => expect(isDark()).toBe(true))
    cleanup()
    renderAt(SETTINGS)
    await expectSelected('כהה')
  })

  it('stays light on a dark phone when light is chosen', async () => {
    stubPhoneScheme(true)
    renderAt(SETTINGS)

    await choose('dark')
    await waitFor(() => expect(isDark()).toBe(true))
    await choose('light')

    await waitFor(() => expect(isDark()).toBe(false))
    await expectSelected('בהיר')
  })

  it('follows a light phone again when set back to follow it', async () => {
    stubPhoneScheme(false)
    renderAt(SETTINGS)
    await choose('dark')
    await waitFor(() => expect(isDark()).toBe(true))

    await choose('system')

    await waitFor(() => expect(isDark()).toBe(false))
  })

  it('leaves the choice out of an exported backup', async () => {
    const share = stubShare(() => Promise.resolve())

    stubPhoneScheme(false)
    renderAt(SETTINGS)
    await choose('dark')
    await waitFor(() => expect(isDark()).toBe(true))

    fireEvent.click(await screen.findByText('ייצוא גיבוי'))

    await waitFor(() => expect(share).toHaveBeenCalledOnce())

    const backupText = await share.mock.calls[0][0].files?.[0].text()

    expect(backupText).toContain('"version":1')
    expect(backupText).not.toContain('appearance')
  })
})
