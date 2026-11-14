import { useState } from 'react'
import type { SlotState } from '../domain/shelf'
import './Shelf.css'

interface ShelfProps {
  slots: SlotState[]
  label: string
  stamp?: boolean
}

export function Shelf({ slots, label, stamp = false }: ShelfProps) {
  const last = slots[slots.length - 1]
  const [previousLast, setPreviousLast] = useState(last)
  const [stamping, setStamping] = useState(false)

  if (last !== previousLast) {
    setPreviousLast(last)
    setStamping(stamp && last === 'gold')
  }

  return (
    <div className="shelf" role="img" aria-label={label}>
      {slots.map((slot, index) => (
        <i
          key={index}
          className={`spine spine-${slot}${stamping && index === slots.length - 1 ? ' spine-stamp' : ''}`}
          onAnimationEnd={() => setStamping(false)}
        />
      ))}
    </div>
  )
}
