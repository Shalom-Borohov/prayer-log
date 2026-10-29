import { COMMON_COPY } from '../../copy/common'
import type { Prayer } from '../../domain/types'
import { TODAY_COPY } from './copy'

export function PlaceButton({ prayer, place, onClick }: { prayer: Prayer; place: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="place-button"
      aria-label={TODAY_COPY.placeLabel(COMMON_COPY.prayers[prayer], place)}
      onClick={onClick}
    >
      {place}
    </button>
  )
}
