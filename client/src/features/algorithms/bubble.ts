import type { SortGenerator, StepResult, SortOp } from './types';

export function createBubbleSortSteps(values: number[]): SortGenerator {
  const a = values.slice();
  const n = a.length;
  let i = 0;
  let j = 0;
  let swappedInPass = false;

  function step(): StepResult {
    if (i >= n - 1) {
      return { ops: [{ type: 'mark', indices: Array.from({ length: n }, (_, k) => k), role: 'sorted' }], done: true };
    }
    const ops: SortOp[] = [];
    ops.push({ type: 'compare', i: j, j: j + 1 });
    if (a[j] > a[j + 1]) {
      const tmp = a[j];
      a[j] = a[j + 1];
      a[j + 1] = tmp;
      ops.push({ type: 'swap', i: j, j: j + 1 });
      swappedInPass = true;
    }
    j++;
    if (j >= n - 1 - i) {
      // end of pass
      ops.push({ type: 'mark', indices: [n - 1 - i], role: 'sorted' });
      i++;
      j = 0;
      if (!swappedInPass) {
        // already sorted
        return { ops: [...ops, { type: 'mark', indices: Array.from({ length: n }, (_, k) => k), role: 'sorted' }], done: true };
      }
      swappedInPass = false;
    }
    return { ops, done: false };
  }

  function* run(): SortGenerator {
    while (true) {
      const result = step();
      yield result;
      if (result.done) return result;
    }
  }

  return run();
}



