import { SETTINGS_COPY } from './copy'

export type FeedbackKind = 'bug' | 'idea'

const ISSUES_URL = 'https://github.com/Shalom-Borohov/prayer-log/issues/new'

const MAX_TITLE = 80

const ISSUE_LABELS: Record<FeedbackKind, string> = { bug: 'bug', idea: 'feature' }

function title(text: string): string {
  const [first] = text.trim().split('\n')
  const chars = Array.from(first)

  return chars.length > MAX_TITLE ? `${chars.slice(0, MAX_TITLE - 1).join('')}…` : first
}

export function feedbackUrl(kind: FeedbackKind, text: string): string {
  const params = new URLSearchParams({
    title: title(text),
    body: SETTINGS_COPY.issueBody(text.trim(), navigator.userAgent, __APP_VERSION__, __APP_BUILT_AT__),
    labels: ISSUE_LABELS[kind],
  })

  return `${ISSUES_URL}?${params}`
}
