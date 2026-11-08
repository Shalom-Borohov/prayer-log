import { SETTINGS_COPY } from './copy'
import { type PhoneState, phoneStateLines } from './phoneState'

export type FeedbackKind = 'bug' | 'idea'

interface FeedbackLink {
  url: string
  isCut: boolean
}

const ISSUES_URL = 'https://github.com/Shalom-Borohov/prayer-log/issues/new'

const MAX_TITLE = 80

const MAX_LINK_LENGTH = 4300

const ISSUE_LABELS: Record<FeedbackKind, string> = { bug: 'bug', idea: 'feature' }

function title(text: string): string {
  const [first] = text.split('\n')
  const chars = Array.from(first)

  return chars.length > MAX_TITLE ? `${chars.slice(0, MAX_TITLE - 1).join('')}…` : first
}

function deviceLines(phone: PhoneState): string[] {
  return [navigator.userAgent, SETTINGS_COPY.versionLine(__APP_VERSION__, __APP_BUILT_AT__), ...phoneStateLines(phone)]
}

function issueUrl(kind: FeedbackKind, issueTitle: string, text: string, device: string[]): string {
  const params = new URLSearchParams({
    title: issueTitle,
    body: SETTINGS_COPY.issueBody(text, device),
    labels: ISSUE_LABELS[kind],
  })

  return `${ISSUES_URL}?${params}`
}

export function feedbackLink(kind: FeedbackKind, text: string, phone: PhoneState): FeedbackLink {
  const report = text.trim()
  const issueTitle = title(report)
  const device = deviceLines(phone)
  const whole = issueUrl(kind, issueTitle, report, device)

  if (whole.length <= MAX_LINK_LENGTH) {
    return { url: whole, isCut: false }
  }

  const mostThatCouldFit = report.slice(0, MAX_LINK_LENGTH)
  const characters = Array.from(new Intl.Segmenter().segment(mostThatCouldFit), ({ segment }) => segment)

  const cutAfter = (count: number) =>
    issueUrl(kind, issueTitle, `${characters.slice(0, count).join('')}${SETTINGS_COPY.issueCutMarker}`, device)

  let fits = 0
  let tooLong = characters.length

  while (tooLong - fits > 1) {
    const middle = Math.floor((fits + tooLong) / 2)

    if (cutAfter(middle).length <= MAX_LINK_LENGTH) {
      fits = middle
    } else {
      tooLong = middle
    }
  }

  return { url: cutAfter(fits), isCut: true }
}
