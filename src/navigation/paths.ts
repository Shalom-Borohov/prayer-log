const TABS_PATH = '/tabs'

export const TODAY_PATH = `${TABS_PATH}/today`

export const CALENDAR_PATH = `${TABS_PATH}/calendar`

export const STATS_PATH = `${TABS_PATH}/stats`

export const SETTINGS_PATH = `${STATS_PATH}/settings`

export type DayTab = 'today' | 'calendar'

export const dayTabPath = (tab: DayTab) => `${TABS_PATH}/${tab}`

export function dayPath(tab: DayTab, date: string, today: string): string {
  return tab === 'today' && date === today ? TODAY_PATH : `${dayTabPath(tab)}/${date}`
}
