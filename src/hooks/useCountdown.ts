import { useEffect, useState } from 'react'

export interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
  isPast: boolean
}

function diff(target: Date): Countdown {
  const total = target.getTime() - Date.now()
  if (total <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true }
  }
  const seconds = Math.floor(total / 1000)
  return {
    days: Math.floor(seconds / 86400),
    hours: Math.floor((seconds % 86400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    isPast: false,
  }
}

// Cuenta regresiva en tiempo real hasta la fecha objetivo.
export function useCountdown(target: Date): Countdown {
  const [value, setValue] = useState<Countdown>(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setValue(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return value
}
