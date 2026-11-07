import { compareVersions } from './releases'

const SEEN_VERSION_KEY = 'prayer-log:seen-version'
const SHARED_ORIGIN_KEY = 'seen-version'

function readVersionThisAppCouldHaveSaved() {
  const version = localStorage.getItem(SHARED_ORIGIN_KEY)

  if (version !== null && compareVersions(version, __APP_VERSION__) > 0) {
    return null
  }

  return version
}

export const readSeenVersion = () => localStorage.getItem(SEEN_VERSION_KEY) ?? readVersionThisAppCouldHaveSaved()

export function saveSeenVersion(version: string) {
  localStorage.setItem(SEEN_VERSION_KEY, version)
}
