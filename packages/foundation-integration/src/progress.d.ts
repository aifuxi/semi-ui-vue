export interface ProgressStrokePoint {
  percent: number;
  color: string;
}

export function generateProgressColor(
  stroke: ProgressStrokePoint[],
  percent: number,
  gradient: boolean,
): string | undefined;

export class ProgressAnimation {
  constructor(props?: Record<string, unknown>, config?: Record<string, unknown>);
  on(event: string, callback: (state: Record<string, number>) => void): this;
  start(): void;
  destroy(): void;
}
