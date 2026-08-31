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

export interface SidebarContainerFoundationProps {
  visible?: boolean;
  closeOnEsc?: boolean;
  [key: string]: unknown;
}

export interface SidebarContainerFoundationState {
  displayNone: boolean;
}

export interface SidebarContainerAdapter extends DefaultAdapter<
  SidebarContainerFoundationProps,
  SidebarContainerFoundationState
> {
  notifyCancel(event: Event): void;
  notifyVisibleChange(visible: boolean): void;
  setOnKeyDownListener(): void;
  removeKeyDownListener(): void;
  toggleDisplayNone(displayNone: boolean): void;
}

export class SidebarContainerFoundation {
  constructor(adapter: SidebarContainerAdapter);
  destroy(): void;
  handleCancel(event: Event): void;
  beforeShow(): void;
  afterHide(): void;
  handleKeyDown(event: KeyboardEvent): void;
  onVisibleChange(visible: boolean): void;
  toggleDisplayNone(displayNone: boolean): void;
  handleAnimationEnd(): void;
}

export interface SidebarMCPOption {
  icon?: unknown;
  label?: string;
  value?: string;
  desc?: unknown;
  active?: boolean;
  disabled?: boolean;
  configure?: boolean;
}

export type SidebarMCPMode = 'inner' | 'custom';

export interface SidebarMCPFoundationProps {
  options?: SidebarMCPOption[];
  customOptions?: SidebarMCPOption[];
  filter?: (inputValue: string, option: SidebarMCPOption) => boolean;
  [key: string]: unknown;
}

export interface SidebarMCPFoundationState {
  mode: SidebarMCPMode;
  inputValue: string;
  showOptions: SidebarMCPOption[];
  cachedOptions: SidebarMCPOption[];
  cachedCustomOptions: SidebarMCPOption[];
}

export interface SidebarMCPConfigureAdapter extends DefaultAdapter<
  SidebarMCPFoundationProps,
  SidebarMCPFoundationState
> {
  notifyConfigureClick(event: MouseEvent, option: SidebarMCPOption): void;
  notifyEditClick(event: MouseEvent, option: SidebarMCPOption): void;
  notifyStatusChange(options: SidebarMCPOption[], custom: boolean): void;
  notifyAddClick(event: MouseEvent): void;
}

export class SidebarMCPConfigureFoundation {
  constructor(adapter: SidebarMCPConfigureAdapter);
  handleSearch(value: string): void;
  updateShowOptions(value: string, mode?: SidebarMCPMode): void;
  handleModeChange(event: { target: { value: SidebarMCPMode } }): void;
  onConfigureButtonClick(event: MouseEvent, option: SidebarMCPOption): void;
  onEditButtonClick(event: MouseEvent, option: SidebarMCPOption): void;
  handleStatusChange(option: SidebarMCPOption, checked: boolean): void;
  handleAddClick(event: MouseEvent): void;
}

export const sidebarCssClasses: Readonly<Record<string, string>>;
export const sidebarStrings: Readonly<{
  MODE: Readonly<{ MAIN: 'main'; CODE: 'code'; FILE: 'file' }>;
  MCP_MODE: Readonly<{ INNER: 'inner'; CUSTOM: 'custom' }>;
  DIRECTION: Readonly<Record<string, boolean>>;
  JSON_VIEWER_OPTIONS: Readonly<{ readOnly: true; autoWrap: true }>;
}>;

export function sidebarBaseFilter(value: string, option: SidebarMCPOption): boolean;
export function getSidebarFilterResult(
  inputValue: string,
  options?: SidebarMCPOption[],
  customFilter?: (inputValue: string, option: SidebarMCPOption) => boolean,
): SidebarMCPOption[];
