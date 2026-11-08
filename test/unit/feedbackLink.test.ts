import { describe, expect, it } from 'vitest'
import { feedbackLink } from '../../src/pages/settings/feedbackUrl'
import type { PhoneState } from '../../src/pages/settings/phoneState'

const LINK_LIMIT = 4300
const HEBREW_LETTER_IN_LINK = 6
const CUT_MARKER = '… (הדיווח נחתך כאן)'
const PHONE: PhoneState = { persisted: true, usedBytes: 2_500_000, installed: true }

const deviceDetails = () =>
  `\n\n### מכשיר\n${navigator.userAgent}\nגרסה: ${__APP_VERSION__} (${__APP_BUILT_AT__})` +
  '\nאחסון קבוע: כן\nנפח בשימוש: 2.5 MB\nאפליקציה מותקנת: כן'

const params = (url: string) => new URL(url).searchParams

function bodyOf(url: string) {
  const body = params(url).get('body')

  if (body === null) {
    throw new Error('no body in the link')
  }

  return body
}

function longestReportThatFits() {
  let report = 'א'

  while (!feedbackLink('bug', `${report}א`, PHONE).isCut) {
    report += 'א'
  }

  return report
}

describe('feedbackLink', () => {
  it('sends a short report whole', () => {
    const { url, isCut } = feedbackLink('bug', '  הרצף לא התעדכן\nסימנתי מנחה  ', PHONE)

    expect(isCut).toBe(false)
    expect(bodyOf(url)).toBe(`הרצף לא התעדכן\nסימנתי מנחה${deviceDetails()}`)
    expect(params(url).get('title')).toBe('הרצף לא התעדכן')
    expect(params(url).get('labels')).toBe('bug')
  })

  it('cuts a long report to fit the limit, marks the cut and keeps the device details', () => {
    const report = 'שלום עולם\n' + 'כתבתי דיווח ארוך מאוד '.repeat(150)
    const { url, isCut } = feedbackLink('idea', report, PHONE)
    const body = bodyOf(url)
    const [kept, afterMarker] = body.split(CUT_MARKER)

    expect(isCut).toBe(true)
    expect(url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(report.startsWith(kept)).toBe(true)
    expect(kept.length).toBeGreaterThan(500)
    expect(afterMarker).toBe(deviceDetails())
    expect(params(url).get('title')).toBe('שלום עולם')
    expect(params(url).get('labels')).toBe('feature')
  })

  it('keeps the 80-character title rule when the whole report is one long line', () => {
    const { url, isCut } = feedbackLink('bug', 'א'.repeat(2000), PHONE)

    expect(isCut).toBe(true)
    expect(params(url).get('title')).toBe(`${'א'.repeat(79)}…`)
  })

  it('cuts only once a report no longer fits, and then uses all the room', () => {
    const report = longestReportThatFits()
    const whole = feedbackLink('bug', report, PHONE)
    const cut = feedbackLink('bug', `${report}א`, PHONE)

    expect(whole.url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(bodyOf(whole.url)).toBe(`${report}${deviceDetails()}`)
    expect(cut.isCut).toBe(true)
    expect(cut.url.length).toBeLessThanOrEqual(LINK_LIMIT)
    expect(cut.url.length).toBeGreaterThan(LINK_LIMIT - HEBREW_LETTER_IN_LINK)
  })

  it.each([
    { name: 'an emoji', character: '😀' },
    { name: 'a flag', character: '🇮🇱' },
    { name: 'a family emoji', character: '👨‍👩‍👧' },
    { name: 'a letter with its vowel points', character: 'בְּ' },
  ])('does not break $name at the cut', ({ character }) => {
    const { url, isCut } = feedbackLink('bug', character.repeat(1000), PHONE)
    const [kept] = bodyOf(url).split(CUT_MARKER)

    expect(isCut).toBe(true)
    expect(kept.replaceAll(character, '')).toBe('')
  })

  it('uses all the room when a pasted report is far over the limit', () => {
    const { url, isCut } = feedbackLink('bug', 'a'.repeat(50_000), PHONE)

    expect(isCut).toBe(true)
    expect(url.length).toBe(LINK_LIMIT)
  })
})
