const TABS_PATH = '/tabs'

export type DayTab = 'today' | 'calendar'

export type Tab = DayTab | 'stats'

export const tabPath = (tab: Tab) => `${TABS_PATH}/${tab}`

export const TODAY_PATH = tabPath('today')

export const CALENDAR_PATH = tabPath('calendar')

export const STATS_PATH = tabPath('stats')

export const settingsPath = (tab: Tab) => `${tabPath(tab)}/settings`

export function dayPath(tab: DayTab, date: string, today: string): string {
  return tab === 'today' && date === today ? TODAY_PATH : `${tabPath(tab)}/${date}`
}
