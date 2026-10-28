import { addDays } from './logicalDay'
import { slotFor } from './shelf'
import type { DayRecord, Streak, StreakKey } from './types'

const qualifies = (record: DayRecord, key: StreakKey) => slotFor(record, key) === 'gold'

function streakOf(dates: string[], date: string, today: string): Streak {
  let run = 0
  let best = 0
  let previous: string | null = null

  for (const qualifying of dates) {
    run = previous !== null && addDays(previous, 1) === qualifying ? run + 1 : 1
    best = Math.max(best, run)
    previous = qualifying
  }

  const ongoing = previous === date || (date === today && previous === addDays(date, -1))

  return { current: ongoing ? run : 0, best }
}

export function streaks(records: DayRecord[], date: string, today = date): Record<StreakKey, Streak> {
  const sorted = records
    .filter((day) => day.date <= date)
    .sort((first, second) => first.date.localeCompare(second.date))

  const streakFor = (key: StreakKey) =>
    streakOf(
      sorted.filter((day) => qualifies(day, key)).map((day) => day.date),
      date,
      today,
    )

  return {
    shacharit: streakFor('shacharit'),
    mincha: streakFor('mincha'),
    maariv: streakFor('maariv'),
    torah: streakFor('torah'),
  }
}
