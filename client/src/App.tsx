import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import './App.css'
import { useEffect, useMemo, useState } from 'react'
import { useSeededArray } from '@/features/conductor/useArraySeed'
import { useConductor } from '@/features/conductor/useConductor'
import { InteractiveBars } from '@/features/visualization/InteractiveBars'
import { AlgorithmCard } from '@/features/visualization/AlgorithmCard'
import { createBubbleSortSteps } from '@/features/algorithms/bubble'
import { createInsertionSortSteps } from '@/features/algorithms/insertion'
import { createSelectionSortSteps } from '@/features/algorithms/selection'
import { createQuickSortSteps } from '@/features/algorithms/quick'
import { useWorkerConductor } from '@/features/conductor/useWorkerConductor'
import { toast } from 'sonner'

function App() {
  const [seed, setSeed] = useState<string>('sortdemo')
  const [size, setSize] = useState<number>(64)
  const [speed, setSpeed] = useState<number>(2)
  const [playing] = useState<boolean>(true)
  const [userArray, setUserArray] = useState<number[]>([])

  const base = useSeededArray(seed, size)
  
  // Initialize user array when base changes
  useEffect(() => {
    setUserArray(base.slice())
  }, [base])
  const tick = useConductor(speed, playing)

  const width = typeof window !== 'undefined' ? Math.min(window.innerWidth - 64, 1760) : 1200
  const topHeight = Math.round((typeof window !== 'undefined' ? window.innerHeight : 800) * 0.32)
  const cellHeight = topHeight

  const bubbleFactory = (v: number[]) => createBubbleSortSteps(v)
  const insertionFactory = (v: number[]) => createInsertionSortSteps(v)
  const selectionFactory = (v: number[]) => createSelectionSortSteps(v)
  const quickFactory = (v: number[]) => createQuickSortSteps(v)

  const frames = useWorkerConductor(userArray, tick, ['bubble','insertion','selection','quick'])

  const allDone = useMemo(() => {
    const ids = ['bubble','insertion','selection','quick'] as const
    return ids.every((id) => frames[id]?.done)
  }, [frames])

  useEffect(() => {
    if (!allDone) return
    let remaining = 10
    let toastId: string | number | undefined
    const tickToast = () => {
      const msg = `${remaining} second${remaining === 1 ? '' : 's'} until next sort`
      if (toastId !== undefined) {
        toast.dismiss(toastId as any)
      }
      toastId = toast(msg, { description: 'Preparing new dataset...' })
    }
    tickToast()
    const interval = setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        clearInterval(interval)
        setSeed(String(Date.now()))
      } else {
        tickToast()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [allDone])

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <div className="mx-auto grid max-w-[1800px] grid-rows-[1fr_2fr] gap-4 p-4 sm:p-6 lg:p-8" style={{height: '100vh'}}>
        <Card className="row-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-title">User Sort - Drag bars to sort manually</CardTitle>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="seed" className="text-sm">Seed</Label>
                <Input id="seed" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Size</Label>
                <div className="w-40"><Slider value={[size]} min={16} max={256} step={1} onValueChange={(v) => setSize(v[0] ?? size)} /></div>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Speed</Label>
                <div className="w-40"><Slider value={[speed]} min={1} max={5} step={1} onValueChange={(v) => setSpeed(v[0] ?? speed)} /></div>
              </div>
              <Button variant="default" onClick={() => setSeed(String(Date.now()))}>Reset Array</Button>
            </div>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <div className="w-full h-[28vh] md:h-[30vh] lg:h-[32vh]">
              <InteractiveBars 
                values={userArray} 
                width={width} 
                height={topHeight} 
                onValuesChange={setUserArray}
              />
            </div>
          </CardContent>
        </Card>

        <div className="row-span-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AlgorithmCard title="Bubble Sort" initialValues={userArray} factory={bubbleFactory} width={Math.floor(width/2 - 24)} height={cellHeight} tick={tick} />
          <AlgorithmCard title="Insertion Sort" initialValues={userArray} factory={insertionFactory} width={Math.floor(width/2 - 24)} height={cellHeight} tick={tick} />
          <AlgorithmCard title="Selection Sort" initialValues={userArray} factory={selectionFactory} width={Math.floor(width/2 - 24)} height={cellHeight} tick={tick} />
          <AlgorithmCard title="Quick Sort" initialValues={userArray} factory={quickFactory} width={Math.floor(width/2 - 24)} height={cellHeight} tick={tick} />
        </div>
      </div>
    </div>
  )
}

export default App
