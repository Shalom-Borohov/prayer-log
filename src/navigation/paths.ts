const TABS_PATH = '/tabs'

export type Tab = 'today' | 'calendar' | 'stats'

export const tabPath = (tab: Tab) => `${TABS_PATH}/${tab}`

export const TODAY_PATH = tabPath('today')

export const CALENDAR_PATH = tabPath('calendar')

export const STATS_PATH = tabPath('stats')

export const LEARNING_LOG_PATH = `${STATS_PATH}/learning`

export const dayParentPath = (tab: Tab) => (tab === 'stats' ? LEARNING_LOG_PATH : tabPath(tab))

export const settingsPath = (tab: Tab) => `${tabPath(tab)}/settings`

export function dayPath(tab: Tab, date: string, today: string): string {
  return tab === 'today' && date === today ? TODAY_PATH : `${tabPath(tab)}/${date}`
}
