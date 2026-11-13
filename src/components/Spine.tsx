import { useState } from 'react'
import type { SlotState } from '../domain/shelf'
import './spine.css'

interface SpineProps {
  state: SlotState
  stamps?: boolean
}

export function Spine({ state, stamps = false }: SpineProps) {
  const [previousState, setPreviousState] = useState(state)
  const [stamping, setStamping] = useState(false)

  if (state !== previousState) {
    setPreviousState(state)
    setStamping(stamps && state === 'done')
  }

  return <i className={`spine spine-${state}${stamping ? ' spine-stamp' : ''}`} onAnimationEnd={() => setStamping(false)} />
}
