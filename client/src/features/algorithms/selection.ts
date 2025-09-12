import type { SortGenerator, SortOp, StepResult } from './types'

export function createSelectionSortSteps(values: number[]): SortGenerator {
  const a = values.slice()
  const n = a.length
  let i = 0
  let j = 1
  let minIdx = 0

  function step(): StepResult {
    if (i >= n - 1) {
      return { ops: [{ type: 'mark', indices: Array.from({ length: n }, (_, k) => k), role: 'sorted' }], done: true }
    }
    const ops: SortOp[] = []
    if (j === i + 1) {
      minIdx = i
      ops.push({ type: 'mark', indices: [i], role: 'range' })
    }
    ops.push({ type: 'compare', i: j, j: minIdx })
    if (a[j] < a[minIdx]) {
      minIdx = j
    }
    j++
    if (j >= n) {
      if (minIdx !== i) {
        const tmp = a[i]
        a[i] = a[minIdx]
        a[minIdx] = tmp
        ops.push({ type: 'swap', i, j: minIdx })
      }
      ops.push({ type: 'mark', indices: [i], role: 'sorted' })
      i++
      j = i + 1
    }
    return { ops, done: false }
  }

  function* run(): SortGenerator {
    while (true) {
      const res = step()
      yield res
      if (res.done) return res
    }
  }

  return run()
}



