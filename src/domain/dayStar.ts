import type { PrayerTally } from './types'

export type DayStar = 'full' | 'part' | 'faint' | 'unmarked' | 'pending' | 'blank'

export function dayStar(tally: PrayerTally | null, isToday: boolean): DayStar {
  if (tally === null) {
    return 'blank'
  }

  const { minyan, alone, shema, total } = tally

  if (minyan + alone + shema === 0) {
    return isToday ? 'pending' : 'unmarked'
  }

  if (minyan === total) {
    return 'full'
  }

  return minyan > 0 ? 'part' : 'faint'
}

export function bucketShare({ minyan, total }: PrayerTally): number | null {
  return total === 0 ? null : minyan / total
}
