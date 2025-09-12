import type { SortGenerator, SortOp, StepResult } from './types'

// Quick sort with Lomuto partitioning visual ops
export function createQuickSortSteps(values: number[]): SortGenerator {
  const a = values.slice()
  const n = a.length
  const stack: Array<{ left: number; right: number; i?: number; j?: number; pivot?: number; phase?: 'partition' | 'recurse' }>=[]
  stack.push({ left: 0, right: n - 1, phase: 'partition' })

  function step(): StepResult {
    const ops: SortOp[] = []
    while (stack.length) {
      const frame = stack[stack.length - 1]
      const { left, right } = frame
      if (left >= right) {
        stack.pop()
        continue
      }
      if (frame.phase === 'partition') {
        if (frame.pivot === undefined) {
          frame.pivot = a[right]
          frame.i = left
          frame.j = left
          ops.push({ type: 'pivot', index: right })
          return { ops, done: false }
        }
        // compare a[j] with pivot
        ops.push({ type: 'compare', i: frame.j!, j: right })
        if (a[frame.j!] <= frame.pivot) {
          // swap a[i] and a[j]
          if (frame.i !== frame.j) {
            const t = a[frame.i!]; a[frame.i!] = a[frame.j!]; a[frame.j!] = t
            ops.push({ type: 'swap', i: frame.i!, j: frame.j! })
          }
          frame.i! += 1
        }
        frame.j! += 1
        if (frame.j! < right) {
          return { ops, done: false }
        }
        // place pivot
        if (frame.i !== right) {
          const t = a[frame.i!]; a[frame.i!] = a[right]; a[right] = t
          ops.push({ type: 'swap', i: frame.i!, j: right })
        }
        const p = frame.i!
        stack.pop()
        stack.push({ left, right: p - 1, phase: 'partition' })
        stack.push({ left: p + 1, right, phase: 'partition' })
        ops.push({ type: 'mark', indices: [p], role: 'sorted' })
        return { ops, done: false }
      }
    }
    // done
    return { ops: [{ type: 'mark', indices: Array.from({ length: n }, (_, i) => i), role: 'sorted' }], done: true }
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



