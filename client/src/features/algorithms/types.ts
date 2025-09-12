export type CompareOp = { type: 'compare'; i: number; j: number };
export type SwapOp = { type: 'swap'; i: number; j: number };
export type WriteOp = { type: 'write'; index: number; value: number };
export type MarkOp = { type: 'mark'; indices: number[]; role: 'range' | 'pivot' | 'sorted' };
export type UnmarkOp = { type: 'unmark'; indices: number[] };
export type PivotOp = { type: 'pivot'; index: number };

export type SortOp = CompareOp | SwapOp | WriteOp | MarkOp | UnmarkOp | PivotOp;

export interface StepResult {
  ops: SortOp[];
  done: boolean;
}

export type SortGenerator = Generator<StepResult, StepResult, void>;


