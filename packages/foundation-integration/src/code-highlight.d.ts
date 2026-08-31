export interface CodeHighlightFoundationProps {
  code: string;
  language: string;
  lineNumber: boolean;
}

export interface CodeHighlightAdapter {
  getProp<Key extends keyof CodeHighlightFoundationProps>(
    key: Key,
  ): CodeHighlightFoundationProps[Key];
  getProps(): CodeHighlightFoundationProps;
}

export class CodeHighlightFoundation {
  constructor(adapter: CodeHighlightAdapter);
  destroy(): void;
  highlightCode(element: HTMLElement, language: string): void;
}
