import type { CSSProperties } from 'vue';

export interface HighlightSearchWord {
  text: string;
  className?: string;
  style?: CSSProperties;
}

export type HighlightSearchWordValue = string | HighlightSearchWord | undefined;
export type HighlightSearchWords = HighlightSearchWordValue[];

export interface HighlightProps {
  autoEscape?: boolean;
  caseSensitive?: boolean;
  sourceString?: string;
  searchWords?: HighlightSearchWords;
  highlightStyle?: CSSProperties;
  highlightClassName?: string;
  component?: string;
}
