export type DayTab = 'today' | 'calendar'

export function dayPath(tab: DayTab, date: string, today: string): string {
  return tab === 'today' && date === today ? '/tabs/today' : `/tabs/${tab}/${date}`
}
