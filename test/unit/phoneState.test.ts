import { afterEach, describe, expect, it, vi } from 'vitest'
import { phoneStateLines, readPhoneState } from '../../src/pages/settings/phoneState'
import { stubInstalledApp, stubStorage } from '../helpers/phoneState'

const readLines = async () => phoneStateLines(await readPhoneState())

describe('phoneStateLines', () => {
  it('writes one line each for persisted storage, the space used and the installed app', () => {
    expect(phoneStateLines({ persisted: true, usedBytes: 1_234_567, installed: false })).toEqual([
      'אחסון קבוע: כן',
      'נפח בשימוש: 1.2 MB',
      'אפליקציה מותקנת: לא',
    ])
  })

  it('says what is not known', () => {
    expect(phoneStateLines({ persisted: null, usedBytes: null, installed: true })).toEqual([
      'אחסון קבוע: לא ידוע',
      'נפח בשימוש: לא ידוע',
      'אפליקציה מותקנת: כן',
    ])
  })
})

describe('readPhoneState', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('reads whether storage is persisted and how much of it is used', async () => {
    stubStorage({ persisted: async () => true, estimate: async () => ({ usage: 1_234_567 }) })

    expect(await readLines()).toEqual(['אחסון קבוע: כן', 'נפח בשימוש: 1.2 MB', 'אפליקציה מותקנת: לא'])
  })

  it('reads storage that is not persisted', async () => {
    stubStorage({ persisted: async () => false, estimate: async () => ({ usage: 0 }) })

    expect(await readLines()).toEqual(['אחסון קבוע: לא', 'נפח בשימוש: 0.0 MB', 'אפליקציה מותקנת: לא'])
  })

  it('does not know the storage details when the browser has no storage manager', async () => {
    expect(await readLines()).toEqual(['אחסון קבוע: לא ידוע', 'נפח בשימוש: לא ידוע', 'אפליקציה מותקנת: לא'])
  })

  it('does not know the space used on an iOS without a storage estimate', async () => {
    stubStorage({ persisted: async () => true })

    expect(await readLines()).toEqual(['אחסון קבוע: כן', 'נפח בשימוש: לא ידוע', 'אפליקציה מותקנת: לא'])
  })

  it('does not know the space used when the estimate leaves it out', async () => {
    stubStorage({ persisted: async () => true, estimate: async () => ({}) })

    expect(await readLines()).toEqual(['אחסון קבוע: כן', 'נפח בשימוש: לא ידוע', 'אפליקציה מותקנת: לא'])
  })

  it('does not know the storage details when the browser refuses them', async () => {
    stubStorage({
      persisted: () => Promise.reject(new Error('refused')),
      estimate: () => Promise.reject(new Error('refused')),
    })

    expect(await readLines()).toEqual(['אחסון קבוע: לא ידוע', 'נפח בשימוש: לא ידוע', 'אפליקציה מותקנת: לא'])
  })

  it('knows when it runs as the app installed on the Home Screen', async () => {
    stubInstalledApp()

    expect(await readLines()).toEqual(['אחסון קבוע: לא ידוע', 'נפח בשימוש: לא ידוע', 'אפליקציה מותקנת: כן'])
  })
})
