import { useEffect, useRef, useState } from 'react'

export function useConductor(speed: number, playing: boolean) {
  const [tick, setTick] = useState(0)
  const rafRef = useRef<number | null>(null)
  const lastRef = useRef<number>(0)

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      return
    }
    const fps = speed * 10 // 10, 20, 30, 40, 50
    const interval = 1000 / fps
    function loop(now: number) {
      if (!lastRef.current) lastRef.current = now
      const delta = now - lastRef.current
      if (delta >= interval) {
        lastRef.current = now
        setTick((t) => t + 1)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [speed, playing])

  return tick
}



