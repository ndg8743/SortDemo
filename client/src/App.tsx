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
import { toast } from 'sonner'
import { Confetti } from '@/features/visualization/Confetti'
import { useNoSleep } from '@/lib/useNoSleep'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Settings } from 'lucide-react';

type ControlsProps = {
  seed: string;
  setSeed: (seed: string) => void;
  size: number;
  setSize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
};

const Controls = ({ seed, setSeed, size, setSize, speed, setSpeed }: ControlsProps) => (
  <>
    <div className="flex items-center gap-2">
      <Label htmlFor="seed" className="text-lg">Seed</Label>
      <Input id="seed" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-36" />
    </div>
    <div className="flex items-center gap-2">
      <Label className="text-lg">Size</Label>
      <div className="w-36"><Slider value={[size]} min={16} max={256} step={1} onValueChange={(v) => setSize(v[0] ?? size)} /></div>
    </div>
    <div className="flex items-center gap-2">
      <Label className="text-lg">Speed</Label>
      <div className="w-36"><Slider value={[speed]} min={1} max={5} step={1} onValueChange={(v) => setSpeed(v[0] ?? speed)} /></div>
    </div>
    <Button variant="default" onClick={() => setSeed(String(Date.now()))}>Reset Array</Button>
  </>
);

function App() {
  const { enable } = useNoSleep()
  const [seed, setSeed] = useState<string>('sortdemo')
  const [size, setSize] = useState<number>(64)
  const [speed, setSpeed] = useState<number>(2)
  const [playing] = useState<boolean>(true)
  const [userArray, setUserArray] = useState<number[]>([])
  const [userSorted, setUserSorted] = useState(false)
  const [uiDone, setUiDone] = useState({ bubble: false, insertion: false, selection: false, quick: false })
  const base = useSeededArray(seed, size)
  
  // Initialize user array when base changes
  useEffect(() => {
    setUserArray(base.slice())
    setUserSorted(false)
  }, [base])
  const tick = useConductor(speed, playing)

  const width = typeof window !== 'undefined' ? Math.min(window.innerWidth - 64, 1760) : 1200
  const topHeight = Math.round((typeof window !== 'undefined' ? window.innerHeight : 800) * 0.32)
  const cellHeight = topHeight

  const bubbleFactory = (v: number[]) => createBubbleSortSteps(v)
  const insertionFactory = (v: number[]) => createInsertionSortSteps(v)
  const selectionFactory = (v: number[]) => createSelectionSortSteps(v)
  const quickFactory = (v: number[]) => createQuickSortSteps(v)

  useEffect(() => {
    setUiDone({ bubble: false, insertion: false, selection: false, quick: false })
  }, [base])

  const allUiDone = useMemo(() => Object.values(uiDone).every(Boolean), [uiDone])

  useEffect(() => {
    if (!allUiDone) return
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
  }, [allUiDone])

  useEffect(() => {
    const isSorted = userArray.every((val, i, arr) => !i || val >= arr[i - 1])
    setUserSorted(isSorted)
  }, [userArray])

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="h-screen w-full bg-background text-foreground" onClick={enable}>
      <div className="mx-auto grid h-full max-w-[1800px] grid-rows-[auto_1fr] gap-4 p-4 sm:p-6 lg:p-8">
        <div className="row-span-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AlgorithmCard 
            title="Bubble Sort" 
            initialValues={base} 
            factory={bubbleFactory} 
            width={isDesktop ? Math.floor(width / 4 - 18) : Math.floor(width / 2 - 12)}
            height={cellHeight} 
            tick={tick} 
            onDone={() => setUiDone((s) => ({ ...s, bubble: true }))}
          />
          <AlgorithmCard 
            title="Insertion Sort" 
            initialValues={base} 
            factory={insertionFactory} 
            width={isDesktop ? Math.floor(width / 4 - 18) : Math.floor(width / 2 - 12)}
            height={cellHeight} 
            tick={tick} 
            onDone={() => setUiDone((s) => ({ ...s, insertion: true }))}
          />
          <AlgorithmCard 
            title="Selection Sort" 
            initialValues={base} 
            factory={selectionFactory} 
            width={isDesktop ? Math.floor(width / 4 - 18) : Math.floor(width / 2 - 12)}
            height={cellHeight} 
            tick={tick} 
            onDone={() => setUiDone((s) => ({ ...s, selection: true }))}
          />
          <AlgorithmCard 
            title="Quick Sort" 
            initialValues={base} 
            factory={quickFactory} 
            width={isDesktop ? Math.floor(width / 4 - 18) : Math.floor(width / 2 - 12)}
            height={cellHeight} 
            tick={tick} 
            onDone={() => setUiDone((s) => ({ ...s, quick: true }))}
          />
        </div>
        <Card className="row-span-1 relative flex flex-col">
          <div className="pointer-events-none absolute inset-0 z-10">
            <Confetti active={userSorted} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-title">User Sort</CardTitle>
            {isDesktop ? (
              <div className="flex items-center gap-4"><Controls seed={seed} setSeed={setSeed} size={size} setSize={setSize} speed={speed} setSpeed={setSpeed} /></div>
            ) : (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Settings className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="h-screen overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Settings</SheetTitle>
                    <SheetDescription>
                      Adjust the sorting visualization parameters.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="py-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="seed" className="text-lg">Seed</Label>
                      <Input id="seed" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-48" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-lg">Size</Label>
                      <div className="w-48"><Slider value={[size]} min={16} max={256} step={1} onValueChange={(v) => setSize(v[0] ?? size)} /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-lg">Speed</Label>
                      <div className="w-48"><Slider value={[speed]} min={1} max={5} step={1} onValueChange={(v) => setSpeed(v[0] ?? speed)} /></div>
                    </div>
                    <Button variant="default" onClick={() => setSeed(String(Date.now()))}>Reset Array</Button>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </CardHeader>
          <CardContent className="overflow-hidden flex-grow">
            <div className="w-full h-full">
              <InteractiveBars 
                values={userArray} 
                width={isDesktop ? width : window.innerWidth - 32} 
                height={isDesktop ? topHeight : window.innerHeight * 0.4} 
                onValuesChange={setUserArray}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
