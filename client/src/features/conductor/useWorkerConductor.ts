import { useEffect, useRef, useState } from 'react'
import * as Comlink from 'comlink'
import type { WorkerApi } from '@/workers/steps.worker.ts'

export type AlgoId = 'bubble' | 'insertion' | 'selection' | 'quick'

export function useWorkerConductor(values: number[], tick: number, algos: AlgoId[]) {
  const [frames, setFrames] = useState<Record<AlgoId, any>>({} as any)
  const workerRef = useRef<Worker | null>(null)
  const apiRef = useRef<Comlink.Remote<WorkerApi> | null>(null)

  useEffect(() => {
    const worker = new Worker(new URL('../../workers/steps.worker.ts', import.meta.url), { type: 'module' })
    const api = Comlink.wrap<WorkerApi>(worker)
    workerRef.current = worker
    apiRef.current = api
    api.init(values, algos)
    return () => {
      worker.terminate()
      workerRef.current = null
      apiRef.current = null
    }
  }, [values, algos.join(',')])

  useEffect(() => {
    if (!apiRef.current) return
    ;(async () => {
      const res = await apiRef.current!.step()
      setFrames(res as any)
    })()
  }, [tick])

  return frames
}


