import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useEffect, useRef, useState } from 'react'
import { PixiBars } from './PixiBars'
import { useSize } from './useSize'
import type { SortGenerator, SortOp } from '@/features/algorithms/types'

function applyOps(values: number[], ops: SortOp[]) {
  for (const op of ops) {
    if (op.type === 'swap') {
      const tmp = values[op.i]
      values[op.i] = values[op.j]
      values[op.j] = tmp
    } else if (op.type === 'write') {
      values[op.index] = op.value
    }
  }
}

export function AlgorithmCard({ title, initialValues, factory, width, height, tick }: { title: string; initialValues: number[]; factory: (v: number[]) => SortGenerator; width: number; height: number; tick: number; }) {
  const [local, setLocal] = useState<number[]>(initialValues)
  const [highlights, setHighlights] = useState<{ compare?: number[]; swap?: number[]; write?: number[] }>({})
  const genRef = useRef<SortGenerator | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const measured = useSize(containerRef)

  useEffect(() => {
    genRef.current = factory(initialValues.slice())
    setLocal(initialValues.slice())
    setHighlights({})
  }, [initialValues])

  useEffect(() => {
    const gen = genRef.current
    if (!gen) return
    const { value } = gen.next()
    if (!value) return
    let nextValues: number[]
    setLocal((prev) => {
      nextValues = prev.length ? prev.slice() : initialValues.slice()
      applyOps(nextValues!, value.ops)
      return nextValues!
    })
    const hl: any = {}
    for (const op of value.ops) {
      if (op.type === 'compare') hl.compare = [op.i, op.j]
      if (op.type === 'swap') hl.swap = [op.i, op.j]
      if (op.type === 'write') hl.write = [op.index]
    }
    setHighlights(hl)
  }, [tick])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <div ref={containerRef} className="w-full h-[28vh] md:h-[30vh] lg:h-[32vh]">
          <PixiBars values={local} width={measured.width || width} height={measured.height || height} highlights={highlights} />
        </div>
      </CardContent>
    </Card>
  )
}


