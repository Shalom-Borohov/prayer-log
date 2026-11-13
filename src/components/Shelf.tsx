import type { SlotState } from '../domain/shelf'
import { Spine } from './Spine'
import './Shelf.css'

interface ShelfProps {
  slots: SlotState[]
  label: string
  todayIndex?: number
  stampsToday?: boolean
  boardSize?: number
}

export function Shelf({ slots, label, todayIndex, stampsToday = false, boardSize = slots.length }: ShelfProps) {
  const boardStarts = slots.flatMap((_, index) => (index % boardSize === 0 ? [index] : []))

  return (
    <div className="shelf" role="img" aria-label={label}>
      {boardStarts.map((start) => (
        <div key={start} className="shelf-board">
          {slots.slice(start, start + boardSize).map((slot, offset) => {
            const index = start + offset

            return (
              <span key={index} className={index === todayIndex ? 'shelf-slot is-today' : 'shelf-slot'}>
                <Spine state={slot} stamps={stampsToday && index === todayIndex} />
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}
