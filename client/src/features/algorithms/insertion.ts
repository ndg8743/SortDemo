import type { SortGenerator, StepResult, SortOp } from './types';

export function createInsertionSortSteps(values: number[]): SortGenerator {
  const a = values.slice();
  const n = a.length;
  let i = 1;
  let j = 0;
  let key = a[1] ?? a[0];
  let phase: 'compare' | 'shift' | 'insert' = 'compare';

  function step(): StepResult {
    const ops: SortOp[] = [];
    if (i >= n) {
      return { ops: [{ type: 'mark', indices: Array.from({ length: n }, (_, k) => k), role: 'sorted' }], done: true };
    }
    if (phase === 'compare') {
      j = i - 1;
      key = a[i];
      ops.push({ type: 'compare', i: j, j: i });
      if (a[j] > key) {
        phase = 'shift';
      } else {
        phase = 'insert';
      }
      return { ops, done: false };
    }
    if (phase === 'shift') {
      ops.push({ type: 'write', index: j + 1, value: a[j] });
      a[j + 1] = a[j];
      j--;
      if (j >= 0 && a[j] > key) {
        ops.push({ type: 'compare', i: j, j: i });
        return { ops, done: false };
      } else {
        phase = 'insert';
        return { ops, done: false };
      }
    }
    // insert
    ops.push({ type: 'write', index: j + 1, value: key });
    a[j + 1] = key;
    ops.push({ type: 'mark', indices: [j + 1], role: 'sorted' });
    i++;
    phase = 'compare';
    return { ops, done: false };
  }

  function* run(): SortGenerator {
    while (true) {
      const res = step();
      yield res;
      if (res.done) return res;
    }
  }

  return run();
}



