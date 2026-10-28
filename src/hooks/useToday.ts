import { useEffect, useState } from 'react'
import { logicalToday } from '../domain/logicalDay'

export function useToday(): string {
  const [today, setToday] = useState(() => logicalToday(Date.now()))

  useEffect(() => {
    const refresh = () => setToday(logicalToday(Date.now()))
    const timer = setInterval(refresh, 60_000)

    document.addEventListener('visibilitychange', refresh)

    return () => {
      clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return today
}
