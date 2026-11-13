import { Shelf } from '../../components/Shelf'
import { COMMON_COPY } from '../../copy/common'
import { type ShelfKey, type SlotState, shelfLabel } from '../../domain/shelf'
import { TODAY_COPY } from './copy'

interface WeekShelfProps {
  shelfKey: ShelfKey
  slots: SlotState[]
  endsToday: boolean
}

export function WeekShelf({ shelfKey, slots, endsToday }: WeekShelfProps) {
  const label = TODAY_COPY.weekShelf(COMMON_COPY.tracks[shelfKey], shelfLabel(slots, shelfKey))

  return (
    <Shelf slots={slots} label={label} todayIndex={endsToday ? slots.length - 1 : undefined} stampsToday={endsToday} />
  )
}
