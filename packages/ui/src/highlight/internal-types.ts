import type { CSSProperties } from 'vue';

export interface HighlightChunk {
  start: number;
  end: number;
  highlight: boolean;
  className?: string;
  style?: CSSProperties;
}
