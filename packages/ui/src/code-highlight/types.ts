import type { HTMLAttributes, StyleValue } from 'vue';

export interface CodeHighlightProps {
  code: string;
  language: string;
  lineNumber?: boolean;
  defaultTheme?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
}
