import { COMMON_COPY } from '../../copy/common'
import type { PrayerTally } from '../../domain/types'
import { STATS_COPY } from './copy'

export function HeadlineNumber({ prayers }: { prayers: PrayerTally }) {
  return (
    <h2 className="stats-headline">
      <span className="stats-headline-number">{prayers.minyan}</span>{' '}
      <span className="stats-headline-caption">
        <b>{COMMON_COPY.attendance.minyan}</b> <span>{STATS_COPY.ofPrayers(prayers.total)}</span>
      </span>
    </h2>
  )
}
