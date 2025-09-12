import * as Comlink from 'comlink'
import { createBubbleSortSteps } from '@/features/algorithms/bubble'
import { createInsertionSortSteps } from '@/features/algorithms/insertion'
import { createSelectionSortSteps } from '@/features/algorithms/selection'
import { createQuickSortSteps } from '@/features/algorithms/quick'
import type { SortGenerator, StepResult } from '@/features/algorithms/types'

type AlgoId = 'bubble' | 'insertion' | 'selection' | 'quick'

const factories: Record<AlgoId, (v: number[]) => SortGenerator> = {
  bubble: createBubbleSortSteps,
  insertion: createInsertionSortSteps,
  selection: createSelectionSortSteps,
  quick: createQuickSortSteps,
}

const generators = new Map<AlgoId, SortGenerator>()
const doneMap = new Map<AlgoId, boolean>()

function init(values: number[], algos: AlgoId[]) {
  generators.clear()
  doneMap.clear()
  for (const id of algos) {
    generators.set(id, factories[id](values))
    doneMap.set(id, false)
  }
}

function step(): Record<AlgoId, StepResult> {
  const result: Partial<Record<AlgoId, StepResult>> = {}
  for (const [id, gen] of generators.entries()) {
    if (doneMap.get(id as AlgoId)) {
      result[id as AlgoId] = { ops: [], done: true }
      continue
    }
    const iter = gen.next()
    const value = iter.value as StepResult | undefined
    if (value) {
      result[id as AlgoId] = value
      if (value.done) doneMap.set(id as AlgoId, true)
    } else if (iter.done) {
      doneMap.set(id as AlgoId, true)
      result[id as AlgoId] = { ops: [], done: true }
    }
  }
  return result as Record<AlgoId, StepResult>
}

Comlink.expose({ init, step })

export type WorkerApi = {
  init: typeof init
  step: typeof step
}


