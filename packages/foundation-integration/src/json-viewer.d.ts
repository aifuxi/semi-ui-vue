interface DefaultAdapter<Props, State> {
  getContext(key: string): unknown;
  getContexts(): unknown;
  getProp<Key extends keyof Props>(key: Key): Props[Key];
  getProps(): Props;
  getState<Key extends keyof State>(key: Key): State[Key];
  getStates(): State;
  setState<Key extends keyof State>(state: Pick<State, Key>, callback?: () => void): void;
  getCache(key: unknown): unknown;
  getCaches(): unknown;
  setCache(key: unknown, value: unknown): unknown;
  stopPropagation(event: { stopPropagation?: () => void }): void;
  persistEvent(event: unknown): void;
}

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

export interface JsonViewerCustomRenderRule<RenderResult = unknown> {
  match:
    | string
    | RegExp
    | ((
        value: string | number | boolean | null,
        pathChain: string,
        tokenType: JsonViewerTokenRenderType,
      ) => boolean);
  render(value: string): RenderResult;
}

export interface JsonViewerOptions<RenderResult = unknown> {
  lineHeight?: number;
  autoWrap?: boolean;
  readOnly?: boolean;
  formatOptions?: JsonViewerFormattingOptions;
  completionOptions?: { staticCompletions?: JsonViewerCompletionItem[] };
  customRenderRule?: Array<JsonViewerCustomRenderRule<RenderResult>>;
  prefixCls?: string;
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

export interface JsonViewerCore {
  emitter: {
    on(
      event: 'customRender',
      listener: (event: { customRenderMap: Map<HTMLElement, unknown> }) => void,
    ): void;
    on(event: 'contentChanged', listener: () => void): void;
  };
  getModel(): { getValue(): string };
  getSearchWidget(): {
    searchResults?: JsonViewerSearchResult[];
    search(text: string, caseSensitive: boolean, wholeWord: boolean, regex: boolean): void;
    navigateResults(step: number): void;
    replace(text: string): void;
    replaceAll(text: string): void;
  };
  layout(): void;
  format(): void;
  dispose(): void;
}

export interface JsonViewerFoundationProps<RenderResult = unknown> {
  value: string;
  options: JsonViewerOptions<RenderResult>;
}

export interface JsonViewerFoundationState {
  searchOptions: { caseSensitive: boolean; wholeWord: boolean; regex: boolean };
  showSearchBar: boolean;
  customRenderMap: Map<HTMLElement, unknown>;
}

export interface JsonViewerAdapter<Props, State> extends DefaultAdapter<Props, State> {
  getEditorRef(): HTMLElement;
  getSearchRef(): HTMLInputElement;
  notifyChange(value: string): void;
  notifyHover(value: string, element: HTMLElement): HTMLElement | undefined;
  notifyCustomRender(customRenderMap: Map<HTMLElement, unknown>): void;
  setSearchOptions(key: string): void;
  showSearchBar(): void;
}

export class JsonViewerFoundation<
  Props extends JsonViewerFoundationProps,
  State extends JsonViewerFoundationState,
> {
  jsonViewer: JsonViewerCore | null;
  constructor(adapter: JsonViewerAdapter<Props, State>);
  init(): void;
  search(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean): void;
  prevSearch(step?: number): void;
  nextSearch(step?: number): void;
  replace(text: string): void;
  replaceAll(text: string): void;
  setSearchOptions(key: string): void;
  showSearchBar(): void;
  getSearchResults(): JsonViewerSearchResult[] | undefined;
}

export const jsonViewerCssClasses: { PREFIX: string };
