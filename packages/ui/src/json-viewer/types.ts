import type { HTMLAttributes, StyleValue, VNodeChild } from 'vue';

export type JsonViewerTokenRenderType = 'key' | 'value';

export interface JsonViewerFormattingOptions {
  tabSize?: number;
  insertSpaces?: boolean;
  eol?: string;
}

export interface JsonViewerCompletionItem {
  label: string;
  insertText?: string;
  detail?: string;
  documentation?: string;
}

export interface JsonViewerSearchResult {
  range: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
  matches?: string[];
}

export interface JsonViewerCustomRenderRule {
  match:
    | string
    | RegExp
    | ((
        value: string | number | boolean | null,
        pathChain: string,
        tokenType: JsonViewerTokenRenderType,
      ) => boolean);
  render(value: string): VNodeChild | HTMLElement;
}

export interface JsonViewerOptions {
  lineHeight?: number;
  autoWrap?: boolean;
  readOnly?: boolean;
  formatOptions?: JsonViewerFormattingOptions;
  completionOptions?: { staticCompletions?: JsonViewerCompletionItem[] };
  customRenderRule?: JsonViewerCustomRenderRule[];
  prefixCls?: string;
}

export interface JsonViewerSearchControls {
  showSearchBar: boolean;
  onToggleSearchBar(): void;
  onSearch(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean): void;
  onPrevSearch(): void;
  onNextSearch(): void;
  onReplace(text: string): void;
  onReplaceAll(text: string): void;
}

export interface JsonViewerProps {
  value?: string;
  width?: number | string;
  height?: number | string;
  showSearch?: boolean;
  class?: HTMLAttributes['class'];
  className?: HTMLAttributes['class'];
  style?: StyleValue;
  options?: JsonViewerOptions;
  limitSearchButtonBounds?: boolean;
  renderSearchButton?: (
    defaultSearchButton: VNodeChild,
    controls: JsonViewerSearchControls,
  ) => VNodeChild;
  renderTooltip?: (value: string, element: HTMLElement) => HTMLElement;
}

export interface JsonViewerEmits {
  change: [value: string];
  'update:value': [value: string];
}

export interface JsonViewerSlots {
  searchButton?: (props: {
    defaultSearchButton: VNodeChild;
    controls: JsonViewerSearchControls;
  }) => VNodeChild;
}

export interface JsonViewerExposed {
  getValue(): string;
  format(): void;
  search(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean): void;
  getSearchResults(): JsonViewerSearchResult[] | undefined;
  prevSearch(step?: number): void;
  nextSearch(step?: number): void;
  replace(text: string): void;
  replaceAll(text: string): void;
}

export interface JsonViewerLocale {
  search: string;
  replace: string;
  replaceAll: string;
}

export interface JsonViewerSearchOptions {
  caseSensitive: boolean;
  wholeWord: boolean;
  regex: boolean;
}
