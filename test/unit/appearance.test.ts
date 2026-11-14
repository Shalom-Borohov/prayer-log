import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { schemeFor } from '../../src/appearance/appearance'
import { readAppearance, saveAppearance, startAppearance } from '../../src/appearance/appearanceStore'
import { stubPhoneScheme } from '../helpers/colorScheme'

const isDarkApplied = () => document.documentElement.classList.contains('ion-palette-dark')

describe('schemeFor', () => {
  it('follows the phone when set to follow it', () => {
    expect(schemeFor('system', true)).toBe('dark')
    expect(schemeFor('system', false)).toBe('light')
  })

  it('keeps a chosen appearance whatever the phone is set to', () => {
    expect(schemeFor('light', true)).toBe('light')
    expect(schemeFor('dark', false)).toBe('dark')
  })
})

describe('the appearance setting', () => {
  let stopAppearance = () => {}

  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('ion-palette-dark')
  })

  afterEach(() => {
    stopAppearance()
    vi.restoreAllMocks()
  })

  it('follows the phone until something is chosen', () => {
    expect(readAppearance()).toBe('system')
  })

  it('falls back to following the phone when the stored value is not an appearance', () => {
    localStorage.setItem('prayer-log:appearance', 'sepia')

    expect(readAppearance()).toBe('system')
  })

  it('follows the phone when the browser refuses to read site data', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('The operation is insecure.')
    })

    expect(readAppearance()).toBe('system')
  })

  it('goes dark at start on a dark phone', () => {
    stubPhoneScheme(true)

    stopAppearance = startAppearance()

    expect(isDarkApplied()).toBe(true)
  })

  it('applies a choice at once and keeps it', () => {
    stubPhoneScheme(false)

    saveAppearance('dark')

    expect(isDarkApplied()).toBe(true)
    expect(readAppearance()).toBe('dark')
  })

  it('stays light on a dark phone when light was chosen', () => {
    stubPhoneScheme(true)
    saveAppearance('light')

    stopAppearance = startAppearance()

    expect(isDarkApplied()).toBe(false)
  })

  it('changes with the phone while following it', () => {
    const phone = stubPhoneScheme(false)

    stopAppearance = startAppearance()
    phone.turnDark(true)

    expect(isDarkApplied()).toBe(true)
  })

  it('ignores the phone changing once an appearance was chosen', () => {
    const phone = stubPhoneScheme(false)

    saveAppearance('light')
    stopAppearance = startAppearance()
    phone.turnDark(true)

    expect(isDarkApplied()).toBe(false)
  })
})
