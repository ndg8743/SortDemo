import { useEffect, useState } from 'react'
import seedrandom from 'seedrandom'

export function useSeededArray(seed: string, size: number) {
  const [values, setValues] = useState<number[]>([])

  useEffect(() => {
    const rng = seedrandom(seed)
    const arr = Array.from({ length: size }, () => Math.floor(rng() * 1000) + 1)
    setValues(arr)
  }, [seed, size])

  return values
}


